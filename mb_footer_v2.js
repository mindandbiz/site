// ===================================================================
// Mind & Biz — Custom JS v2.0
// ===================================================================

// BLOCK 1: WhatsApp Floating Button (green)
(function(){
  function addWA(){
    if(document.getElementById('mb-wa-float')) return;
    var a=document.createElement('a');
    a.id='mb-wa-float';
    a.href='https://wa.me/5511999318970?text='+encodeURIComponent('Olá! Vi o site da Mind & Biz e gostaria de conversar.');
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.setAttribute('aria-label','WhatsApp');
    a.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
    a.style.cssText='position:fixed!important;bottom:24px!important;right:24px!important;z-index:9999!important;background:#25D366!important;border-radius:50%!important;width:56px!important;height:56px!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:0 4px 16px rgba(37,211,102,0.45)!important;text-decoration:none!important;';
    document.body.appendChild(a);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addWA);
  else addWA();
})();

// BLOCK 2: Icons for "Para quem é"
(function(){
  var C='#A68B5B';
  function icon(path){
    return '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="'+C+'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>';
  }
  var icons={
    'Startups pós-PMF':icon('<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'),
    'Empresas que querem usar IA no marketing':icon('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
    'Profissionais Liberais':icon('<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>')
  };
  function inject(){
    document.querySelectorAll('h1,h2,h3,h4,h5,p').forEach(function(el){
      var txt=(el.textContent||'').trim();
      if(!icons[txt]||el.dataset.mbIcon) return;
      el.dataset.mbIcon='1';
      var par=el.parentElement;
      if(!par||par.querySelector('.mb-icon')) return;
      var d=document.createElement('div');
      d.className='mb-icon';
      d.style.cssText='display:flex;justify-content:center;margin-bottom:14px;';
      d.innerHTML=icons[txt];
      par.insertBefore(d,el);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',inject);
  else inject();
  setTimeout(inject,2500);
})();

// BLOCK 3: Reorder "O que fazemos"
(function(){
  var ORDER=[
    'Consultoria Estratégica',
    'Posicionamento de Marca',
    'Identidade Visual',
    'Presença Digital',
    'Tráfego Pago',
    'Funil de Vendas'
  ];
  function reorder(){
    var grid=null;
    document.querySelectorAll('h3,h4,h5').forEach(function(h){
      if(h.textContent.trim()==='Consultoria Estratégica'){
        var p=h.parentElement;
        for(var i=0;i<6&&p;i++){
          if(p.parentElement&&p.parentElement.children.length>=4){grid=p.parentElement;break;}
          p=p.parentElement;
        }
      }
    });
    if(!grid) return;
    var children=Array.from(grid.children);
    var mapped=children.map(function(c){
      var h=c.querySelector('h3,h4,h5');
      return {el:c,title:h?h.textContent.trim():''};
    });
    mapped.sort(function(a,b){
      var ai=ORDER.indexOf(a.title),bi=ORDER.indexOf(b.title);
      if(ai<0)ai=99;if(bi<0)bi=99;
      return ai-bi;
    });
    mapped.forEach(function(m){grid.appendChild(m.el);});
  }
  setTimeout(reorder,2200);
})();

// BLOCK 4: Instrument Sans + z-index fix
(function(){
  if(!document.getElementById('mb-fonts')){
    var l=document.createElement('link');
    l.id='mb-fonts';l.rel='stylesheet';
    l.href='https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(l);
  }
  var s=document.getElementById('mb-contact');
  if(s) s.style.cssText+='position:relative;z-index:10;';
})();

// BLOCK 5: Header CTA patch
(function(){
  function isFixed(el){
    for(var i=0,p=el;i<6&&p;i++,p=p.parentElement){
      if(getComputedStyle(p).position==='fixed') return true;
    }
    return false;
  }
  function patchUI(){
    document.querySelectorAll('a').forEach(function(a){
      var href=a.getAttribute('href')||'';
      if(href.indexOf('wa.me')!==-1&&!a.closest('#mb-wa-float')&&!a.closest('[id*="whatsapp"]')&&!isFixed(a)){
        a.setAttribute('href','#mb-contact');
        a.addEventListener('click',function(e){
          e.preventDefault();
          var t=document.getElementById('mb-contact');
          if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
        });
        if(!a.style.color) a.style.color='#A68B5B';
      }
    });
    document.querySelectorAll('a,button').forEach(function(el){
      var txt=(el.textContent||'').trim();
      if(txt==='Falar com a Mind And Biz'&&!isFixed(el)){
        var p=el.closest('[class*="tatsu-column"]')||el.parentElement;
        if(p) p.style.display='none';
      }
    });
  }
  setTimeout(patchUI,2000);
})();

// BLOCK 6: Footer (logo + tagline + LinkedIn)
(function(){
  function addFooter(){
    if(document.getElementById('mb-footer')) return;
    var f=document.createElement('footer');
    f.id='mb-footer';
    f.style.cssText='background:#111!important;color:#F8F5F0;padding:48px 24px 32px;text-align:center;font-family:"Instrument Sans",sans-serif;';
    f.innerHTML=
      '<div style="max-width:700px;margin:0 auto;">'
      +'<div style="font-weight:800;font-size:20px;letter-spacing:0.15em;color:#F8F5F0;text-transform:uppercase;margin-bottom:6px;">MIND <span style="color:#A68B5B">&amp;</span> BIZ</div>'
      +'<div style="font-size:12px;color:#A68B5B;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:28px;">A mente que faz o negócio funcionar.</div>'
      +'<div style="margin-bottom:24px;">'
      +'<a href="https://www.linkedin.com/company/mind-and-biz" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;color:#C8C4BB;text-decoration:none;font-size:13px;border:1px solid rgba(168,139,91,0.3);padding:8px 18px;border-radius:4px;">'
      +'<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#A68B5B"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>'
      +'LinkedIn'
      +'</a>'
      +'</div>'
      +'<div style="color:#555;font-size:11px;border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">&copy; 2025 Mind &amp; Biz. Todos os direitos reservados.</div>'
      +'</div>';
    document.body.appendChild(f);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addFooter);
  else addFooter();
})();

// BLOCK 7: Contact Form (10s countdown + email domain filter)
(function(){
  if(document.getElementById('mb-contact')) return;
  var BLOCKED=['gmail','hotmail','yahoo','outlook','uol','bol','terra','ig','live','msn','icloud','protonmail','aol'];
  function isPublic(email){
    var m=email.toLowerCase().match(/@([^@.]+)/);
    if(!m) return false;
    return BLOCKED.indexOf(m[1])!==-1;
  }
  var style=document.createElement('style');
  style.textContent=
    '#mb-contact{background:#1E1E1E;padding:80px 24px;font-family:"Instrument Sans",sans-serif;}'
    +'#mb-contact .mb-label{display:block;color:#A68B5B;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:24px;}'
    +'#mb-contact h2{color:#F8F5F0;font-size:clamp(26px,4vw,40px);font-weight:700;line-height:1.2;margin:0 0 12px;}'
    +'#mb-contact .mb-sub{color:#C8C4BB;font-size:16px;margin:0 0 40px;}'
    +'#mb-form{max-width:520px;margin:0 auto;}'
    +'#mb-form input,#mb-form textarea{width:100%;box-sizing:border-box;background:rgba(255,255,255,0.05);border:1px solid rgba(168,139,91,0.3);color:#F8F5F0;font-family:"Instrument Sans",sans-serif;font-size:15px;padding:14px 16px;border-radius:6px;outline:none;transition:border-color 0.2s;margin-bottom:14px;}'
    +'#mb-form input:focus,#mb-form textarea:focus{border-color:#A68B5B;}'
    +'#mb-form input::placeholder,#mb-form textarea::placeholder{color:#666;}'
    +'#mb-form textarea{height:110px;resize:vertical;}'
    +'#mb-form .mb-submit{width:100%;background:#A68B5B;color:#fff;font-family:"Instrument Sans",sans-serif;font-size:15px;font-weight:600;padding:16px;border:none;border-radius:6px;cursor:pointer;letter-spacing:0.04em;}'
    +'#mb-form .mb-submit:hover{background:#8a7249;}'
    +'#mb-err{color:#ff6b6b;font-size:13px;margin:-6px 0 10px;display:none;}'
    +'#mb-countdown{text-align:center;padding:24px;color:#C8C4BB;display:none;}'
    +'#mb-success{text-align:center;display:none;}'
    +'#mb-success h3{color:#F8F5F0;font-size:22px;margin-bottom:8px;}'
    +'#mb-success p{color:#C8C4BB;font-size:15px;}';
  document.head.appendChild(style);
  var sec=document.createElement('section');
  sec.id='mb-contact';
  sec.innerHTML=
    '<div style="max-width:680px;margin:0 auto;text-align:center;">'
    +'<span class="mb-label">PRÓXIMO PASSO</span>'
    +'<h2>Uma conversa de 20 minutos.<br>Sem proposta. Sem pressão.</h2>'
    +'<p class="mb-sub">Para entender se faz sentido trabalharmos juntos.</p>'
    +'<div id="mb-form">'
    +'<input id="mb-nome" type="text" placeholder="Seu nome" />'
    +'<input id="mb-email" type="email" placeholder="seu@empresa.com.br" />'
    +'<div id="mb-err"></div>'
    +'<input id="mb-tel" type="tel" placeholder="WhatsApp (opcional)" />'
    +'<textarea id="mb-msg" placeholder="Conte brevemente sobre seu negócio e o que quer resolver."></textarea>'
    +'<button class="mb-submit" id="mb-btn">Quero conversar →</button>'
    +'</div>'
    +'<div id="mb-countdown"></div>'
    +'<div id="mb-success">'
    +'<h3>Perfeito. ✓</h3>'
    +'<p>Sua mensagem chegou à Mind &amp; Biz.<br>Respondemos em até 24h.</p>'
    +'</div>'
    +'</div>';
  document.body.appendChild(sec);
  document.getElementById('mb-btn').addEventListener('click',function(){
    var nome=(document.getElementById('mb-nome').value||'').trim();
    var email=(document.getElementById('mb-email').value||'').trim();
    var tel=(document.getElementById('mb-tel').value||'').trim();
    var msg=(document.getElementById('mb-msg').value||'').trim();
    var err=document.getElementById('mb-err');
    function showErr(t){err.style.display='block';err.textContent=t;}
    err.style.display='none';
    if(!nome||!email||!msg) return showErr('Preencha nome, e-mail e mensagem.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr('E-mail inválido.');
    if(isPublic(email)) return showErr('Use um e-mail corporativo para prosseguir.');
    var waMsg='Olá, sou '+nome+' ('+email+')'+(tel?' — '+tel:'')+'. '+msg;
    var waURL='https://wa.me/5511999318970?text='+encodeURIComponent(waMsg);
    document.getElementById('mb-form').style.display='none';
    var cd=document.getElementById('mb-countdown');
    cd.style.display='block';
    var n=10;
    function tick(){
      cd.innerHTML='<p style="font-size:18px;margin-bottom:8px;">Abrindo WhatsApp em <strong style="color:#A68B5B">'+n+'</strong>s…</p>'
        +'<p style="font-size:13px;color:#888;">Ou <a href="'+waURL+'" target="_blank" style="color:#A68B5B;">clique aqui</a> para abrir agora.</p>';
    }
    tick();
    var t=setInterval(function(){
      n--;
      if(n<=0){
        clearInterval(t);
        cd.style.display='none';
        document.getElementById('mb-success').style.display='block';
        window.open(waURL,'_blank');
      } else tick();
    },1000);
  });
})();

// BLOCK 8: "MIND & BIZ" text logo in header
(function(){
  function addLogo(){
    if(document.getElementById('mb-hdr-logo')) return;
    var nav=document.querySelector('nav,[class*="tatsu-header"],[class*="tatsu-menu"],[class*="navbar"]');
    if(!nav) return;
    var logo=document.createElement('div');
    logo.id='mb-hdr-logo';
    logo.style.cssText='position:absolute;left:24px;top:50%;transform:translateY(-50%);z-index:9998;pointer-events:auto;';
    logo.innerHTML='<a href="/" style="text-decoration:none;">'
      +'<span style="font-family:\'Instrument Sans\',sans-serif;font-weight:800;font-size:16px;letter-spacing:0.15em;color:#F8F5F0;text-transform:uppercase;">MIND <span style="color:#A68B5B">&amp;</span> BIZ</span>'
      +'</a>';
    if(getComputedStyle(nav).position==='static') nav.style.position='relative';
    nav.appendChild(logo);
  }
  setTimeout(addLogo,1500);
})();

// BLOCK 9: target="_blank" on all external links
(function(){
  function patchLinks(){
    document.querySelectorAll('a[href]').forEach(function(a){
      var h=a.getAttribute('href')||'';
      if((h.startsWith('http://')||h.startsWith('https://'))&&!a.getAttribute('target')){
        a.setAttribute('target','_blank');
        a.setAttribute('rel','noopener noreferrer');
      }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',patchLinks);
  else patchLinks();
  setTimeout(patchLinks,2500);
})();
