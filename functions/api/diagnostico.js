/**
 * Registra no Notion cada diagnóstico preenchido em /diagnostico — inclusive
 * os que nunca viram contato no WhatsApp, que são justamente os invisíveis.
 *
 * Roda como Cloudflare Pages Function (plano gratuito: 100k req/dia).
 *
 * Segredo necessário (uma vez):
 *   npx wrangler pages secret put NOTION_TOKEN --project-name mindandbiz-site
 *
 * O ID da base não é segredo — sem o token ele não abre nada.
 */

const NOTION_DB      = 'e7ba462d-a335-4d55-bac0-d9b8acdf887f'; // Diagnósticos (site)
const NOTION_VERSION = '2022-06-28';
const LIMITE_BYTES   = 24 * 1024;

const ORIGENS_OK = [
  'https://www.mindandbiz.com.br',
  'https://mindandbiz.com.br',
  'https://mindandbiz-site.pages.dev',
  'https://preview-diagnostico.mindandbiz-site.pages.dev'
];

/* ── helpers ────────────────────────────────────────────────────── */

const cors = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
});

const json = (corpo, status) =>
  new Response(JSON.stringify(corpo), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json' }, cors())
  });

const cabecalhos = env => ({
  'Authorization': 'Bearer ' + env.NOTION_TOKEN,
  'Notion-Version': NOTION_VERSION,
  'Content-Type': 'application/json'
});

const texto = (v, max) => ({
  rich_text: [{ text: { content: String(v == null ? '' : v).slice(0, max || 1800) } }]
});

const numero = v => ({ number: (typeof v === 'number' && isFinite(v)) ? v : null });

/* Achados viram o corpo da página, para caberem inteiros. */
function blocosAchados(achados) {
  if (!Array.isArray(achados) || !achados.length) return [];
  const blocos = [{
    object: 'block', type: 'heading_2',
    heading_2: { rich_text: [{ text: { content: 'Pontos que sangram' } }] }
  }];
  achados.slice(0, 20).forEach(a => {
    blocos.push({
      object: 'block', type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          { text: { content: String(a && a.titulo || '').slice(0, 180) }, annotations: { bold: true } },
          { text: { content: ' — ' + String(a && a.texto || '').slice(0, 1600) } }
        ]
      }
    });
  });
  return blocos;
}

/* ── handlers ───────────────────────────────────────────────────── */

export const onRequestOptions = () => new Response(null, { status: 204, headers: cors() });

export async function onRequestPost({ request, env }) {
  // Origem primeiro: quem vem de fora não precisa saber nada sobre a
  // configuração daqui. Não impede um curioso determinado, mas corta
  // abuso casual de outro site.
  const origem = request.headers.get('Origin') || '';
  if (origem && ORIGENS_OK.indexOf(origem) === -1) return json({ erro: 'origem não autorizada' }, 403);

  if (!env.NOTION_TOKEN) return json({ erro: 'NOTION_TOKEN ausente' }, 500);

  const bruto = await request.text();
  if (bruto.length > LIMITE_BYTES) return json({ erro: 'payload grande demais' }, 413);

  let d;
  try { d = JSON.parse(bruto); } catch (e) { return json({ erro: 'json inválido' }, 400); }

  // Segunda chamada: o lead clicou para pedir o diagnóstico completo.
  if (d.pageId) {
    const r = await fetch('https://api.notion.com/v1/pages/' + encodeURIComponent(d.pageId), {
      method: 'PATCH',
      headers: cabecalhos(env),
      body: JSON.stringify({ properties: { 'Pediu completo': { checkbox: true } } })
    });
    return json({ ok: r.ok }, r.ok ? 200 : 502);
  }

  const s = d.scores || {};
  const props = {
    'Empresa':         { title: [{ text: { content: String(d.empresa || 'Sem nome').slice(0, 200) } }] },
    'Status':          { select: { name: 'Novo' } },
    'Pediu completo':  { checkbox: false },
    'Score geral':     numero(d.geral),
    'Marca':           numero(s.marca),
    'Território':      numero(s.territorio),
    'Distribuição':    numero(s.distribuicao),
    'Aquisição':       numero(s.aquisicao),
    'Conversão':       numero(s.conversao),
    'Frente crítica':  texto(d.frenteCritica, 120),
    'Pessoa':          texto(d.nome, 120),
    'Contato':         texto(d.contato, 200),
    'Segmento':        texto(d.segmento, 300),
    'Faturamento':     texto(d.faturamento, 80),
    'Objetivo':        texto(d.objetivo, 200),
    'Trava declarada': texto(d.trava, 1200),
    'Concorrentes':    texto(d.concorrentes, 400)
  };
  if (d.link && /^https?:\/\//.test(d.link)) {
    props['Ver diagnóstico'] = { url: String(d.link).slice(0, 1900) };
  }

  const r = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: cabecalhos(env),
    body: JSON.stringify({
      parent: { database_id: NOTION_DB },
      properties: props,
      children: blocosAchados(d.achados)
    })
  });

  if (!r.ok) {
    const detalhe = (await r.text()).slice(0, 400);
    return json({ erro: 'notion recusou', detalhe }, 502);
  }
  const criado = await r.json();
  return json({ ok: true, id: criado.id });
}
