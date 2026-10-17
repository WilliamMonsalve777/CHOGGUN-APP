/* ================= CHOGGUN — pantallas ================= */
const A={}, F={}, I={};
const UI={ feedTab:'parati', feedFmt:'all', exploreQ:'', exploreFilter:'all', commTab:'popular', profileTab:'obras', replyTo:null, commentSort:'top', matchFilters:{roles:[],genres:[],collab:[]}, lastSkipped:[] };

/* ======================= ONBOARDING ======================= */
const ONB=[
  {img:true,t:'Bienvenido a CHOGGUN',d:'La comunidad colaborativa de escritores, ilustradores y lectores de Latinoamérica.'},
  {e:'📖🎨',t:'Publica en todos los formatos',d:'Novelas por capítulos, relatos, manga, cómic e ilustración en un mismo lugar. Recibe votos, comentarios y feedback real.'},
  {e:'🤝',t:'Encuentra tu colaborador ideal',d:'Haz match con creadores según su rol, géneros favoritos y el tipo de colaboración que buscan. Créditos compartidos en cada obra.'},
];
SCREENS.onboarding={ noNav:true, render(p){ const i=p.i||0, s=ONB[i];
  return `<div class="row between" style="padding:calc(10px + var(--safe-top)) 14px 0"><span></span><button class="btn btn-sm btn-ghost" data-a="onbDone">Saltar</button></div>
  <div class="onb"><div class="art">${s.img?`<img src="${ASSETS.logo}" alt="CHOGGUN">`:s.e}</div><div class="h1">${s.t}</div><p class="muted" style="font-size:17px;max-width:330px">${s.d}</p></div>
  <div style="padding:0 24px calc(26px + var(--safe-bottom))"><div class="dots" style="margin-bottom:22px">${ONB.map((_,k)=>`<i class="${k===i?'on':''}" data-a="onbGo" data-i="${k}"></i>`).join('')}</div>
  <button class="btn btn-primary btn-block" data-a="${i<ONB.length-1?'onbGo':'onbDone'}" data-i="${i+1}">${i<ONB.length-1?'Siguiente':'Empezar'} ${icon('chevR')}</button></div>`; } };
A.onbGo=el=>{ replace('onboarding',{i:+el.dataset.i}); };
A.onbDone=()=>{ S.settings.onboarded=true; save(); stack=[{name:'auth',params:{mode:'login',first:true}}]; render(); };

/* ======================= AUTH ======================= */
SCREENS.auth={ noNav:true, render(p){ const reg=p.mode==='register';
  return `${p.first?'':topbar({title:''})}<div class="scroll">
  <div class="auth-hero" style="${p.first?'padding-top:calc(40px + var(--safe-top))':''}"><img src="${ASSETS.logo}" alt=""><div class="h1 gold" style="letter-spacing:.14em">CHOGGUN</div><div class="muted small">Escribe. Ilustra. Colabora.</div></div>
  <div class="pad"><div class="seg" style="margin-bottom:18px"><button class="${reg?'':'on'}" data-a="authMode" data-m="login">Iniciar sesión</button><button class="${reg?'on':''}" data-a="authMode" data-m="register">Crear cuenta</button></div>
  ${reg?`<form data-f="register" novalidate>
    <div class="row" style="gap:10px"><label class="field grow"><span>Nombre</span><input class="input" name="name" placeholder="Juana" autocomplete="given-name" required></label><label class="field grow"><span>Apellido</span><input class="input" name="last" placeholder="Pérez" autocomplete="family-name" required></label></div>
    <label class="field"><span>Nombre de usuario</span><div class="input-wrap">${icon('at')}<input class="input" name="username" placeholder="choggunero123" autocapitalize="off" autocomplete="username" required></div><div class="hint">3–20 caracteres: letras, números o _</div></label>
    <label class="field"><span>Correo electrónico</span><div class="input-wrap">${icon('mail')}<input class="input" type="email" name="email" placeholder="correo@ejemplo.com" autocomplete="email" required></div></label>
    <label class="field"><span>Contraseña</span><div class="input-wrap">${icon('lock')}<input class="input" type="password" name="pass" placeholder="••••••••" autocomplete="new-password" required><button type="button" class="icon-btn eye" data-a="togglePw">${icon('eye')}</button></div><div class="hint">Mínimo 6 caracteres, con al menos un número y una minúscula</div></label>
    <label class="field"><span>Confirmar contraseña</span><div class="input-wrap">${icon('lock')}<input class="input" type="password" name="pass2" placeholder="••••••••" autocomplete="new-password" required></div></label>
    <div class="field"><span>Soy…</span><div class="chips wrap" data-single="role">${ROLES.map((r,i)=>`<button type="button" class="chip ${i===0?'on':''}" data-a="chipSingle" data-v="${r}">${['✍️','🎨','📚'][i]} ${r}</button>`).join('')}</div><input type="hidden" name="role" value="${ROLES[0]}"></div>
    <label class="row small muted" style="margin:6px 0 16px;gap:10px"><input type="checkbox" name="terms" style="width:20px;height:20px;accent-color:var(--gold)"> Acepto las <button type="button" class="link" data-a="rules">normas de la comunidad</button></label>
    <div class="err" data-err style="margin-bottom:10px"></div>
    <button class="btn btn-primary btn-block">Crear cuenta</button></form>`
  :`<form data-f="login" novalidate>
    <label class="field"><span>Usuario o correo</span><div class="input-wrap">${icon('user')}<input class="input" name="id" placeholder="tu_usuario" autocapitalize="off" autocomplete="username" required></div></label>
    <label class="field"><span>Contraseña</span><div class="input-wrap">${icon('lock')}<input class="input" type="password" name="pass" placeholder="••••••••" autocomplete="current-password" required><button type="button" class="icon-btn eye" data-a="togglePw">${icon('eye')}</button></div></label>
    <div class="row between small" style="margin:-4px 0 16px"><span></span><button type="button" class="link" data-a="forgot">¿Olvidaste tu contraseña?</button></div>
    <div class="err" data-err style="margin-bottom:10px"></div>
    <button class="btn btn-primary btn-block">Entrar</button></form>
    <div class="divider">o</div>
    <button class="btn btn-ghost btn-block" data-a="demoLogin">${icon('sparkles')} Entrar con cuenta demo</button>`}
  <button class="btn btn-block" style="margin-top:10px;color:var(--muted)" data-a="guest">Explorar como invitado</button>
  <p class="tiny faint center" style="margin:18px 0 10px">Tus datos se guardan de forma local en este dispositivo (prototipo SIIANTEC · TEINCO).</p>
  </div></div>`; } };
A.authMode=el=>{ replace('auth',{...current().params,mode:el.dataset.m}); };
A.togglePw=el=>{ const i=el.parentElement.querySelector('input'); i.type=i.type==='password'?'text':'password'; el.innerHTML=icon(i.type==='password'?'eye':'eyeOff'); };
A.chipSingle=el=>{ const box=el.closest('[data-single]'); $$('.chip',box).forEach(c=>c.classList.toggle('on',c===el)); const h=box.parentElement.querySelector(`input[name=${box.dataset.single}]`); if(h) h.value=el.dataset.v; };
A.forgot=()=>showDialog({title:'Recuperar contraseña',text:'En esta versión prototipo las cuentas se guardan en tu dispositivo. Puedes usar la cuenta demo o crear una nueva. En producción se enviará un enlace a tu correo (Firebase Authentication).',ok:'Entendido',cancel:''});
A.guest=()=>{ stack=[{name:'home',params:{}}]; render(); toast('Explorando como invitado 👀'); };
F.login=form=>{
  const d=Object.fromEntries(new FormData(form)); const err=$('[data-err]',form);
  if(!d.id.trim()||!d.pass){ err.textContent='Completa usuario y contraseña'; return; }
  const idn=d.id.trim().toLowerCase();
  const u=Object.values(S.users).find(x=>(x.username.toLowerCase()===idn||String(x.email).toLowerCase()===idn));
  if(!u||!u.passHash||u.passHash!==pwHash(d.pass)){ err.textContent='Usuario o contraseña incorrectos'; return; }
  loginAs(u.username); toast(`¡Bienvenido de nuevo, ${u.name.split(' ')[0]}! ⚔️`);
};
F.register=form=>{
  const d=Object.fromEntries(new FormData(form)); const err=$('[data-err]',form); const un=(d.username||'').trim();
  if(!d.name.trim()||!d.last.trim()||!un||!d.email.trim()||!d.pass){ err.textContent='Completa todos los campos'; return; }
  if(!/^[a-zA-Z0-9_]{3,20}$/.test(un)){ err.textContent='El usuario debe tener 3–20 caracteres (letras, números o _)'; return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())){ err.textContent='Escribe un correo válido'; return; }
  if(d.pass.length<6||!/[a-z]/.test(d.pass)||!/\d/.test(d.pass)){ err.textContent='La contraseña debe tener 6+ caracteres, un número y una minúscula'; return; }
  if(d.pass!==d.pass2){ err.textContent='Las contraseñas no coinciden'; return; }
  if(!d.terms){ err.textContent='Debes aceptar las normas de la comunidad'; return; }
  if(Object.keys(S.users).some(k=>k.toLowerCase()===un.toLowerCase())){ err.textContent='Ese nombre de usuario ya existe'; return; }
  if(Object.values(S.users).some(x=>String(x.email).toLowerCase()===d.email.trim().toLowerCase())){ err.textContent='Ya existe una cuenta con ese correo'; return; }
  S.users[un]={username:un,name:`${d.name.trim()} ${d.last.trim()}`,email:d.email.trim(),passHash:pwHash(d.pass),role:d.role||ROLES[0],avatar:null,bio:'',genres:[],collab:[],followers:[],following:[],joined:Date.now(),banner:un+Date.now(),karma:0,followersBase:0};
  save(true); loginAs(un,true);
};
function loginAs(un,isNew){
  S.session=un; const m=me();
  if(!S.joined[un]) S.joined[un]=[];
  if(!Object.values(S.chats).some(c=>c.owner===un && c.with==='choggun')){
    const id=chatId('choggun'); S.chats[id]={owner:un,with:'choggun',unread:true,msgs:CHAT_SEED[1].msgs.map(x=>({from:x.from,text:x.text,t:Date.now()-60000}))};
    notify(un,{type:'system',text:`<b>¡Bienvenido/a a CHOGGUN, ${esc(m.name.split(' ')[0])}!</b> Completa tu perfil para recibir mejores sugerencias de colaboración.`,link:{s:'editProfile'}});
  }
  save(true);
  stack=[{name:'home',params:{}}];
  if(isNew){ stack.push({name:'editProfile',params:{first:true}}); toast('🎉 ¡Cuenta creada!'); }
  navAnim=true; render();
}
A.demoLogin=()=>{
  if(!S.users.demo){
    S.users.demo={username:'demo',name:'Usuario Demo',email:'demo@choggun.app',passHash:pwHash('choggun1'),role:'Escritor/a',avatar:'logo',bio:'Cuenta de demostración. Escribo fantasía y busco ilustradores para mis historias. ✍️',genres:['Fantasía','Misterio','Aventura','Ciencia ficción'],collab:['Portadas','Ilustrar capítulos'],followers:['mateo_gil','sofia_letras'],following:['luis_herrera','camila_ilustra','kenji_bog'],joined:Date.now()-40*24*H,banner:'demo-banner',karma:540,followersBase:37};
    S.joined.demo=['novelas','manga','colaboraciones','ilustracion'];
    S.saved.demo=['w2','w4'];
    S.history.demo={w1:{ch:1,pct:.4,t:Date.now()-3*H,read:[0]},w2:{ch:0,pct:.7,t:Date.now()-26*H,read:[]}};
    S.works.push({id:'wdemo',type:'relato',title:'La bruja del Chorro de Quevedo',author:'demo',credits:[],genres:['Fantasía','Realismo mágico'],community:'relatos',synopsis:'Borrador: una bruja vende tinto y destinos en La Candelaria.',chapters:[{title:'Borrador',text:'Dicen que en el Chorro de Quevedo, cuando la neblina baja de Monserrate, aparece un puesto de tinto que no estaba ahí un minuto antes...'}],votes:{},comments:[],status:'borrador',license:'Todos los derechos reservados',views:0,created:Date.now()-5*H,baseVotes:0,motif:'moon',coverSeed:'bruja'});
    ['luis_herrera','camila_ilustra','kenji_bog'].forEach(u=>{ S.users[u].followers=[...new Set([...(S.users[u].followers||[]),'demo'])]; });
  }
  loginAs('demo'); toast('Sesión demo iniciada · usuario: demo / clave: choggun1');
};

/* ======================= HOME ======================= */
function headerActions(){
  return `<button class="icon-btn" data-a="tab" data-t="explore" aria-label="Buscar">${icon('search')}</button><button class="icon-btn" data-a="go" data-s="chats" aria-label="Mensajes">${icon('chat')}<span class="badge" data-badge="chats" style="display:none"></span></button><button class="icon-btn" data-a="go" data-s="notifs" aria-label="Notificaciones">${icon('bell')}<span class="badge" data-badge="notifs" style="display:none"></span></button>`;
}
function feedList(){
  let list=visibleWorks(); const m=me();
  if(UI.feedFmt!=='all') list=list.filter(w=>w.type===UI.feedFmt);
  if(UI.feedTab==='siguiendo'){
    if(!m) return null;
    const j=S.joined[m.username]||[];
    list=list.filter(w=>(m.following||[]).includes(w.author)||j.includes(w.community)||w.author===m.username);
    list.sort((a,b)=>b.created-a.created);
  }else if(UI.feedTab==='nuevo') list.sort((a,b)=>b.created-a.created);
  else list.sort((a,b)=>(b.pinned?1e9:0)+hot(b)-((a.pinned?1e9:0)+hot(a)));
  return list;
}
SCREENS.home={ render(){
  const m=me(); const list=feedList();
  const hist=m?Object.entries(S.history[m.username]||{}).map(([id,h])=>({w:work(id),h})).filter(x=>x.w&&!x.w.removed).sort((a,b)=>b.h.t-a.h.t):[];
  let posts='';
  if(list===null) posts=emptyHTML('🔒','Inicia sesión','Inicia sesión para ver las publicaciones de las personas y comunidades que sigues.',`<button class="btn btn-primary" data-a="go" data-s="auth" data-mode="login">Iniciar sesión</button>`);
  else if(!list.length) posts=emptyHTML('🌱','Nada por aquí todavía', UI.feedTab==='siguiendo'?'Sigue a creadores o únete a comunidades para llenar este feed.':'No hay publicaciones con este filtro.', UI.feedTab==='siguiendo'?`<button class="btn btn-primary" data-a="tab" data-t="explore">Explorar comunidades</button>`:'');
  else list.forEach((w,i)=>{ posts+=postCard(w); if(i===2 && UI.feedTab==='parati') posts+=suggestStrip(); });
  return `${topbar({back:false,brand:true,actions:headerActions()})}
  <div class="tabs">${[['parati','Para ti'],['siguiendo','Siguiendo'],['nuevo','Nuevo']].map(([k,l])=>`<button class="tab ${UI.feedTab===k?'on':''}" data-a="feedTab" data-k="${k}">${l}</button>`).join('')}</div>
  <div class="scroll pb-nav"><div class="pad">
    <div class="chips" style="margin-bottom:14px">${[['all','✨ Todo'],...Object.entries(FORMATS).map(([k,f])=>[k,`${f.emoji} ${f.label}`])].map(([k,l])=>`<button class="chip ${UI.feedFmt===k?'on':''}" data-a="feedFmt" data-k="${k}">${l}</button>`).join('')}</div>
    ${!m?`<div class="banner-tip" style="margin-bottom:14px"><img src="${ASSETS.logo}" alt=""><div class="grow"><b class="h3">Únete a la comunidad</b><div class="small muted">Publica tus obras, vota y encuentra colaboradores.</div></div><button class="btn btn-primary btn-sm" data-a="go" data-s="auth" data-mode="register">Unirme</button></div>`:''}
    ${hist.length && UI.feedTab==='parati' && UI.feedFmt==='all'?`<div class="section-label"><span>Continuar leyendo</span></div><div class="shelf" style="margin-bottom:8px">${hist.map(({w,h})=>`<button class="shelf-item" data-a="read" data-id="${w.id}" data-ch="${h.ch}" style="text-align:left"><div class="cover">${coverHTML(w)}</div><div class="t clamp2">${esc(w.title)}</div><div class="tiny muted">Cap. ${h.ch+1} de ${(w.chapters||[]).length}</div><div class="progress"><i style="width:${Math.round(((h.ch+(h.pct||0))/Math.max(1,(w.chapters||[]).length))*100)}%"></i></div></button>`).join('')}</div><div class="section-label"><span>Publicaciones</span></div>`:''}
    ${posts}
  </div></div>`; }, after(){ updateBadges(); } };
function suggestStrip(){
  const m=me(); const cands=Object.values(S.users).filter(u=>!u.official && u.username!==S.session && !(m&&(m.following||[]).includes(u.username))).slice(0,8);
  if(!cands.length) return '';
  return `<div class="card" style="padding:14px;margin-bottom:14px"><div class="row between" style="margin-bottom:10px"><b class="h3">${icon('zap','width="18" height="18" style="display:inline;vertical-align:-3px;color:var(--gold)"')} Colaboradores sugeridos</b><button class="link small" data-a="tab" data-t="match">Ir a Match</button></div><div class="shelf">${cands.map(u=>`<button class="shelf-item center" style="width:92px" data-a="user" data-u="${u.username}">${avatarHTML(u,'av-lg')}<div class="t ellipsis" style="font-size:13px">${esc(u.name.split(' ')[0])}</div><div class="tiny muted">${esc(u.role)}</div></button>`).join('')}</div></div>`;
}
A.feedTab=el=>{ UI.feedTab=el.dataset.k; current().scroll=0; refresh(); };
A.feedFmt=el=>{ UI.feedFmt=el.dataset.k; refresh(); };

/* ======================= ACCIONES DE POST ======================= */
A.tab=el=>setTab(el.dataset.t);
A.back=()=>back();
A.go=el=>{ const s=el.dataset.s; const p={...el.dataset}; delete p.a; delete p.s; if(['chats','notifs','matches'].includes(s) && !requireAuth('ver esta sección')) return; go(s,p); };
A.open=el=>{ const w=work(el.dataset.id); if(!w) return; w.views=(w.views||0)+1; save(); go('work',{id:w.id,focus:el.dataset.focus||''}); };
A.user=el=>{ const u=el.dataset.u; if(u===S.session) setTab('profile'); else go('user',{u}); };
A.comm=el=>go('community',{id:el.dataset.id});
A.vote=el=>{
  if(!requireAuth('votar')) return; const w=work(el.dataset.id); const dir=+el.dataset.dir; const cur=myVote(w);
  w.votes=w.votes||{}; if(cur===dir) delete w.votes[S.session]; else w.votes[S.session]=dir;
  if(dir>0 && cur!==1 && w.author!==S.session) notify(w.author,{type:'vote',text:`<b>${esc(me().name)}</b> votó tu obra “${esc(w.title)}”`,link:{s:'work',id:w.id}});
  save();
  $$(`.vote`).forEach(v=>{ const b=v.querySelector(`[data-id="${w.id}"]`); if(b){ v.outerHTML=voteHTML(w); } });
  if(navigator.vibrate) try{navigator.vibrate(8)}catch(e){}
};
A.save=el=>{
  if(!requireAuth('guardar obras')) return; const id=el.dataset.id; const arr=S.saved[S.session]=S.saved[S.session]||[];
  const i=arr.indexOf(id); if(i>=0){ arr.splice(i,1); toast('Eliminado de guardados'); } else { arr.unshift(id); toast('🔖 Guardado en tu biblioteca'); }
  save(); refresh();
};
A.share=el=>{ const w=work(el.dataset.id); shareText(w.title, `${FORMATS[w.type].label} de ${user(w.author).name}: ${w.synopsis.slice(0,140)}…`); };
A.unhide=el=>{ const arr=S.hidden[S.session]||[]; S.hidden[S.session]=arr.filter(x=>x!==el.dataset.id); save(); refresh(); };
A.postMenu=el=>{
  const w=work(el.dataset.id); const mine=w.author===S.session;
  showSheet(`
    <button class="opt" data-a="save" data-id="${w.id}">${icon('bookmark')} ${isSaved(w.id)?'Quitar de guardados':'Guardar'}</button>
    <button class="opt" data-a="share" data-id="${w.id}">${icon('share')} Compartir</button>
    <button class="opt" data-a="user" data-u="${w.author}">${icon('user')} Ver perfil de ${esc(user(w.author).name.split(' ')[0])}</button>
    ${mine?`<button class="opt" data-a="editWork" data-id="${w.id}">${icon('edit')} Editar</button><button class="opt danger" data-a="deleteWork" data-id="${w.id}">${icon('trash')} Eliminar</button>`
    :`<button class="opt" data-a="hide" data-id="${w.id}">${icon('eyeOff')} Ocultar publicación</button><button class="opt danger" data-a="report" data-kind="work" data-id="${w.id}">${icon('flag')} Reportar</button>`}`, esc(w.title));
};
A.hide=el=>{ if(!requireAuth('ocultar publicaciones')) return; const arr=S.hidden[S.session]=S.hidden[S.session]||[]; if(!arr.includes(el.dataset.id)) arr.push(el.dataset.id); save(); closeOverlay(); refresh(); toast('Publicación ocultada'); };
A.editWork=el=>{ closeOverlay(); go('create',{editId:el.dataset.id}); };
A.deleteWork=el=>{ const id=el.dataset.id; showDialog({title:'¿Eliminar obra?',text:'Esta acción no se puede deshacer. Se eliminarán también sus comentarios.',ok:'Eliminar',danger:true,onOk:()=>{ S.works=S.works.filter(w=>w.id!==id); save(); while(stack.length>1 && current().params && current().params.id===id) stack.pop(); render(); toast('Obra eliminada'); }}); };
A.overlayBg=()=>closeOverlay();
A.closeOverlay=()=>closeOverlay();
A.dialogOk=()=>{ const f=dialogOk; dialogOk=null; closeOverlay(); if(f) f(); };

/* ---------- reportes ---------- */
let reportCtx=null;
A.report=el=>{
  if(!requireAuth('reportar contenido')) return;
  reportCtx={kind:el.dataset.kind,id:el.dataset.id,parent:el.dataset.parent||null,reason:REPORT_REASONS[0]};
  showSheet(`<p class="small muted" style="padding:0 18px 8px">Tu reporte es anónimo. El equipo de moderación lo revisará (revisión humana + análisis automático).</p>${REPORT_REASONS.map((r,i)=>`<button class="radio-row ${i===0?'on':''}" data-a="reportReason" data-v="${esc(r)}"><i></i>${esc(r)}</button>`).join('')}<div style="padding:12px 18px 4px"><textarea class="textarea" id="reportNote" placeholder="Detalles adicionales (opcional)" style="min-height:70px"></textarea><button class="btn btn-red btn-block" style="margin-top:12px" data-a="reportSend">${icon('flag')} Enviar reporte</button></div>`,'Reportar contenido');
};
A.reportReason=el=>{ $$('.radio-row').forEach(r=>r.classList.toggle('on',r===el)); reportCtx.reason=el.dataset.v; };
A.reportSend=()=>{
  const note=($('#reportNote')||{}).value||'';
  S.reports.unshift({rid:newId('r'),...reportCtx,note,by:S.session,t:Date.now(),status:'pendiente'});
  if(reportCtx.kind==='work'){ const arr=S.hidden[S.session]=S.hidden[S.session]||[]; if(!arr.includes(reportCtx.id)) arr.push(reportCtx.id); }
  save(); closeOverlay(); refresh();
  showDialog({title:'Gracias por reportar 🛡️',text:'Ocultamos este contenido para ti. Te avisaremos cuando moderación revise el caso.',ok:'Listo',cancel:''});
  later(6000,()=>{ notify(S.session,{type:'mod',text:'<b>Moderación</b> recibió tu reporte y lo está revisando.',link:{s:'reports',mode:'mine'}}); });
};

/* ======================= DETALLE DE OBRA ======================= */
SCREENS.work={ render(p){
  const w=work(p.id); if(!w) return topbar({title:'No encontrado'})+emptyHTML('🔍','Esta obra ya no existe','Puede que su autor la haya eliminado.');
  const a=user(w.author); const mine=w.author===S.session; const readable=['novela','relato','manga','comic'].includes(w.type);
  const hist=S.session&&S.history[S.session]?S.history[S.session][w.id]:null; const readSet=hist?(hist.read||[]):[];
  if(isHiddenForMe(w)) return topbar({title:FORMATS[w.type].label})+emptyHTML('🙈',w.removed?'Contenido retirado':'Ocultaste esta obra',w.removed?'Moderación retiró este contenido por incumplir las normas.':'La reportaste u ocultaste.',w.removed?'':`<button class="btn btn-ghost" data-a="unhide" data-id="${w.id}">Mostrar de todas formas</button>`);
  const actions=`<button class="icon-btn" data-a="share" data-id="${w.id}">${icon('share')}</button><button class="icon-btn" data-a="postMenu" data-id="${w.id}">${icon('more')}</button>`;
  let hero='';
  if(w.type==='foro'){
    hero=`<div class="pad"><div class="row" style="margin-bottom:10px">${avatarHTML(a)}<div class="grow" data-a="user" data-u="${a.username}"><b>${nameHTML(a.username)}</b><div class="tiny muted">en c/${esc(w.community)} · ${timeAgo(w.created)}</div></div>${followBtn(a.username)}</div>
      ${w.pinned?'<span class="tag">📌 Fijado</span> ':''}${fmtTag('foro')}<div class="h2" style="margin:10px 0 8px">${esc(w.title)}</div><p style="font-size:16px;white-space:pre-wrap;line-height:1.5">${esc(w.synopsis)}</p>
      <div class="row" style="margin-top:14px">${voteHTML(w)}<button class="pa ${isSaved(w.id)?'on':''}" data-a="save" data-id="${w.id}">${icon('bookmark',isSaved(w.id)?'fill="currentColor"':'')} Guardar</button><span class="spacer"></span><span class="tiny muted">${fmtNum(w.views)} vistas</span></div></div>`;
  }else if(w.type==='ilustracion'){
    hero=`<button class="post-wide" style="padding:0;width:100%" data-a="viewArt" data-id="${w.id}"><div class="art" style="border-radius:0;aspect-ratio:4/3">${artHTML(w)}</div></button>
      <div class="pad">${fmtTag('ilustracion')} ${w.mature?'<span class="tag red">+18</span>':''}<div class="h2" style="margin:8px 0 10px">${esc(w.title)}</div>
      <div class="row" style="margin-bottom:12px">${avatarHTML(a,'av-sm')}<div class="grow" data-a="user" data-u="${a.username}"><b>${nameHTML(a.username)}</b><div class="tiny muted">${esc(a.role)} · ${timeAgo(w.created)}</div></div>${followBtn(a.username)}</div>
      <div class="row">${voteHTML(w)}<button class="pa ${isSaved(w.id)?'on':''}" data-a="save" data-id="${w.id}">${icon('bookmark',isSaved(w.id)?'fill="currentColor"':'')} Guardar</button><span class="spacer"></span><span class="tiny muted">${fmtNum(w.views)} vistas</span></div>
      <div class="section-label"><span>Descripción</span></div><p style="white-space:pre-wrap">${esc(w.synopsis)}</p>
      <div class="chips wrap" style="margin-top:10px">${(w.genres||[]).map(g=>`<span class="tag gray">${esc(g)}</span>`).join('')}</div></div>`;
  }else{
    hero=`<div class="work-hero"><div class="bgblur">${coverHTML(w)}</div><div class="cover">${coverHTML(w)}</div><div class="grow" style="padding-top:4px">${fmtTag(w.type)} ${w.mature?'<span class="tag red">+18</span>':''}<div class="h2" style="margin:8px 0">${esc(w.title)}</div>
      <button class="row" style="gap:8px" data-a="user" data-u="${a.username}">${avatarHTML(a,'av-xs')}<b class="small">${nameHTML(a.username)}</b></button>
      <div class="chips wrap" style="margin-top:10px;gap:5px">${(w.genres||[]).map(g=>`<span class="tag gray">${esc(g)}</span>`).join('')}</div>
      <div class="tiny faint" style="margin-top:8px">${icon('shield','width="12" height="12" style="display:inline;vertical-align:-2px"')} ${esc(w.license)}</div></div></div>
      <div class="pad" style="padding-top:4px">
      <div class="stats"><div class="stat"><b>${fmtNum(score(w))}</b><span>Votos</span></div><div class="stat"><b>${fmtNum(w.views)}</b><span>Lecturas</span></div><div class="stat"><b>${(w.chapters||[]).length}</b><span>Capítulos</span></div><div class="stat"><b>${commentCount(w)}</b><span>Coment.</span></div></div>
      <div class="row" style="margin-top:12px">${voteHTML(w)}<button class="pa ${isSaved(w.id)?'on':''}" data-a="save" data-id="${w.id}">${icon('bookmark',isSaved(w.id)?'fill="currentColor"':'')} ${isSaved(w.id)?'Guardado':'Guardar'}</button><span class="spacer"></span>${followBtn(a.username)}</div>
      <div class="section-label"><span>Sinopsis</span></div><p style="white-space:pre-wrap;line-height:1.5">${esc(w.synopsis)}</p>
      <div class="section-label"><span>Capítulos</span>${mine?`<button data-a="editWork" data-id="${w.id}">+ Añadir</button>`:''}</div>
      <div class="list">${(w.chapters||[]).map((c,i)=>`<button class="chapter ${readSet.includes(i)?'read':''}" data-a="read" data-id="${w.id}" data-ch="${i}"><span class="n">${readSet.includes(i)?icon('check','width="16" height="16"'):i+1}</span><span class="grow"><b class="ellipsis" style="display:block">${esc(c.title||'Capítulo '+(i+1))}</b><span class="tiny muted">${c.pages?c.pages.length+' páginas':Math.max(1,Math.round(wordCount(c.text)/200))+' min de lectura'}</span></span>${icon('chevR','class="chev" width="20" height="20" style="color:var(--faint)"')}</button>`).join('')||'<div class="pad small muted">Aún no hay capítulos.</div>'}</div></div>`;
  }
  const creditsHTML=`<div class="pad" style="padding-top:0"><div class="section-label"><span>Créditos</span></div><div class="list" style="padding:4px 14px">${[{user:w.author,role:w.type==='ilustracion'?'Autor/a':'Autor/a principal'},...(w.credits||[])].map(c=>`<button class="credit" style="width:100%;text-align:left" data-a="user" data-u="${c.user}">${avatarHTML(c.user,'av-sm')}<span class="grow"><b>${nameHTML(c.user)}</b><span class="tiny muted" style="display:block">@${esc(c.user)}</span></span><span class="tag">${esc(c.role)}</span></button>`).join('')}</div></div>`;
  return `${topbar({title:FORMATS[w.type].emoji+' '+FORMATS[w.type].label,actions})}
  <div class="scroll" style="padding-bottom:20px">${hero}${w.type!=='foro'?creditsHTML:''}
  <div class="pad" id="comments" style="padding-top:0">${commentsHTML(w)}</div></div>
  ${readable?`<div class="sticky-cta"><button class="btn btn-primary grow" data-a="read" data-id="${w.id}" data-ch="${hist?hist.ch:0}">${icon('book')} ${hist?`Continuar · Cap. ${hist.ch+1}`:'Empezar a leer'}</button><button class="btn btn-ghost" data-a="focusComment" aria-label="Comentar">${icon('comment')}</button></div>`:''}
  ${composerHTML(w,!readable)}`;
}, after(p){ if(p.focus==='comments'){ const c=$('#comments'); if(c) c.scrollIntoView(); p.focus=''; } } };
function followBtn(u){ if(u===S.session) return ''; const f=isFollowing(u); return `<button class="btn btn-sm ${f?'btn-ghost':'btn-outline'}" data-a="follow" data-u="${u}">${f?'Siguiendo':'+ Seguir'}</button>`; }
function commentsHTML(w){
  const list=[...(w.comments||[])].sort(UI.commentSort==='top'?(a,b)=>(b.likes||[]).length-(a.likes||[]).length:(a,b)=>b.time-a.time);
  return `<div class="section-label"><span>Comentarios (${commentCount(w)})</span><div class="row" style="gap:4px"><button class="${UI.commentSort==='top'?'':'faint'}" data-a="cSort" data-v="top">Top</button>·<button class="${UI.commentSort==='new'?'':'faint'}" data-a="cSort" data-v="new">Recientes</button></div></div>
  ${list.length?list.map(c=>commentHTML(w,c)).join(''):`<div class="empty" style="padding:20px"><div class="e" style="font-size:36px">💬</div><div class="small">Sé el primero en dejar feedback.</div></div>`}`;
}
function commentHTML(w,c,parent){
  const liked=S.session&&(c.likes||[]).includes(S.session);
  const hidden=S.session && S.reports.some(r=>r.kind==='comment'&&r.id===c.id&&r.by===S.session);
  if(hidden) return `<div class="comment"><span class="small faint">${icon('eyeOff','width="14" height="14" style="display:inline;vertical-align:-2px"')} Comentario reportado y oculto.</span></div>`;
  if(c.removed) return `<div class="comment"><span class="small faint">Comentario retirado por moderación.</span></div>`;
  return `<div class="comment">${avatarHTML(c.user,'av-sm')}<div class="body"><div class="meta"><b data-a="user" data-u="${c.user}">${nameHTML(c.user)}</b>${c.user===w.author?'<span class="tag" style="padding:0 5px;font-size:10px">Autor</span> ':''}· ${timeAgo(c.time)}</div><p>${esc(c.text)}</p>
  <div class="acts"><button class="${liked?'on':''}" data-a="likeComment" data-w="${w.id}" data-c="${c.id}" data-p="${parent||''}">${icon('heart',liked?'fill="currentColor"':'')} ${(c.likes||[]).length||''}</button>${parent?'':`<button data-a="replyComment" data-c="${c.id}" data-u="${c.user}">${icon('comment')} Responder</button>`}<button data-a="commentMenu" data-w="${w.id}" data-c="${c.id}" data-p="${parent||''}">${icon('more')}</button></div>
  ${(c.replies||[]).length?`<div class="replies">${c.replies.map(r=>commentHTML(w,r,c.id)).join('')}</div>`:''}</div></div>`;
}
function composerHTML(w,visible){
  return `<div id="composerWrap" style="${visible?'':'display:none'}">${UI.replyTo?`<div class="reply-to">${icon('comment','width="14" height="14"')} Respondiendo a <b>@${esc(UI.replyTo.u)}</b><span class="spacer"></span><button data-a="cancelReply">${icon('x','width="16" height="16"')}</button></div>`:''}<form class="composer" data-f="comment" data-id="${w.id}"><textarea name="text" rows="1" placeholder="${S.session?'Escribe un comentario constructivo…':'Inicia sesión para comentar'}" maxlength="1000"></textarea><button class="send-btn" aria-label="Enviar">${icon('send')}</button></form></div>`;
}
A.cSort=el=>{ UI.commentSort=el.dataset.v; const w=work(current().params.id); $('#comments').innerHTML=commentsHTML(w); };
A.focusComment=()=>{ if(!requireAuth('comentar')) return; const cw=$('#composerWrap'); cw.style.display=''; $('.sticky-cta').style.display='none'; const t=$('textarea',cw); t.focus(); };
A.replyComment=el=>{ if(!requireAuth('responder')) return; UI.replyTo={c:el.dataset.c,u:el.dataset.u}; const w=work(current().params.id); const cw=$('#composerWrap'); cw.outerHTML=composerHTML(w,true); const st=$('.sticky-cta'); if(st) st.style.display='none'; $('#composerWrap textarea').focus(); };
A.cancelReply=()=>{ UI.replyTo=null; const w=work(current().params.id); $('#composerWrap').outerHTML=composerHTML(w,true); };
function findComment(w,cid,pid){ if(pid){ const p=w.comments.find(c=>c.id===pid); return p&&(p.replies||[]).find(r=>r.id===cid); } return w.comments.find(c=>c.id===cid); }
A.likeComment=el=>{ if(!requireAuth('dar me gusta')) return; const w=work(el.dataset.w); const c=findComment(w,el.dataset.c,el.dataset.p); c.likes=c.likes||[]; const i=c.likes.indexOf(S.session); if(i>=0) c.likes.splice(i,1); else { c.likes.push(S.session); if(c.user!==S.session) notify(c.user,{type:'vote',text:`A <b>${esc(me().name)}</b> le gustó tu comentario en “${esc(w.title)}”`,link:{s:'work',id:w.id}}); } save(); $('#comments').innerHTML=commentsHTML(w); };
A.commentMenu=el=>{ const w=work(el.dataset.w); const c=findComment(w,el.dataset.c,el.dataset.p); const mine=c.user===S.session;
  showSheet(`${mine||w.author===S.session?`<button class="opt danger" data-a="delComment" data-w="${w.id}" data-c="${c.id}" data-p="${el.dataset.p}">${icon('trash')} Eliminar comentario</button>`:''}${mine?'':`<button class="opt danger" data-a="report" data-kind="comment" data-id="${c.id}" data-parent="${w.id}">${icon('flag')} Reportar comentario</button>`}<button class="opt" data-a="user" data-u="${c.user}">${icon('user')} Ver perfil</button>`); };
A.delComment=el=>{ const w=work(el.dataset.w); if(el.dataset.p){ const p=w.comments.find(c=>c.id===el.dataset.p); p.replies=p.replies.filter(r=>r.id!==el.dataset.c); } else w.comments=w.comments.filter(c=>c.id!==el.dataset.c); save(); closeOverlay(); $('#comments').innerHTML=commentsHTML(w); toast('Comentario eliminado'); };
F.comment=form=>{
  if(!requireAuth('comentar')) return; const ta=$('textarea',form); const text=ta.value.trim(); if(!text) return;
  const w=work(form.dataset.id);
  const post=(flagged)=>{
    const c={id:newId('c'),user:S.session,text,time:Date.now(),likes:[],flagged:!!flagged};
    if(UI.replyTo){ const p=w.comments.find(x=>x.id===UI.replyTo.c); (p.replies=p.replies||[]).push(c); if(p.user!==S.session) notify(p.user,{type:'comment',text:`<b>${esc(me().name)}</b> respondió tu comentario: “${esc(text.slice(0,60))}”`,link:{s:'work',id:w.id,focus:'comments'}}); }
    else { w.comments.push(c); if(w.author!==S.session) notify(w.author,{type:'comment',text:`<b>${esc(me().name)}</b> comentó “${esc(w.title)}”: “${esc(text.slice(0,60))}”`,link:{s:'work',id:w.id,focus:'comments'}}); }
    if(flagged) S.reports.unshift({rid:newId('r'),kind:'comment',id:c.id,parent:w.id,reason:'Posible lenguaje ofensivo (detección automática)',note:text,by:'sistema',t:Date.now(),status:'pendiente'});
    UI.replyTo=null; S.users[S.session].karma=(S.users[S.session].karma||0)+2; save();
    ta.value=''; $('#comments').innerHTML=commentsHTML(w); $('#composerWrap').outerHTML=composerHTML(w,true); toast('💬 Comentario publicado');
    if(!flagged && w.author!==S.session && Math.random()<.7 && !user(w.author).passHash) later(3500,()=>{ const r={id:newId('c'),user:w.author,text:['¡Gracias por leer y comentar! 🙌','Me alegra mucho que te guste 💛','¡Tomo nota del feedback!','Gracias, el próximo capítulo viene con sorpresas 👀'][Math.floor(Math.random()*4)],time:Date.now(),likes:[S.session]}; (c.replies=c.replies||[]).push(r); notify(S.session,{type:'comment',text:`<b>${esc(user(w.author).name)}</b> respondió tu comentario en “${esc(w.title)}”`,link:{s:'work',id:w.id,focus:'comments'}}); save(); if(current().name==='work'&&current().params.id===w.id) $('#comments').innerHTML=commentsHTML(w); });
  };
  if(isToxic(text)) showDialog({title:'⚠️ Revisión automática',html:`<div class="mod-flag" style="margin-top:8px">${icon('shield')}<span>Nuestro sistema detectó lenguaje que podría ser ofensivo. CHOGGUN es un espacio de feedback respetuoso.</span></div><p style="margin-top:10px">Si lo publicas, será enviado a revisión humana.</p>`,ok:'Publicar igual',cancel:'Editar',onOk:()=>post(true)});
  else post(false);
};
A.follow=el=>{
  if(!requireAuth('seguir creadores')) return; const u=el.dataset.u; const m=me(); m.following=m.following||[]; const t=S.users[u]; t.followers=t.followers||[];
  if(m.following.includes(u)){ m.following=m.following.filter(x=>x!==u); t.followers=t.followers.filter(x=>x!==m.username); toast(`Dejaste de seguir a ${t.name}`); }
  else { m.following.push(u); t.followers.push(m.username); toast(`Ahora sigues a ${t.name}`); notify(u,{type:'follow',text:`<b>${esc(m.name)}</b> empezó a seguirte`,link:{s:'user',u:m.username}}); }
  save(); refresh();
};
A.viewArt=el=>{ const w=work(el.dataset.id); $('#overlay').innerHTML=`<div class="overlay center" data-a="overlayBg" style="background:rgba(0,0,0,.94);padding:0"><button class="icon-btn" data-a="closeOverlay" style="position:absolute;top:calc(10px + var(--safe-top));right:10px;color:#fff;z-index:2">${icon('x')}</button><div style="width:100%" data-a="overlayBg">${artHTML(w).replace('<svg','<svg style="width:100%;height:auto"')}</div></div>`; };

/* ======================= LECTOR ======================= */
SCREENS.read={ noNav:true, cls:'reader', render(p){
  const w=work(p.id); const ch=Math.min(+p.ch||0,(w.chapters||[]).length-1); const c=w.chapters[ch]; const t=S.settings.readerTheme;
  const actions=`<button class="icon-btn" data-a="readerList" aria-label="Capítulos">${icon('list')}</button>${c.pages?'':`<button class="icon-btn" data-a="readerSettings" aria-label="Ajustes de lectura">${icon('type')}</button>`}`;
  const content=c.pages?`<div class="reader-pages">${c.pages.map((pg,i)=>`<div class="page">${typeof pg==='string'?`<img src="${pg}" alt="Página ${i+1}" loading="lazy">`:pageSVG(pg,w.id+'-'+ch+'-'+i,!!w.color)}</div>`).join('')}</div>`
    :`<article class="reader-text" style="--rsize:${S.settings.readerSize}px"><h2>${esc(c.title||'Capítulo '+(ch+1))}</h2><div class="by">${esc(w.title)} · ${esc(user(w.author).name)}</div>${String(c.text||'').split(/\n\s*\n/).map(par=>`<p>${esc(par.trim()).replace(/\n/g,'<br>')}</p>`).join('')}</article>`;
  const next=ch<w.chapters.length-1, prev=ch>0, v=myVote(w);
  return `${topbar({title:`<span class="small" style="font-family:var(--font-body);text-transform:none;letter-spacing:0;font-weight:700">${esc(c.title||'Capítulo '+(ch+1))}</span>`,actions})}<div class="reader-progress"><i id="rprog"></i></div>
  <div class="scroll" id="rscroll">${content}
   <div class="reader-end" style="${c.pages?'background:#111;color:#ddd':''}"><div class="h3" style="margin-bottom:6px">Fin del capítulo ${ch+1}</div><p class="small" style="opacity:.7;margin-bottom:16px">¿Te gustó? Tu voto ayuda a que más lectores descubran esta obra.</p>
   <div class="row" style="justify-content:center;gap:10px;margin-bottom:16px"><button class="btn btn-sm ${v>0?'btn-primary':'btn-ghost'}" data-a="readerVote" data-id="${w.id}">${icon('up')} ${v>0?'¡Votado!':'Votar'}</button><button class="btn btn-sm btn-ghost" data-a="readerComment" data-id="${w.id}">${icon('comment')} Comentar</button><button class="btn btn-sm btn-ghost" data-a="share" data-id="${w.id}">${icon('share')}</button></div>
   <div class="row" style="justify-content:center;gap:10px">${prev?`<button class="btn btn-ghost" data-a="read" data-id="${w.id}" data-ch="${ch-1}" data-replace="1">${icon('back')} Anterior</button>`:''}${next?`<button class="btn btn-primary" data-a="read" data-id="${w.id}" data-ch="${ch+1}" data-replace="1">Siguiente ${icon('chevR')}</button>`:`<div class="small" style="opacity:.7">Estás al día ✨ Sigue al autor para enterarte del próximo capítulo.</div>`}</div></div></div>`;
}, after(p){
  const scr=$('#view .screen'); scr.classList.add('r-'+S.settings.readerTheme);
  const w=work(p.id); const ch=Math.min(+p.ch||0,w.chapters.length-1); const sc=$('#rscroll'); const bar=$('#rprog');
  const hist=S.session?(S.history[S.session]=S.history[S.session]||{}):null;
  if(hist){ const h=hist[w.id]=hist[w.id]||{ch:0,pct:0,read:[]}; h.ch=ch; h.t=Date.now(); if(h.pctCh!==ch) h.pct=0; h.pctCh=ch; save(); }
  let ticking=false;
  sc.addEventListener('scroll',()=>{ if(ticking) return; ticking=true; requestAnimationFrame(()=>{ ticking=false; const max=sc.scrollHeight-sc.clientHeight; const pct=max>0?sc.scrollTop/max:1; bar.style.width=(pct*100)+'%';
    if(hist){ const h=hist[w.id]; h.pct=pct; if(pct>.9 && !h.read.includes(ch)){ h.read.push(ch); } save(); } }); },{passive:true});
} };
A.read=el=>{ const w=work(el.dataset.id); if(!w||!(w.chapters||[]).length) return toast('Esta obra aún no tiene capítulos'); closeOverlay(); const p={id:w.id,ch:+el.dataset.ch||0}; if(el.dataset.replace||current().name==='read') replace('read',p); else { w.views=(w.views||0)+1; save(); go('read',p); } };
A.readerVote=el=>{ if(!requireAuth('votar')) return; const w=work(el.dataset.id); if(myVote(w)===1) return; w.votes[S.session]=1; if(w.author!==S.session) notify(w.author,{type:'vote',text:`<b>${esc(me().name)}</b> votó tu obra “${esc(w.title)}”`,link:{s:'work',id:w.id}}); save(); el.className='btn btn-sm btn-primary'; el.innerHTML=icon('up')+' ¡Votado!'; toast('▲ ¡Gracias por tu voto!'); };
A.readerComment=el=>{ stack.pop(); if(current().name==='work'){ current().params.focus='comments'; navAnim=false; render(); } else go('work',{id:el.dataset.id,focus:'comments'}); };
A.readerList=()=>{ const p=current().params; const w=work(p.id); showSheet(`<div class="list" style="margin:0 14px">${w.chapters.map((c,i)=>`<button class="chapter" data-a="read" data-id="${w.id}" data-ch="${i}" data-replace="1"><span class="n" style="${i===+p.ch?'background:var(--gold);color:#1d1405':''}">${i+1}</span><span class="grow ellipsis"><b>${esc(c.title||'Capítulo '+(i+1))}</b></span></button>`).join('')}</div>`,'Capítulos'); };
A.readerSettings=()=>{ const s=S.settings; showSheet(`<div style="padding:0 18px 8px"><div class="field"><span>Tamaño del texto · <b id="rsv">${s.readerSize}px</b></span><div class="row"><span class="small">A</span><input type="range" min="14" max="26" value="${s.readerSize}" data-i="readerSize"><span style="font-size:22px">A</span></div></div>
  <div class="field"><span>Fondo</span><div class="seg">${[['sepia','Sepia'],['light','Claro'],['dark','Oscuro']].map(([k,l])=>`<button class="${s.readerTheme===k?'on':''}" data-a="readerTheme" data-v="${k}">${l}</button>`).join('')}</div></div></div>`,'Ajustes de lectura'); };
I.readerSize=el=>{ S.settings.readerSize=+el.value; $('#rsv').textContent=el.value+'px'; const a=$('.reader-text'); if(a) a.style.setProperty('--rsize',el.value+'px'); save(); };
A.readerTheme=el=>{ S.settings.readerTheme=el.dataset.v; save(); const scr=$('#view .screen'); scr.classList.remove('r-sepia','r-light','r-dark'); scr.classList.add('r-'+el.dataset.v); $$('.seg button',$('#overlay')).forEach(b=>b.classList.toggle('on',b===el)); };

/* ======================= EXPLORAR ======================= */
SCREENS.explore={ render(){
  return `${topbar({back:false,title:'Explorar',actions:`<button class="icon-btn" data-a="go" data-s="createCommunity" aria-label="Crear comunidad">${icon('plus')}</button>`})}
  <div class="pad" style="padding-bottom:6px"><div class="searchbar">${icon('search')}<input id="exploreQ" placeholder="Buscar obras, comunidades, personas…" value="${esc(UI.exploreQ)}" data-i="exploreQ" autocomplete="off" enterkeyhint="search">${UI.exploreQ?`<button data-a="clearSearch">${icon('x')}</button>`:''}</div></div>
  <div class="scroll pb-nav"><div class="pad" id="exploreBody" style="padding-top:8px">${exploreBody()}</div></div>`; } };
function exploreBody(){
  const q=normalize(UI.exploreQ.trim());
  if(q){
    const f=UI.exploreFilter;
    const works=visibleWorks().filter(w=>normalize(w.title+' '+w.synopsis+' '+(w.genres||[]).join(' ')+' '+user(w.author).name+' '+FORMATS[w.type].label).includes(q)).sort((a,b)=>score(b)-score(a));
    const comms=S.communities.filter(c=>normalize(c.name+' '+c.id+' '+c.desc+' '+c.cat).includes(q));
    const users=Object.values(S.users).filter(u=>normalize(u.name+' '+u.username+' '+u.role+' '+(u.genres||[]).join(' ')).includes(q));
    const chips=`<div class="chips" style="margin-bottom:12px">${[['all','Todo'],['works',`Obras (${works.length})`],['comms',`Comunidades (${comms.length})`],['users',`Personas (${users.length})`]].map(([k,l])=>`<button class="chip ${f===k?'on':''}" data-a="exploreFilter" data-k="${k}">${l}</button>`).join('')}</div>`;
    let out='';
    if((f==='all'||f==='users')&&users.length) out+=`<div class="section-label"><span>Personas</span></div><div class="list" style="margin-bottom:6px">${users.slice(0,f==='all'?4:50).map(u=>`<button class="li" data-a="user" data-u="${u.username}">${avatarHTML(u)}<span class="txt"><b>${nameHTML(u.username)}</b><span>@${esc(u.username)} · ${esc(u.role)}</span></span>${icon('chevR','class="chev"')}</button>`).join('')}</div>`;
    if((f==='all'||f==='comms')&&comms.length) out+=`<div class="section-label"><span>Comunidades</span></div><div class="list" style="margin-bottom:6px">${comms.slice(0,f==='all'?4:50).map(commRow).join('')}</div>`;
    if((f==='all'||f==='works')&&works.length) out+=`<div class="section-label"><span>Obras y publicaciones</span></div>${works.slice(0,f==='all'?6:60).map(postCard).join('')}`;
    return chips+(out||emptyHTML('😕','Sin resultados',`No encontramos nada para “${esc(UI.exploreQ)}”. Prueba con otra palabra.`));
  }
  const trend=visibleWorks().sort((a,b)=>hot(b)-hot(a)).slice(0,5);
  const cats=[...new Set(S.communities.map(c=>c.cat))];
  return `<div class="section-label"><span>🔥 Tendencias</span></div><div class="list">${trend.map((w,i)=>`<button class="li" data-a="open" data-id="${w.id}"><span class="rank ${i===0?'r1':''}">#${i+1}</span><span class="txt"><b class="ellipsis">${esc(w.title)}</b><span>${FORMATS[w.type].emoji} ${FORMATS[w.type].label} · ${esc(user(w.author).name)}</span></span><span class="tag">▲ ${fmtNum(score(w))}</span></button>`).join('')}</div>
  <div class="section-label"><span>Géneros</span></div><div class="chips wrap">${GENRES.map(g=>`<button class="chip" data-a="searchFor" data-q="${esc(g)}">${esc(g)}</button>`).join('')}</div>
  ${cats.map(cat=>`<div class="section-label"><span>${esc(cat)}</span></div><div class="comm-grid">${S.communities.filter(c=>c.cat===cat).map(commTile).join('')}</div>`).join('')}
  <div class="banner-tip" style="margin-top:20px"><div class="comm-icon" style="background:rgba(245,185,66,.18)">➕</div><div class="grow"><b class="h3">Crea tu comunidad</b><div class="small muted">Comparte tus intereses y conecta con otros creadores.</div></div><button class="btn btn-primary btn-sm" data-a="go" data-s="createCommunity">Crear</button></div>`;
}
function commRow(c){ return `<button class="li" data-a="comm" data-id="${c.id}"><span class="comm-icon" style="background:${c.color}22;width:40px;height:40px;font-size:20px">${c.icon}</span><span class="txt"><b>c/${esc(c.id)}</b><span>${fmtNum(c.members+(isJoined(c.id)?1:0))} miembros · ${esc(c.cat)}</span></span>${isJoined(c.id)?'<span class="tag green">Unido</span>':icon('chevR','class="chev"')}</button>`; }
function commTile(c){ const j=isJoined(c.id); return `<div class="comm-tile" data-a="comm" data-id="${c.id}"><div class="row between"><span class="comm-icon" style="background:${c.color}22">${c.icon}</span><button class="btn btn-sm ${j?'btn-ghost':'btn-primary'}" style="height:30px;padding:0 10px;font-size:12px" data-a="join" data-id="${c.id}">${j?'✓ Unido':'Unirse'}</button></div><b>${esc(c.name)}</b><span class="tiny muted clamp2">${esc(c.desc)}</span><span class="tiny faint">${fmtNum(c.members+(j?1:0))} miembros</span></div>`; }
I.exploreQ=el=>{ UI.exploreQ=el.value; $('#exploreBody').innerHTML=exploreBody(); const bar=el.parentElement; const has=bar.querySelector('[data-a=clearSearch]'); if(UI.exploreQ&&!has) bar.insertAdjacentHTML('beforeend',`<button data-a="clearSearch">${icon('x')}</button>`); if(!UI.exploreQ&&has) has.remove(); };
A.clearSearch=()=>{ UI.exploreQ=''; UI.exploreFilter='all'; refresh(); };
A.exploreFilter=el=>{ UI.exploreFilter=el.dataset.k; $('#exploreBody').innerHTML=exploreBody(); };
A.searchFor=el=>{ UI.exploreQ=el.dataset.q; if(current().name!=='explore') setTab('explore'); else refresh(); };
A.join=el=>{
  if(!requireAuth('unirte a comunidades')) return; const id=el.dataset.id; const arr=S.joined[S.session]=S.joined[S.session]||[];
  if(arr.includes(id)){ S.joined[S.session]=arr.filter(x=>x!==id); toast(`Saliste de c/${id}`); } else { arr.push(id); toast(`🎉 Te uniste a c/${id}`); }
  save(); refresh();
};

/* ======================= COMUNIDAD ======================= */
SCREENS.community={ render(p){
  const c=community(p.id); const j=isJoined(c.id);
  let list=visibleWorks().filter(w=>w.community===c.id); list.sort(UI.commTab==='nuevo'?(a,b)=>b.created-a.created:(a,b)=>(b.pinned?1e9:0)+hot(b)-((a.pinned?1e9:0)+hot(a)));
  return `${topbar({title:'c/'+esc(c.id),actions:`<button class="icon-btn" data-a="shareComm" data-id="${c.id}">${icon('share')}</button>`})}
  <div class="scroll" style="padding-bottom:100px"><div class="comm-hero" style="--hero:linear-gradient(135deg,${c.color}55,var(--bg2))"><div class="row" style="gap:14px"><span class="comm-icon" style="width:64px;height:64px;font-size:34px;background:${c.color}33;border:2px solid ${c.color}">${c.icon}</span><div class="grow"><div class="h2">${esc(c.name)}</div><div class="small muted">c/${esc(c.id)} · ${fmtNum(c.members+(j?1:0))} miembros ${c.private?'· 🔒 Privada':''}</div></div></div>
  <p style="margin:12px 0">${esc(c.desc)}</p><div class="row"><button class="btn ${j?'btn-ghost':'btn-primary'} btn-sm" data-a="join" data-id="${c.id}">${j?'✓ Unido':'Unirse'}</button><button class="btn btn-sm btn-ghost" data-a="rules">${icon('shield')} Normas</button></div></div>
  <div class="tabs">${[['popular','Popular'],['nuevo','Nuevo']].map(([k,l])=>`<button class="tab ${UI.commTab===k?'on':''}" data-a="commTab" data-k="${k}">${l}</button>`).join('')}</div>
  <div class="pad">${list.length?list.map(postCard).join(''):emptyHTML(c.icon,'Comunidad nueva','Todavía no hay publicaciones. ¡Sé el primero en publicar aquí!')}</div></div>
  <button class="fab" style="bottom:calc(20px + var(--safe-bottom))" data-a="create" data-comm="${c.id}" aria-label="Publicar en esta comunidad">${icon('plus')}</button>`; } };
A.commTab=el=>{ UI.commTab=el.dataset.k; refresh(); };
A.shareComm=el=>{ const c=community(el.dataset.id); shareText(`c/${c.id} en CHOGGUN`,c.desc); };

SCREENS.createCommunity={ render(){
  const icons=['📚','✍️','🎌','💥','🎨','🖌️','🍜','🎬','🎮','🎵','⚡','🐉','🌙','👻','🚀','💡','☕','🌿','🗡️','🏰'];
  return `${topbar({title:'Crear comunidad'})}<div class="scroll"><form class="pad" data-f="community" novalidate>
  <div class="field"><span>Icono</span><div class="chips wrap" data-single="icon">${icons.map((e,i)=>`<button type="button" class="chip ${i===0?'on':''}" style="font-size:20px;padding:0 10px" data-a="chipSingle" data-v="${e}">${e}</button>`).join('')}</div><input type="hidden" name="icon" value="${icons[0]}"></div>
  <label class="field"><span>Nombre</span><div class="input-wrap"><span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-weight:800;color:var(--gold)">c/</span><input class="input" name="name" placeholder="mi_comunidad" maxlength="24" autocapitalize="off" style="padding-left:38px"></div><div class="hint">Letras, números o _ (3–24). No se puede cambiar después.</div></label>
  <label class="field"><span>Descripción</span><textarea class="textarea" name="desc" placeholder="¿De qué trata tu comunidad?" maxlength="200"></textarea></label>
  <label class="field"><span>Categoría</span><select class="select" name="cat">${['Historias','Visual','Entretenimiento','Otros'].map(c=>`<option>${c}</option>`).join('')}</select></label>
  <div class="field"><span>Privacidad</span><div class="seg" data-single="priv"><button type="button" class="on" data-a="segSingle" data-v="publica">${icon('globe')} Pública</button><button type="button" data-a="segSingle" data-v="privada">${icon('lock')} Privada</button></div><input type="hidden" name="priv" value="publica"></div>
  <div class="err" data-err style="margin-bottom:10px"></div><button class="btn btn-primary btn-block">Crear comunidad</button></form></div>`; } };
A.segSingle=el=>{ const box=el.closest('[data-single]'); $$('button',box).forEach(b=>b.classList.toggle('on',b===el)); const h=box.parentElement.querySelector(`input[name=${box.dataset.single}]`); if(h) h.value=el.dataset.v; };
F.community=form=>{
  if(!requireAuth('crear comunidades')) return; const d=Object.fromEntries(new FormData(form)); const err=$('[data-err]',form); const id=(d.name||'').trim().toLowerCase();
  if(!/^[a-z0-9_]{3,24}$/.test(id)){ err.textContent='Nombre inválido: 3–24 letras minúsculas, números o _'; return; }
  if(S.communities.some(c=>c.id===id)){ err.textContent='Ya existe una comunidad con ese nombre'; return; }
  if(!d.desc.trim()){ err.textContent='Escribe una descripción'; return; }
  if(isToxic(d.desc+' '+id)){ err.textContent='La descripción contiene lenguaje no permitido'; return; }
  const colors=['#f5b942','#e04848','#5ab8e8','#3fb37f','#9b7cf0','#ff8a5c'];
  S.communities.push({id,name:id.replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase()),icon:d.icon,cat:d.cat,color:colors[Math.floor(Math.random()*colors.length)],members:0,desc:d.desc.trim(),private:d.priv==='privada',owner:S.session,custom:true});
  (S.joined[S.session]=S.joined[S.session]||[]).push(id); save(); replace('community',{id}); toast(`🎉 Comunidad c/${id} creada`);
};

/* ======================= CREAR / EDITAR ======================= */
let draft=null;
function newDraft(p){
  if(p.editId){ const w=work(p.editId); return JSON.parse(JSON.stringify({...w,editId:w.id,chapters:(w.chapters||[]).length?w.chapters:[{title:'Capítulo 1',text:''}]})); }
  const type=p.type||'novela';
  return {type,title:'',synopsis:'',community:p.comm||defaultComm(type),genres:[],cover:null,image:null,chapters:[{title:'Capítulo 1',text:'',pages:[]}],credits:[],license:LICENSES[0],mature:false};
}
function defaultComm(type){ return {novela:'novelas',relato:'relatos',manga:'manga',comic:'comic',ilustracion:'ilustracion',foro:'creacion'}[type]||'novelas'; }
A.create=el=>{ if(!requireAuth('publicar contenido')) return; draft=null; go('create',{comm:el.dataset.comm||''}); };
SCREENS.create={ noNav:true, render(p){
  if(!draft || (p.editId && draft.editId!==p.editId)) draft=newDraft(p);
  const d=draft; const editing=!!d.editId; const t=d.type;
  const visual=t==='manga'||t==='comic'; const text=t==='novela'||t==='relato';
  const fmtGrid=editing?'':`<div class="field"><span>Formato</span><div class="fmt-grid">${Object.entries(FORMATS).map(([k,f])=>`<button type="button" class="fmt-btn ${t===k?'on':''}" data-a="draftType" data-v="${k}"><span class="e">${f.emoji}</span>${f.label}</button>`).join('')}</div></div>`;
  const coverField=t==='foro'||t==='ilustracion'?'':`<div class="field"><span>Portada</span><div class="row" style="align-items:flex-start;gap:14px"><div class="cover" style="width:100px" id="coverPrev">${d.cover?`<img src="${d.cover}" alt="">`:coverSVG({...d,id:'draft',coverSeed:d.coverSeed||'draft'+(d.title||''),authorName:me().name})}</div><div class="grow stack"><button type="button" class="btn btn-ghost btn-sm btn-block" data-a="pickCover">${icon('image')} Subir imagen</button><button type="button" class="btn btn-ghost btn-sm btn-block" data-a="genCover">${icon('sparkles')} Generar otra</button>${d.cover?`<button type="button" class="btn btn-sm btn-block" style="color:var(--red)" data-a="rmCover">${icon('trash')} Quitar imagen</button>`:''}<div class="hint">Formato vertical 2:3 recomendado.</div></div></div></div>`;
  let content='';
  if(text){
    content=`<div class="section-label"><span>${t==='relato'?'Texto':'Capítulos'}</span>${t==='novela'?`<button type="button" data-a="addChapter">+ Capítulo</button>`:''}</div>${d.chapters.map((c,i)=>`<div class="card" style="padding:12px;margin-bottom:10px"><div class="row" style="margin-bottom:8px"><input class="input" style="padding:9px 12px" data-d="ch.${i}.title" value="${esc(c.title)}" placeholder="Título del capítulo">${d.chapters.length>1?`<button type="button" class="icon-btn" data-a="rmChapter" data-i="${i}">${icon('trash')}</button>`:''}</div><textarea class="textarea" style="min-height:${t==='relato'?260:180}px;font-family:Georgia,serif;font-weight:400" data-d="ch.${i}.text" placeholder="Érase una vez…">${esc(c.text)}</textarea><div class="hint" data-wc="${i}">${wordCount(c.text)} palabras</div></div>`).join('')}`;
  }else if(visual){
    content=`<div class="section-label"><span>Capítulos y páginas</span><button type="button" data-a="addChapter">+ Capítulo</button></div>${d.chapters.map((c,i)=>`<div class="card" style="padding:12px;margin-bottom:10px"><div class="row" style="margin-bottom:8px"><input class="input" style="padding:9px 12px" data-d="ch.${i}.title" value="${esc(c.title)}" placeholder="Título del capítulo">${d.chapters.length>1?`<button type="button" class="icon-btn" data-a="rmChapter" data-i="${i}">${icon('trash')}</button>`:''}</div>
      <button type="button" class="upload" data-a="pickPages" data-i="${i}">${icon('layers')}<b>Subir páginas</b><span class="tiny">Puedes elegir varias imágenes a la vez, en orden de lectura</span></button>
      ${(c.pages||[]).length?`<div class="thumbs">${c.pages.map((pg,k)=>`<div class="thumb">${typeof pg==='string'?`<img src="${pg}" alt="">`:pageSVG(pg,'d'+i+k,t==='comic')}<i>${k+1}</i><button type="button" data-a="rmPage" data-i="${i}" data-k="${k}">${icon('x')}</button></div>`).join('')}</div>`:''}</div>`).join('')}`;
  }else if(t==='ilustracion'){
    content=`<div class="field"><span>Imagen</span>${d.image&&d.image.data?`<div class="post-wide" style="padding:0"><div class="art"><img src="${d.image.data}" alt=""></div></div><button type="button" class="btn btn-ghost btn-sm" style="margin-top:8px" data-a="pickArt">${icon('refresh')} Cambiar imagen</button>`:d.image&&d.image.gen?`<div class="post-wide" style="padding:0"><div class="art">${illustrationSVG(d.image.gen)}</div></div><button type="button" class="btn btn-ghost btn-sm" style="margin-top:8px" data-a="pickArt">${icon('refresh')} Cambiar imagen</button>`:`<button type="button" class="upload" data-a="pickArt">${icon('image')}<b>Subir ilustración</b><span class="tiny">JPG o PNG desde tu galería o cámara</span></button>`}</div>`;
  }
  const comms=S.communities.filter(c=>!c.private||isJoined(c.id));
  const creditUsers=Object.values(S.users).filter(u=>u.username!==S.session && !u.official);
  return `${topbar({title:editing?'Editar obra':'Nueva publicación',actions:`<button class="btn btn-primary btn-sm" style="margin-right:6px" data-a="publish">${editing?'Guardar':'Publicar'}</button>`}).replace('data-a="back"','data-a="createClose"')}
  <div class="scroll"><div class="pad" style="padding-bottom:30px">${fmtGrid}
  <label class="field"><span>${t==='foro'?'Título de la discusión':'Título'}</span><input class="input" data-d="title" value="${esc(d.title)}" maxlength="90" placeholder="${t==='foro'?'¿De qué quieres hablar?':'El título de tu obra'}"></label>
  <label class="field"><span>${t==='foro'?'Contenido':t==='ilustracion'?'Descripción':'Sinopsis'}</span><textarea class="textarea" data-d="synopsis" maxlength="${t==='foro'?4000:600}" placeholder="${t==='foro'?'Escribe tu publicación…':'Cuenta de qué trata en pocas líneas'}">${esc(d.synopsis)}</textarea></label>
  ${coverField}${content}
  <div class="section-label"><span>Detalles</span></div>
  <label class="field"><span>Comunidad</span><select class="select" data-d="community">${comms.map(c=>`<option value="${c.id}" ${d.community===c.id?'selected':''}>${c.icon} c/${esc(c.id)}</option>`).join('')}</select></label>
  <div class="field"><span>Géneros (máx. 4)</span><div class="chips wrap">${GENRES.map(g=>`<button type="button" class="chip ${d.genres.includes(g)?'on':''}" data-a="draftGenre" data-v="${esc(g)}">${esc(g)}</button>`).join('')}</div></div>
  ${t==='foro'?'':`<div class="field"><span>Créditos y colaboradores</span>${d.credits.map((c,i)=>`<div class="row" style="margin-bottom:8px">${avatarHTML(c.user,'av-sm')}<span class="grow"><b class="small">${nameHTML(c.user)}</b></span><span class="tag">${esc(c.role)}</span><button type="button" class="icon-btn" data-a="rmCredit" data-i="${i}">${icon('x')}</button></div>`).join('')}
    <div class="row" style="gap:8px"><select class="select grow" id="crUser" style="padding:10px"><option value="">Elegir persona…</option>${creditUsers.map(u=>`<option value="${u.username}">${esc(u.name)} (@${esc(u.username)})</option>`).join('')}</select><select class="select" id="crRole" style="width:auto;padding:10px">${CREDIT_ROLES.map(r=>`<option>${r}</option>`).join('')}</select></div><button type="button" class="btn btn-ghost btn-sm" style="margin-top:8px" data-a="addCredit">${icon('userPlus')} Añadir crédito</button><div class="hint">Los colaboradores aparecen en la ficha de la obra y reciben una notificación.</div></div>
  <label class="field"><span>Licencia</span><select class="select" data-d="license">${LICENSES.map(l=>`<option ${d.license===l?'selected':''}>${l}</option>`).join('')}</select></label>`}
  <div class="row between card" style="padding:12px 14px;margin-bottom:16px"><div><b>Contenido sensible (+18)</b><div class="tiny muted">Se ocultará a quien no lo active en ajustes</div></div><button type="button" class="toggle ${d.mature?'on':''}" data-a="draftMature"></button></div>
  <div class="err" id="draftErr" style="margin-bottom:10px"></div>
  <div class="row"><button class="btn btn-ghost grow" data-a="saveDraft">${icon('file')} Borrador</button><button class="btn btn-primary grow" data-a="publish">${icon('send')} ${editing?'Guardar':'Publicar'}</button></div>
  <p class="tiny faint center" style="margin-top:12px">Al publicar confirmas que tienes los derechos sobre este contenido. Todo pasa por moderación automática y reportes de la comunidad.</p>
  </div></div>`; } };
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.dataset.i && I[el.dataset.i]) return I[el.dataset.i](el,e);
  if(el.dataset.d && draft){ const path=el.dataset.d.split('.');
    if(path[0]==='ch'){ draft.chapters[+path[1]][path[2]]=el.value; if(path[2]==='text'){ const h=$(`[data-wc="${path[1]}"]`); if(h) h.textContent=wordCount(el.value)+' palabras'; } }
    else draft[path[0]]=el.value;
    if(path[0]==='title' && !draft.cover){ const cp=$('#coverPrev'); if(cp) cp.innerHTML=coverSVG({...draft,id:'draft',coverSeed:draft.coverSeed||'draft',authorName:me().name}); }
  }
});
document.addEventListener('change',e=>{ const el=e.target; if(el.dataset.d && draft && el.tagName==='SELECT') draft[el.dataset.d]=el.value; });
A.createClose=()=>{ const d=draft; const dirty=d && !d.editId && (d.title||d.synopsis||d.chapters.some(c=>c.text||(c.pages||[]).length)||d.image);
  if(dirty) showDialog({title:'¿Salir sin publicar?',text:'Puedes guardar lo que llevas como borrador y terminarlo después desde tu perfil.',ok:'Guardar borrador',cancel:'Descartar',onOk:()=>A.saveDraft()});
  else { draft=null; back(); } };
A.draftType=el=>{ const old=draft; draft=newDraft({type:el.dataset.v}); Object.assign(draft,{title:old.title,synopsis:old.synopsis,genres:old.genres,credits:old.credits,community:defaultComm(el.dataset.v)}); refresh(); };
A.draftGenre=el=>{ const g=el.dataset.v; const arr=draft.genres; const i=arr.indexOf(g); if(i>=0) arr.splice(i,1); else { if(arr.length>=4) return toast('Máximo 4 géneros'); arr.push(g); } el.classList.toggle('on'); };
A.draftMature=el=>{ draft.mature=!draft.mature; el.classList.toggle('on',draft.mature); };
A.addChapter=()=>{ draft.chapters.push({title:'Capítulo '+(draft.chapters.length+1),text:'',pages:[]}); refresh(); };
A.rmChapter=el=>{ draft.chapters.splice(+el.dataset.i,1); refresh(); };
A.pickCover=async()=>{ const [img]=await pickImages({max:700}); if(img){ draft.cover=img; refresh(); } };
A.genCover=()=>{ draft.cover=null; draft.coverSeed='c'+Math.random().toString(36).slice(2); refresh(); };
A.rmCover=()=>{ draft.cover=null; refresh(); };
A.pickPages=async el=>{ const imgs=await pickImages({multiple:true,max:1000,quality:.8}); if(imgs.length){ const c=draft.chapters[+el.dataset.i]; c.pages=[...(c.pages||[]),...imgs]; refresh(); toast(`${imgs.length} página(s) añadida(s)`); } };
A.rmPage=el=>{ draft.chapters[+el.dataset.i].pages.splice(+el.dataset.k,1); refresh(); };
A.pickArt=async()=>{ const [img]=await pickImages({max:1400,quality:.85}); if(img){ draft.image={data:img}; refresh(); } };
A.addCredit=()=>{ const u=$('#crUser').value, r=$('#crRole').value; if(!u) return toast('Elige una persona'); if(draft.credits.some(c=>c.user===u&&c.role===r)) return toast('Ese crédito ya existe'); draft.credits.push({user:u,role:r}); refresh(); };
A.rmCredit=el=>{ draft.credits.splice(+el.dataset.i,1); refresh(); };
function validateDraft(d,strict){
  if((d.title||'').trim().length<3) return 'El título debe tener al menos 3 caracteres';
  if(!strict) return null;
  if(!(d.synopsis||'').trim()) return d.type==='foro'?'Escribe el contenido de tu publicación':'Escribe una sinopsis o descripción';
  if(d.type==='novela'||d.type==='relato'){ if(d.chapters.some(c=>wordCount(c.text)<20)) return 'Cada capítulo debe tener al menos 20 palabras'; }
  if(d.type==='manga'||d.type==='comic'){ if(d.chapters.some(c=>!(c.pages||[]).length)) return 'Sube al menos una página en cada capítulo'; }
  if(d.type==='ilustracion' && !d.image) return 'Sube la imagen de tu ilustración';
  return null;
}
function buildWork(d,status){
  const chapters=(d.type==='foro'||d.type==='ilustracion')?[]:d.chapters.map(c=>d.type==='manga'||d.type==='comic'?{title:c.title.trim()||'Capítulo',pages:c.pages}:{title:c.title.trim()||'Capítulo',text:c.text.trim()});
  return {type:d.type,title:d.title.trim(),synopsis:(d.synopsis||'').trim(),community:d.community,genres:d.genres,cover:d.cover||null,coverSeed:d.coverSeed||null,image:d.type==='ilustracion'?d.image:null,chapters,credits:d.type==='foro'?[]:d.credits,license:d.license,mature:d.mature,status};
}
A.saveDraft=()=>{
  const err=validateDraft(draft,false); if(err){ const e=$('#draftErr'); if(e) e.textContent=err; else toast(err); return; }
  const data=buildWork(draft, draft.editId? (work(draft.editId).status) : 'borrador');
  if(draft.editId){ Object.assign(work(draft.editId),data); }
  else S.works.push({...data,id:newId('w'),author:S.session,votes:{},comments:[],views:0,baseVotes:0,created:Date.now()});
  save(true); draft=null; closeOverlay(); stack.pop(); render(); toast('📝 Guardado en borradores (Perfil › Borradores)');
};
A.publish=()=>{
  const d=draft; const err=validateDraft(d,true); const e=$('#draftErr'); if(err){ e.textContent=err; e.scrollIntoView({block:'center'}); return; }
  const doPub=()=>{
    const data=buildWork(d,'publicado'); let w;
    if(d.editId){ w=work(d.editId); const wasDraft=w.status!=='publicado'; Object.assign(w,data); if(wasDraft) w.created=Date.now(); }
    else { w={...data,id:newId('w'),author:S.session,votes:{},comments:[],views:0,baseVotes:0,created:Date.now()}; S.works.push(w); S.users[S.session].karma=(S.users[S.session].karma||0)+10; }
    (w.credits||[]).forEach(c=>notify(c.user,{type:'system',text:`<b>${esc(me().name)}</b> te dio crédito como ${esc(c.role)} en “${esc(w.title)}”`,link:{s:'work',id:w.id}}));
    save(true); draft=null; replace('work',{id:w.id}); toast(d.editId?'✅ Cambios guardados':'🚀 ¡Publicado en c/'+w.community+'!');
    if(!d.editId){ const fan1=randomFan([S.session]); const fan2=randomFan([S.session,fan1]);
      later(5000,()=>{ if(!work(w.id)) return; w.votes[fan1]=1; save(); softRefreshWork(w.id); notify(S.session,{type:'vote',text:`<b>${esc(user(fan1).name)}</b> votó tu publicación “${esc(w.title)}”`,link:{s:'work',id:w.id}}); });
      later(11000,()=>{ if(!work(w.id)) return; const txt=w.type==='foro'?'¡Muy buen tema! Me sumo a la discusión 🙌':['¡Me encantó! Quiero leer más 😍','Gran inicio, la atmósfera está brutal.','¿Cuándo sale lo siguiente? 👀','Qué buen estilo, te sigo.'][Math.floor(Math.random()*4)]; w.comments.push({id:newId('c'),user:fan2,text:txt,time:Date.now(),likes:[]}); save(); notify(S.session,{type:'comment',text:`<b>${esc(user(fan2).name)}</b> comentó: “${esc(txt)}”`,link:{s:'work',id:w.id,focus:'comments'}}); softRefreshWork(w.id); });
    }
    return w;
  };
  if(isToxic(d.title+' '+d.synopsis)) showDialog({title:'⚠️ Revisión automática',html:`<div class="mod-flag" style="margin-top:8px">${icon('shield')}<span>El título o la descripción podrían contener lenguaje ofensivo. Puedes editarlo o publicarlo y será revisado por moderación.</span></div>`,ok:'Publicar igual',cancel:'Editar',onOk:()=>{ const nw=doPub(); S.reports.unshift({rid:newId('r'),kind:'work',id:nw.id,reason:'Posible lenguaje ofensivo (detección automática)',note:'',by:'sistema',t:Date.now(),status:'pendiente'}); save(); }});
  else doPub();
};

function softRefreshWork(id){ if(current().name==='work'&&current().params.id===id&&!overlayOpen()&&!(document.activeElement&&document.activeElement.tagName==='TEXTAREA'&&document.activeElement.value)) refresh(); }
/* ======================= MATCH ======================= */
function compat(a,b){
  const ga=new Set(a.genres||[]), gb=new Set(b.genres||[]); const inter=[...ga].filter(x=>gb.has(x)).length; const uni=new Set([...ga,...gb]).size||1;
  const comp=(a.role==='Escritor/a'&&b.role==='Ilustrador/a')||(a.role==='Ilustrador/a'&&b.role==='Escritor/a')?1:(a.role==='Lector/a'||b.role==='Lector/a')?.55:.35;
  const cb=(a.collab||[]).filter(x=>(b.collab||[]).includes(x)).length;
  return Math.min(99,Math.round(28+ (inter/uni)*42 + comp*22 + Math.min(cb,2)*4));
}
function meForMatch(){ return me()||{username:'_guest',role:'Escritor/a',genres:['Fantasía','Misterio','Aventura'],collab:['Portadas']}; }
function matchCandidates(){
  const m=meForMatch(); const mm=S.matches[m.username]||{liked:[],skipped:[],matched:[]}; const f=UI.matchFilters;
  return Object.values(S.users).filter(u=>u.username!==m.username && !u.official && !mm.liked.includes(u.username) && !mm.skipped.includes(u.username)
    && (!f.roles.length||f.roles.includes(u.role)) && (!f.genres.length||(u.genres||[]).some(g=>f.genres.includes(g))) && (!f.collab.length||(u.collab||[]).some(c=>f.collab.includes(c))))
    .map(u=>({u,score:compat(m,u)})).sort((a,b)=>b.score-a.score);
}
function matchCard(c,back){
  const m=meForMatch(); const u=c.u; const shared=(u.genres||[]).filter(g=>(m.genres||[]).includes(g)); const nWorks=S.works.filter(w=>w.author===u.username&&w.status==='publicado').length;
  return `<div class="mcard ${back?'back':''}" ${back?'':`id="topCard" data-u="${u.username}"`}><div class="stamp like">COLABORAR</div><div class="stamp nope">PASAR</div>
    <div class="mtop"><div class="bgart">${bannerSVG(u.banner||u.username)}</div>${avatarHTML(u)}<div class="compat">${icon('sparkles')} ${c.score}% afinidad</div></div>
    <div class="minfo"><div class="row between"><div><div class="h2">${esc(u.name)}</div><div class="small muted">@${esc(u.username)} · ${nWorks} ${nWorks===1?'obra':'obras'}</div></div><span class="tag ${u.role==='Ilustrador/a'?'blue':u.role==='Escritor/a'?'':'green'}">${esc(u.role)}</span></div>
    <p style="margin:10px 0;font-size:15px">${esc(u.bio||'')}</p>
    <div class="tiny muted" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:5px">Géneros</div><div class="chips wrap" style="gap:5px;margin-bottom:10px">${(u.genres||[]).map(g=>`<span class="tag ${shared.includes(g)?'':'gray'}">${shared.includes(g)?'★ ':''}${esc(g)}</span>`).join('')}</div>
    ${(u.collab||[]).length?`<div class="tiny muted" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:5px">Busca</div><div class="chips wrap" style="gap:5px">${u.collab.map(c=>`<span class="tag purple">${esc(c)}</span>`).join('')}</div>`:''}</div></div>`;
}
SCREENS.match={ render(){
  const cands=matchCandidates(); const f=UI.matchFilters; const nf=f.roles.length+f.genres.length+f.collab.length;
  const deck=cands.length?`${cands[1]?matchCard(cands[1],true):''}${matchCard(cands[0])}`:`<div class="empty" style="height:100%"><img src="${ASSETS.logo}" alt=""><div class="h3">No hay más perfiles${nf?' con estos filtros':' por ahora'}</div><div class="small">Vuelve más tarde o ajusta tus filtros para descubrir más creadores.</div><div class="row">${nf?`<button class="btn btn-ghost btn-sm" data-a="clearMatchFilters">Limpiar filtros</button>`:''}<button class="btn btn-primary btn-sm" data-a="resetSkipped">${icon('refresh')} Ver de nuevo</button></div></div>`;
  return `${topbar({back:false,title:'Match',actions:`<button class="icon-btn" data-a="matchFilters" aria-label="Filtros">${icon('filter')}${nf?`<span class="badge">${nf}</span>`:''}</button><button class="icon-btn" data-a="go" data-s="matches" aria-label="Mis matches">${icon('users')}</button>`})}
  <div class="match-wrap">${!S.session?`<div class="banner-tip" style="margin-bottom:10px;padding:10px"><span class="small grow">Inicia sesión para hacer match y chatear con creadores.</span><button class="btn btn-primary btn-sm" data-a="go" data-s="auth" data-mode="login">Entrar</button></div>`:''}
  <div class="deck">${deck}</div>
  ${cands.length?`<div class="match-actions"><button class="round sm" data-a="matchUndo" aria-label="Deshacer" style="color:var(--gold)">${icon('undo')}</button><button class="round nope" data-a="matchSwipe" data-dir="-1" aria-label="Pasar">${icon('x','stroke-width="3"')}</button><button class="round like" data-a="matchSwipe" data-dir="1" aria-label="Colaborar">${icon('heart','fill="currentColor" stroke-width="0"')}</button><button class="round sm info" data-a="matchInfo" aria-label="Ver perfil">${icon('info')}</button></div>`:`<div style="height:calc(var(--nav-h) + 20px)"></div>`}</div>`;
}, after(){ setupSwipe(); } };
function setupSwipe(){
  const card=$('#topCard'); if(!card) return; let sx=0,sy=0,dx=0,dy=0,drag=false;
  const like=$('.stamp.like',card), nope=$('.stamp.nope',card);
  card.addEventListener('pointerdown',e=>{ if(e.target.closest('button')) return; drag=true; sx=e.clientX; sy=e.clientY; card.setPointerCapture(e.pointerId); card.style.transition='none'; });
  card.addEventListener('pointermove',e=>{ if(!drag) return; dx=e.clientX-sx; dy=e.clientY-sy; card.style.transform=`translate(${dx}px,${dy*.3}px) rotate(${dx/18}deg)`; like.style.opacity=Math.max(0,Math.min(1,dx/90)); nope.style.opacity=Math.max(0,Math.min(1,-dx/90)); });
  const end=()=>{ if(!drag) return; drag=false; card.style.transition='transform .3s ease'; if(Math.abs(dx)>100) doSwipe(dx>0?1:-1); else if(Math.abs(dx)<6&&Math.abs(dy)<6){ card.style.transform=''; } else { card.style.transform=''; like.style.opacity=0; nope.style.opacity=0; } dx=dy=0; };
  card.addEventListener('pointerup',end); card.addEventListener('pointercancel',end);
}
function doSwipe(dir){
  const card=$('#topCard'); if(!card) return; const u=card.dataset.u;
  if(dir>0 && !S.session){ card.style.transform=''; requireAuth('hacer match'); return; }
  card.style.transition='transform .35s ease, opacity .35s'; card.style.transform=`translate(${dir*600}px,-40px) rotate(${dir*30}deg)`; card.style.opacity='0';
  const m=meForMatch(); const mm=S.matches[m.username]=S.matches[m.username]||{liked:[],skipped:[],matched:[]};
  if(dir>0){ mm.liked.push(u); const t=user(u); const mutual=t.passHash?false:rng(u+m.username)()<(t.likesYou ?? 0.6);
    if(mutual){ mm.matched.push(u); save(); setTimeout(()=>showItsMatch(u),320);
      later(2500,()=>{ const id=chatId(u); if(!S.chats[id]) S.chats[id]={owner:S.session,with:u,unread:true,msgs:[]}; const intro=u==='camila_ilustra'?CHAT_SEED[0].msgs[0].text:`¡Hola! Hicimos match 🙌 Vi tu perfil y creo que podríamos crear algo genial juntos. ¿Qué tienes en mente?`; S.chats[id].msgs.push({from:u,text:intro,t:Date.now()}); S.chats[id].unread=true; save(); notify(S.session,{type:'match',text:`<b>${esc(t.name)}</b> te envió un mensaje`,link:{s:'chat',id:u}}); });
    } else { save(); toast(`💛 Le enviaste tu interés a ${t.name.split(' ')[0]}`); }
  } else { mm.skipped.push(u); UI.lastSkipped.push(u); save(); }
  setTimeout(()=>{ if(current().name==='match') refresh(); },330);
}
function showItsMatch(u){ const t=user(u); $('#overlay').innerHTML=`<div class="its-match"><div class="h1">¡Es un match!</div><div class="pair">${avatarHTML(me())}${avatarHTML(t)}</div><p style="font-size:17px;max-width:300px">Tú y <b>${esc(t.name)}</b> quieren colaborar. ¡Escríbele para empezar un proyecto!</p><button class="btn btn-primary btn-block" style="max-width:300px" data-a="matchChat" data-u="${u}">${icon('chat')} Enviar mensaje</button><button class="btn btn-block" style="max-width:300px;color:#ccc" data-a="closeOverlay">Seguir explorando</button></div>`; notify(S.session,{type:'match',text:`<b>¡Nuevo match!</b> Tú y ${esc(t.name)} quieren colaborar`,link:{s:'chat',id:u}}); }
A.matchSwipe=el=>doSwipe(+el.dataset.dir);
A.matchInfo=()=>{ const c=$('#topCard'); if(c) go('user',{u:c.dataset.u}); };
A.matchUndo=()=>{ const u=UI.lastSkipped.pop(); if(!u) return toast('Nada que deshacer'); const mm=S.matches[meForMatch().username]; mm.skipped=mm.skipped.filter(x=>x!==u); save(); refresh(); };
A.resetSkipped=()=>{ const mm=S.matches[meForMatch().username]; if(mm) mm.skipped=[]; save(); refresh(); };
A.clearMatchFilters=()=>{ UI.matchFilters={roles:[],genres:[],collab:[]}; closeOverlay(); refresh(); };
A.matchChat=el=>{ closeOverlay(); const u=el.dataset.u; const id=chatId(u); if(!S.chats[id]) S.chats[id]={owner:S.session,with:u,unread:false,msgs:[]}; save(); go('chat',{id:u}); };
A.matchFilters=()=>{ const f=UI.matchFilters; const grp=(key,items)=>`<div class="chips wrap" style="gap:6px">${items.map(v=>`<button class="chip ${f[key].includes(v)?'on':''}" data-a="mf" data-k="${key}" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;
  showSheet(`<div style="padding:0 18px"><div class="field"><span>Busco a un/a…</span>${grp('roles',ROLES)}</div><div class="field"><span>Que le guste…</span>${grp('genres',GENRES)}</div><div class="field"><span>Para…</span>${grp('collab',COLLABS)}</div>
  <div class="row" style="margin-top:6px"><button class="btn btn-ghost grow" data-a="clearMatchFilters">Limpiar</button><button class="btn btn-primary grow" data-a="applyMatchFilters">Aplicar</button></div></div>`,'Filtros de Match'); };
A.mf=el=>{ const arr=UI.matchFilters[el.dataset.k]; const v=el.dataset.v; const i=arr.indexOf(v); if(i>=0) arr.splice(i,1); else arr.push(v); el.classList.toggle('on'); };
A.applyMatchFilters=()=>{ closeOverlay(); refresh(); };

SCREENS.matches={ render(){
  const mm=S.matches[S.session]||{liked:[],matched:[]}; const pending=mm.liked.filter(u=>!mm.matched.includes(u));
  return `${topbar({title:'Mis colaboraciones'})}<div class="scroll"><div class="pad">
  <div class="section-label"><span>Matches (${mm.matched.length})</span></div>
  ${mm.matched.length?`<div class="list">${mm.matched.map(u=>`<div class="li">${avatarHTML(u)}<button class="txt" style="text-align:left" data-a="user" data-u="${u}"><b>${nameHTML(u)}</b><span>${esc(user(u).role)} · ${compat(me(),user(u))}% afinidad</span></button><button class="btn btn-primary btn-sm" data-a="matchChat" data-u="${u}">${icon('chat')}</button></div>`).join('')}</div>`:emptyHTML('🤝','Aún no tienes matches','Desliza a la derecha en Match para mostrar interés en colaborar.',`<button class="btn btn-primary" data-a="tab" data-t="match">Ir a Match</button>`)}
  ${pending.length?`<div class="section-label"><span>Interés enviado (${pending.length})</span></div><div class="list">${pending.map(u=>`<button class="li" data-a="user" data-u="${u}">${avatarHTML(u)}<span class="txt"><b>${nameHTML(u)}</b><span>Esperando respuesta…</span></span>${icon('clock','class="chev"')}</button>`).join('')}</div>`:''}
  </div></div>`; } };

/* ======================= CHAT ======================= */
SCREENS.chats={ render(){
  const list=myChats();
  return `${topbar({title:'Mensajes',actions:`<button class="icon-btn" data-a="newChat" aria-label="Nuevo mensaje">${icon('edit')}</button>`})}<div class="scroll">${list.length?list.map(c=>{ const u=user(c.with); const last=c.msgs.at(-1); return `<button class="li conv" data-a="openChat" data-u="${c.with}">${avatarHTML(u)}<span class="txt"><b>${nameHTML(c.with)}</b><span class="${c.unread?'':'muted'}" style="${c.unread?'color:var(--text);font-weight:700':''}">${last?(last.from===S.session?'Tú: ':'')+(last.img?'📷 Imagen':esc(last.text)):'Nuevo match · ¡Saluda!'}</span></span><span class="tiny faint" style="text-align:right">${last?timeAgo(last.t):''}${c.unread?'<br><span class="unread-dot" style="display:inline-block;margin-top:4px"></span>':''}</span></button>`; }).join(''):emptyHTML('💬','Sin conversaciones','Haz match con otros creadores para empezar a chatear.',`<button class="btn btn-primary" data-a="tab" data-t="match">Buscar colaboradores</button>`)}</div>`; } };
A.openChat=el=>go('chat',{id:el.dataset.u});
A.newChat=()=>{ const m=me(); const pool=[...new Set([...(S.matches[S.session]?.matched||[]),...(m.following||[])])]; showSheet(pool.length?pool.map(u=>`<button class="opt" data-a="matchChat" data-u="${u}">${avatarHTML(u,'av-sm')} ${nameHTML(u)}</button>`).join(''):`<p class="pad muted">Sigue a creadores o haz match para escribirles.</p>`,'Nuevo mensaje'); };
SCREENS.chat={ noNav:true, render(p){
  const u=user(p.id); const id=chatId(p.id); const c=S.chats[id]||{msgs:[]};
  let msgs='', lastDay='';
  c.msgs.forEach(m=>{ const d=dayLabel(m.t); if(d!==lastDay){ msgs+=`<div class="day-sep">${d}</div>`; lastDay=d; } msgs+=msgHTML(m); });
  return `<header class="topbar"><button class="icon-btn" data-a="back">${icon('back')}</button><button class="row grow" style="gap:10px;text-align:left" data-a="user" data-u="${u.username}"><span class="online">${avatarHTML(u,'av-sm')}</span><span class="grow" style="line-height:1.15"><b class="ellipsis" style="display:block">${nameHTML(u.username)}</b><span class="tiny muted">${esc(u.role)} · en línea</span></span></button><button class="icon-btn" data-a="chatMenu" data-u="${u.username}">${icon('more')}</button></header>
  <div class="scroll" id="msgScroll"><div class="msgs" id="msgs">${msgs||`<div class="empty"><div class="e">👋</div><div class="small">Rompe el hielo: cuéntale a ${esc(u.name.split(' ')[0])} sobre tu proyecto.</div></div>`}</div></div>
  <form class="composer" data-f="chat" data-u="${u.username}"><button type="button" class="icon-btn" data-a="chatImg" style="width:40px;height:40px">${icon('camera')}</button><textarea name="text" rows="1" placeholder="Escribe un mensaje…" maxlength="2000"></textarea><button class="send-btn" aria-label="Enviar">${icon('send')}</button></form>`;
}, after(p){ const c=S.chats[chatId(p.id)]; if(c&&c.unread){ c.unread=false; save(); } const sc=$('#msgScroll'); sc.scrollTop=sc.scrollHeight; } };
function msgHTML(m){ return `<div class="msg ${m.from===S.session?'me':'them'}">${m.img?`<img src="${m.img}" alt="">`:''}${m.text?esc(m.text):''}<time>${clock(m.t)}</time></div>`; }
function pushMsg(u,m){ const id=chatId(u); const c=S.chats[id]=S.chats[id]||{owner:S.session,with:u,unread:false,msgs:[]}; c.msgs.push(m);
  if(current().name==='chat'&&current().params.id===u){ const box=$('#msgs'); if(box){ $$('.typing,.empty',box).forEach(x=>x.remove()); box.insertAdjacentHTML('beforeend',msgHTML(m)); const sc=$('#msgScroll'); sc.scrollTop=sc.scrollHeight; } }
  else { c.unread=true; updateBadges(); } save(); }
function autoReply(u){
  const t=user(u); if(t.passHash) return; const opts=AUTO_REPLIES[t.role]||AUTO_REPLIES['Lector/a'];
  later(900,()=>{ if(current().name==='chat'&&current().params.id===u){ const m=$('#msgs'); if(m&&!$('.typing',m)){ m.insertAdjacentHTML('beforeend','<div class="typing"><i></i><i></i><i></i></div>'); const sc=$('#msgScroll'); sc.scrollTop=sc.scrollHeight; } } });
  later(2200+Math.random()*1200,()=>{ pushMsg(u,{from:u,text:opts[Math.floor(Math.random()*opts.length)],t:Date.now()}); if(!(current().name==='chat'&&current().params.id===u)) notify(S.session,{type:'match',text:`<b>${esc(t.name)}</b> te envió un mensaje`,link:{s:'chat',id:u}}); });
}
F.chat=form=>{ const ta=$('textarea',form); const text=ta.value.trim(); if(!text) return; const u=form.dataset.u;
  if(isToxic(text)){ toast('⚠️ Mantén el respeto: tu mensaje contiene lenguaje ofensivo'); return; }
  ta.value=''; ta.style.height='auto'; pushMsg(u,{from:S.session,text,t:Date.now()}); autoReply(u); };
A.chatImg=async()=>{ const u=current().params.id; const [img]=await pickImages({max:900}); if(img){ pushMsg(u,{from:S.session,text:'',img,t:Date.now()}); autoReply(u); } };
A.chatMenu=el=>{ const u=el.dataset.u; showSheet(`<button class="opt" data-a="user" data-u="${u}">${icon('user')} Ver perfil</button><button class="opt" data-a="clearChat" data-u="${u}">${icon('trash')} Vaciar conversación</button><button class="opt danger" data-a="report" data-kind="user" data-id="${u}">${icon('flag')} Reportar usuario</button>`); };
A.clearChat=el=>{ const id=chatId(el.dataset.u); if(S.chats[id]) S.chats[id].msgs=[]; save(); closeOverlay(); refresh(); };
document.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey&&e.target.matches('.composer textarea')){ e.preventDefault(); e.target.form.requestSubmit(); } });

/* ======================= NOTIFICACIONES ======================= */
const NI={vote:['up','var(--gold)'],comment:['comment','var(--blue)'],match:['heart','var(--red)'],follow:['userPlus','var(--green)'],system:['sparkles','var(--gold)'],mod:['shield','var(--purple)']};
SCREENS.notifs={ render(){
  const list=myNotifs();
  return `${topbar({title:'Notificaciones',actions:list.some(n=>!n.read)?`<button class="btn btn-sm" style="color:var(--gold)" data-a="readAll">Leer todo</button>`:''})}<div class="scroll">${list.length?list.map(n=>{ const [ic,col]=NI[n.type]||NI.system; return `<button class="notif ${n.read?'':'unread'}" data-a="openNotif" data-id="${n.id}"><span class="ni" style="background:color-mix(in srgb,${col} 18%,transparent);color:${col}">${icon(ic,n.type==='match'?'fill="currentColor"':'')}</span><span class="grow"><p>${n.text}</p><span class="tiny faint">${timeAgo(n.t)}</span></span>${n.read?'':'<span class="unread-dot" style="margin-top:6px"></span>'}</button>`; }).join(''):emptyHTML('🔔','Todo al día','Aquí verás votos, comentarios, nuevos seguidores y matches.')}</div>`; } };
A.readAll=()=>{ myNotifs().forEach(n=>n.read=true); save(); refresh(); };
A.openNotif=el=>{ const n=myNotifs().find(x=>x.id===el.dataset.id); if(!n) return; n.read=true; save(); if(n.link){ const {s,...p}=n.link; if(s==='work'&&!work(p.id)) return toast('Esta obra ya no existe'); go(s,p); } else refresh(); };

/* ======================= PERFIL ======================= */
function profileHTML(u,own){
  const x=user(u); const works=S.works.filter(w=>w.author===u&&w.status==='publicado'&&!w.removed);
  const collabWorks=S.works.filter(w=>w.status==='publicado'&&!w.removed&&(w.credits||[]).some(c=>c.user===u));
  const tabs=own?[['obras','Obras'],['guardados','Guardados'],['borradores','Borradores'],['comunidades','Comunidades']]:[['obras','Obras'],['colabs','Colaboraciones'],['comunidades','Comunidades']];
  if(!tabs.some(t=>t[0]===UI.profileTab)) UI.profileTab='obras';
  let body='';
  if(UI.profileTab==='obras') body=works.length?works.sort((a,b)=>b.created-a.created).map(postCard).join(''):emptyHTML('🖋️',own?'Aún no has publicado':'Sin publicaciones',own?'Comparte tu primera novela, manga, cómic o ilustración.':'Esta persona todavía no ha publicado.',own?`<button class="btn btn-primary" data-a="create">Publicar</button>`:'');
  if(UI.profileTab==='colabs') body=collabWorks.length?collabWorks.map(postCard).join(''):emptyHTML('🤝','Sin colaboraciones','Aún no aparece en los créditos de otras obras.');
  if(UI.profileTab==='guardados'){ const ids=S.saved[u]||[]; const ws=ids.map(work).filter(Boolean); body=ws.length?ws.map(postCard).join(''):emptyHTML('🔖','Tu biblioteca está vacía','Guarda obras para leerlas después.'); }
  if(UI.profileTab==='borradores'){ const ds=S.works.filter(w=>w.author===u&&w.status==='borrador'); body=ds.length?`<div class="list">${ds.map(w=>`<div class="li"><div class="cover" style="width:44px">${coverHTML(w)}</div><span class="txt"><b>${esc(w.title)}</b><span>${FORMATS[w.type].label} · editado ${timeAgo(w.created)}</span></span><button class="btn btn-primary btn-sm" data-a="editWork" data-id="${w.id}">Editar</button><button class="icon-btn" data-a="deleteWork" data-id="${w.id}">${icon('trash')}</button></div>`).join('')}</div>`:emptyHTML('📝','Sin borradores','Los borradores que guardes aparecerán aquí.'); }
  if(UI.profileTab==='comunidades'){ const cs=(S.joined[u]||[]).map(community); body=cs.length?`<div class="list">${cs.map(commRow).join('')}</div>`:emptyHTML('🌐','Sin comunidades','No se ha unido a ninguna comunidad.'); }
  return `<div class="banner">${x.bannerImg?`<img src="${x.bannerImg}" alt="">`:bannerSVG(x.banner||u)}</div>
  <div class="profile-head"><div class="row top">${avatarHTML(x,'av-xl')}<div class="row" style="gap:8px;padding-bottom:6px">${own?`<button class="btn btn-ghost btn-sm" data-a="go" data-s="editProfile">${icon('edit')} Editar</button>`:`${followBtn(u)}<button class="btn btn-ghost btn-sm" data-a="dmUser" data-u="${u}">${icon('chat')}</button>`}</div></div>
  <div class="h2" style="margin-top:10px">${nameHTML(u)}</div><div class="small muted">@${esc(u)} · Se unió ${new Date(x.joined||Date.now()).toLocaleDateString('es-CO',{month:'long',year:'numeric'})}</div>
  <div class="row wrap" style="gap:6px;margin-top:8px"><span class="tag ${x.role==='Ilustrador/a'?'blue':x.role==='Escritor/a'?'':x.role==='Moderación'?'purple':'green'}">${esc(x.role||'Lector/a')}</span>${(x.genres||[]).map(g=>`<span class="tag gray">${esc(g)}</span>`).join('')}</div>
  ${x.bio?`<p style="margin-top:10px;white-space:pre-wrap">${esc(x.bio)}</p>`:own?`<p class="muted small" style="margin-top:10px">Añade una biografía para que otros creadores te conozcan.</p>`:''}
  ${(x.collab||[]).length?`<div class="small" style="margin-top:8px"><span class="muted">Busca:</span> ${x.collab.map(esc).join(' · ')}</div>`:''}
  <div class="stats" style="margin-top:14px"><div class="stat"><b>${works.length}</b><span>Obras</span></div><div class="stat"><b>${fmtNum(followersCount(u))}</b><span>Seguidores</span></div><div class="stat"><b>${(x.following||[]).length}</b><span>Siguiendo</span></div><div class="stat"><b>${fmtNum(karmaOf(u))}</b><span>Karma</span></div></div></div>
  <div class="tabs" style="margin-top:14px">${tabs.map(([k,l])=>`<button class="tab ${UI.profileTab===k?'on':''}" data-a="profileTab" data-k="${k}">${l}</button>`).join('')}</div>
  <div class="pad">${body}</div>`;
}
SCREENS.profile={ render(){
  const m=me();
  if(!m) return `${topbar({back:false,title:'Perfil',actions:`<button class="icon-btn" data-a="go" data-s="settings">${icon('gear')}</button>`})}<div class="scroll pb-nav"><div class="empty" style="padding-top:60px"><img src="${ASSETS.logo}" alt="" style="width:130px;height:130px"><div class="h2">Tu espacio creativo</div><div class="small" style="max-width:300px">Crea una cuenta para publicar, guardar obras, seguir creadores y hacer match.</div><button class="btn btn-primary" style="margin-top:10px" data-a="go" data-s="auth" data-mode="register">Crear cuenta</button><button class="btn btn-ghost" data-a="go" data-s="auth" data-mode="login">Ya tengo cuenta</button></div></div>`;
  return `${topbar({back:false,title:'@'+esc(m.username),actions:`<button class="icon-btn" data-a="go" data-s="notifs">${icon('bell')}<span class="badge" data-badge="notifs" style="display:none"></span></button><button class="icon-btn" data-a="go" data-s="settings" aria-label="Ajustes">${icon('gear')}</button>`})}<div class="scroll pb-nav">${profileHTML(m.username,true)}</div>`;
}, after(){ updateBadges(); } };
SCREENS.user={ render(p){ const x=user(p.u); return `${topbar({title:esc(x.name),actions:`<button class="icon-btn" data-a="userMenu" data-u="${p.u}">${icon('more')}</button>`})}<div class="scroll" style="padding-bottom:30px">${profileHTML(p.u,false)}</div>`; } };
A.profileTab=el=>{ UI.profileTab=el.dataset.k; refresh(); };
A.dmUser=el=>{ if(!requireAuth('enviar mensajes')) return; const u=el.dataset.u; const id=chatId(u); if(!S.chats[id]) S.chats[id]={owner:S.session,with:u,unread:false,msgs:[]}; save(); go('chat',{id:u}); };
A.userMenu=el=>{ const u=el.dataset.u; showSheet(`<button class="opt" data-a="shareUser" data-u="${u}">${icon('share')} Compartir perfil</button><button class="opt danger" data-a="report" data-kind="user" data-id="${u}">${icon('flag')} Reportar usuario</button>`); };
A.shareUser=el=>{ const x=user(el.dataset.u); shareText(`${x.name} (@${x.username}) en CHOGGUN`,x.bio||''); };

/* ---------- editar perfil ---------- */
let pedit=null;
SCREENS.editProfile={ noNav:true, render(p){
  const m=me(); if(!pedit||pedit.username!==m.username) pedit=JSON.parse(JSON.stringify(m));
  const e=pedit; const presets=['logo','gato','rana',null];
  return `${topbar({title:p.first?'Completa tu perfil':'Editar perfil',actions:`<button class="btn btn-primary btn-sm" style="margin-right:6px" data-a="saveProfile">Guardar</button>`}).replace('data-a="back"','data-a="cancelProfile"')}
  <div class="scroll"><div class="banner" style="height:110px">${e.bannerImg?`<img src="${e.bannerImg}" alt="">`:bannerSVG(e.banner||e.username)}<button class="btn btn-sm" style="position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,.55);color:#fff" data-a="newBanner">${icon('refresh')} Fondo</button></div>
  <div class="pad">${p.first?`<div class="banner-tip" style="margin-bottom:16px"><img src="${ASSETS.logo}" alt=""><div class="small">Elige tu avatar y tus géneros favoritos: así Match te sugiere colaboradores con más afinidad.</div></div>`:''}
  <div class="field"><span>Avatar</span><div class="av-pick">${presets.map(a=>`<button class="${(e.avatar||null)===a?'on':''}" data-a="pickAvatar" data-v="${a||''}">${a?`<img src="${ASSETS[a]}" alt="">`:initialsAvatar(e.name,e.username)}</button>`).join('')}${e.avatar&&e.avatar.startsWith('data:')?`<button class="on"><img src="${e.avatar}" alt=""></button>`:''}<button class="up" data-a="uploadAvatar" aria-label="Subir foto">${icon('camera')}</button></div></div>
  <label class="field"><span>Nombre visible</span><input class="input" data-p="name" value="${esc(e.name)}" maxlength="40"></label>
  <label class="field"><span>Biografía <b class="faint" id="bioCount">${(e.bio||'').length}/160</b></span><textarea class="textarea" data-p="bio" maxlength="160" style="min-height:80px" placeholder="Cuéntanos qué creas y qué buscas…">${esc(e.bio||'')}</textarea></label>
  <div class="field"><span>Rol principal</span><div class="chips wrap">${ROLES.map(r=>`<button class="chip ${e.role===r?'on':''}" data-a="pRole" data-v="${r}">${r}</button>`).join('')}</div></div>
  <div class="field"><span>Géneros favoritos</span><div class="chips wrap">${GENRES.map(g=>`<button class="chip ${(e.genres||[]).includes(g)?'on':''}" data-a="pToggle" data-k="genres" data-v="${esc(g)}">${esc(g)}</button>`).join('')}</div></div>
  <div class="field"><span>Tipo de colaboración que buscas</span><div class="chips wrap">${COLLABS.map(c=>`<button class="chip ${(e.collab||[]).includes(c)?'on':''}" data-a="pToggle" data-k="collab" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>
  <button class="btn btn-primary btn-block" style="margin-top:6px" data-a="saveProfile">Guardar perfil</button></div></div>`;
} };
document.addEventListener('input',e=>{ const el=e.target; if(el.dataset.p && pedit){ pedit[el.dataset.p]=el.value; if(el.dataset.p==='bio'){ const c=$('#bioCount'); if(c) c.textContent=el.value.length+'/160'; } } });
A.pickAvatar=el=>{ pedit.avatar=el.dataset.v||null; refresh(); };
A.uploadAvatar=async()=>{ const [img]=await pickImages({max:320,quality:.85}); if(img){ pedit.avatar=img; refresh(); } };
A.newBanner=()=>{ pedit.banner=pedit.username+Math.random().toString(36).slice(2,6); pedit.bannerImg=null; refresh(); };
A.pRole=el=>{ pedit.role=el.dataset.v; $$('.chip',el.parentElement).forEach(c=>c.classList.toggle('on',c===el)); };
A.pToggle=el=>{ const arr=pedit[el.dataset.k]=pedit[el.dataset.k]||[]; const v=el.dataset.v; const i=arr.indexOf(v); if(i>=0) arr.splice(i,1); else arr.push(v); el.classList.toggle('on'); };
A.cancelProfile=()=>{ pedit=null; back(); };
A.saveProfile=()=>{ if(!pedit.name.trim()) return toast('El nombre no puede estar vacío'); if(isToxic(pedit.name+' '+pedit.bio)) return toast('⚠️ Tu perfil contiene lenguaje no permitido');
  const m=me(); ['name','bio','role','genres','collab','avatar','banner','bannerImg'].forEach(k=>m[k]=pedit[k]); m.name=m.name.trim(); pedit=null; save(true); const first=current().params.first; back(); toast(first?'✨ ¡Perfil listo! Prueba la pestaña Match':'✅ Perfil actualizado'); };

/* ======================= AJUSTES ======================= */
SCREENS.settings={ render(){
  const s=S.settings; const m=me();
  const row=(ic,title,sub,act,extra='',right='')=>`<button class="li" ${act?`data-a="${act}"`:''} ${extra}><span class="ic">${icon(ic)}</span><span class="txt"><b>${title}</b>${sub?`<span>${sub}</span>`:''}</span>${right||icon('chevR','class="chev"')}</button>`;
  const tog=(k)=>`<span class="toggle ${s[k]?'on':''}"></span>`;
  return `${topbar({title:'Ajustes'})}<div class="scroll"><div class="pad">
  ${m?`<div class="section-label"><span>Cuenta</span></div><div class="list">${row('user','Editar perfil','@'+esc(m.username),'go','data-s="editProfile"')}${row('lock','Cambiar contraseña','','changePw')}${row('mail','Correo',esc(m.email),'')}</div>`:''}
  <div class="section-label"><span>Apariencia</span></div><div class="card" style="padding:14px">
   <div class="field"><span>Tema</span><div class="seg">${[['dark','Oscuro','moon'],['light','Claro','sun'],['system','Sistema','gear']].map(([k,l,ic])=>`<button class="${s.theme===k?'on':''}" data-a="setTheme" data-v="${k}">${icon(ic)} ${l}</button>`).join('')}</div></div>
   <div class="field"><span>Opacidad de publicaciones · <b id="opv">${Math.round(s.cardOpacity*100)}%</b></span><input type="range" min="30" max="100" value="${Math.round(s.cardOpacity*100)}" data-i="cardOpacity"></div>
   <div class="field" style="margin:0"><span>Tamaño de lectura · <b id="rsv2">${s.readerSize}px</b></span><input type="range" min="14" max="26" value="${s.readerSize}" data-i="readerSize2"></div></div>
  <div class="section-label"><span>Preferencias</span></div><div class="list">${row('bell','Notificaciones','Avisos de votos, comentarios y matches','togSetting','data-k="notifications"',tog('notifications'))}${row('eyeOff','Mostrar contenido sensible (+18)','Contenido marcado por sus autores','togSetting','data-k="mature"',tog('mature'))}</div>
  <div class="section-label"><span>Comunidad y seguridad</span></div><div class="list">${row('shield','Normas de la comunidad','Respeto, créditos y derechos de autor','rules')}${m?row('flag','Mis reportes',`${S.reports.filter(r=>r.by===S.session).length} enviados`,'go','data-s="reports" data-mode="mine"'):''}${row('award','Panel de moderación','Revisión humana de reportes (demo)','go','data-s="reports" data-mode="mod"')}</div>
  <div class="section-label"><span>Datos</span></div><div class="list">${m?row('download','Exportar mis datos','Copia tus datos en formato JSON','exportData'):''}${row('refresh','Restablecer datos de demostración','Borra todo lo guardado en este dispositivo','resetAll')}</div>
  <div class="section-label"><span>Acerca de</span></div><div class="card" style="padding:16px;text-align:center"><img src="${ASSETS.logo}" alt="" style="width:76px;height:76px;border-radius:50%;margin:0 auto 8px;border:2px solid var(--gold)"><div class="h2 gold" style="letter-spacing:.12em">CHOGGUN</div><div class="tiny muted">Versión ${APP_VERSION}</div><p class="small" style="margin:10px 0">Plataforma digital colaborativa de contenido literario para escritores, ilustradores y lectores.</p><div class="tiny muted">Semillero SIIANTEC · Tecnólogo en Desarrollo de Software<br>Corporación Tecnológica Industrial Colombiana — TEINCO<br>William Monsalve · Nicolás Arias · Johan Marroquín<br>Bogotá, 2026</div></div>
  ${m?`<button class="btn btn-block" style="margin-top:18px;color:var(--red);border:1.5px solid var(--red)" data-a="logout">${icon('logout')} Cerrar sesión</button>`:`<button class="btn btn-primary btn-block" style="margin-top:18px" data-a="go" data-s="auth" data-mode="login">Iniciar sesión</button>`}
  <div style="height:30px"></div></div></div>`; } };
A.setTheme=el=>{ S.settings.theme=el.dataset.v; save(); refresh(); };
I.cardOpacity=el=>{ S.settings.cardOpacity=el.value/100; $('#opv').textContent=el.value+'%'; applyTheme(); save(); };
I.readerSize2=el=>{ S.settings.readerSize=+el.value; $('#rsv2').textContent=el.value+'px'; save(); };
A.togSetting=el=>{ const k=el.dataset.k; S.settings[k]=!S.settings[k]; save(); refresh(); };
A.changePw=()=>{ showDialog({title:'Cambiar contraseña',html:`<input class="input" type="password" id="pw0" placeholder="Contraseña actual" style="margin-top:10px"><input class="input" type="password" id="pw1" placeholder="Nueva contraseña" style="margin-top:8px"><div class="err" id="pwErr"></div>`,ok:'Cambiar'}); $('#overlay [data-a=dialogOk]').dataset.a='pwOk'; };
A.pwOk=()=>{ const m=me(); const a=$('#pw0').value, b=$('#pw1').value; const err=$('#pwErr');
  if(m.passHash!==pwHash(a)) return err.textContent='La contraseña actual no es correcta'; if(b.length<6||!/[a-z]/.test(b)||!/\d/.test(b)) return err.textContent='Mínimo 6 caracteres, un número y una minúscula';
  m.passHash=pwHash(b); save(true); closeOverlay(); toast('🔒 Contraseña actualizada'); };
A.rules=()=>showSheet(`<div style="padding:0 18px 10px" class="stack small">${[['🤝','Respeto ante todo','Critica la obra, no a la persona. El feedback debe ser constructivo.'],['✍️','Da crédito siempre','Si colaboras, registra a todos en Créditos. Nada de apropiarse del trabajo ajeno.'],['©️','Respeta los derechos de autor','Publica solo contenido propio o con permiso. El plagio se retira.'],['🔞','Etiqueta el contenido sensible','Marca como +18 cualquier contenido sexual o violencia gráfica.'],['🚫','Cero acoso y spam','El acoso, discurso de odio y la publicidad no solicitada están prohibidos.'],['🛡️','Reporta lo que veas mal','Usa “Reportar”: la moderación combina detección automática y revisión humana.']].map(([e,t,d])=>`<div class="row" style="align-items:flex-start"><span style="font-size:24px">${e}</span><div><b>${t}</b><div class="muted">${d}</div></div></div>`).join('')}</div>`,'Normas de la comunidad');
A.exportData=()=>{ const m=me(); const data={perfil:{...m,passHash:undefined},obras:S.works.filter(w=>w.author===m.username),guardados:S.saved[m.username]||[],comunidades:S.joined[m.username]||[],historial:S.history[m.username]||{}};
  const json=JSON.stringify(data,null,2);
  navigator.clipboard.writeText(json).then(()=>toast('📋 Tus datos (JSON) se copiaron al portapapeles')).catch(()=>shareText('Mis datos de CHOGGUN',json)); };
A.resetAll=()=>showDialog({title:'¿Restablecer todo?',text:'Se borrarán las cuentas, publicaciones y ajustes guardados en este dispositivo y se cargarán los datos de demostración.',ok:'Restablecer',danger:true,onOk:()=>{ try{ localStorage.removeItem(KEY); }catch(e){} S=defaultState(); S.settings.onboarded=true; save(true); stack=[{name:'auth',params:{mode:'login',first:true}}]; render(); toast('Datos restablecidos'); }});
A.logout=()=>showDialog({title:'¿Cerrar sesión?',text:'Podrás volver a entrar cuando quieras.',ok:'Cerrar sesión',danger:true,onOk:()=>{ S.session=null; save(true); stack=[{name:'auth',params:{mode:'login',first:true}}]; render(); toast('👋 Sesión cerrada'); }});

/* ======================= REPORTES / MODERACIÓN ======================= */
function reportTarget(r){
  if(r.kind==='work'){ const w=work(r.id); return w?`${FORMATS[w.type].emoji} “${esc(w.title)}” de ${esc(user(w.author).name)}`:'Obra eliminada'; }
  if(r.kind==='comment'){ const w=work(r.parent); let c=null; if(w){ for(const x of w.comments){ if(x.id===r.id) c=x; for(const y of (x.replies||[])) if(y.id===r.id) c=y; } } return c?`💬 Comentario de ${esc(user(c.user).name)}: “${esc(c.text.slice(0,80))}”`:'Comentario eliminado'; }
  return `👤 Usuario @${esc(r.id)}`;
}
SCREENS.reports={ render(p){
  const mod=p.mode==='mod'; const list=mod?S.reports:S.reports.filter(r=>r.by===S.session);
  const st={pendiente:['Pendiente',''],retirado:['Contenido retirado','red'],descartado:['Descartado','gray']};
  return `${topbar({title:mod?'Moderación':'Mis reportes'})}<div class="scroll"><div class="pad">${mod?`<div class="mod-flag" style="margin-bottom:14px;background:rgba(155,124,240,.1);border-color:rgba(155,124,240,.3);color:var(--purple)">${icon('shield')}<span>Panel de revisión humana. Los reportes llegan de la comunidad y del filtro automático de lenguaje (simulación de Perspective API).</span></div>`:''}
  ${list.length?list.map(r=>`<div class="card" style="padding:14px;margin-bottom:10px"><div class="row between"><span class="tag ${st[r.status][1]}">${st[r.status][0]}</span><span class="tiny faint">${timeAgo(r.t)}</span></div><p style="margin:8px 0 4px;font-weight:700">${reportTarget(r)}</p><div class="small muted">Motivo: ${esc(r.reason)}${r.note&&r.by!=='sistema'?` · “${esc(r.note)}”`:''}</div><div class="tiny faint" style="margin-top:3px">Reportado por: ${r.by==='sistema'?'🤖 Detección automática':esc(r.by===S.session?'ti':'@'+r.by)}</div>
  ${mod&&r.status==='pendiente'?`<div class="row" style="margin-top:10px"><button class="btn btn-sm btn-red grow" data-a="modAct" data-id="${r.rid}" data-v="retirado">${icon('ban')} Retirar</button><button class="btn btn-sm btn-ghost grow" data-a="modAct" data-id="${r.rid}" data-v="descartado">${icon('check')} Descartar</button>${r.kind==='work'?`<button class="btn btn-sm btn-ghost" data-a="open" data-id="${r.id}">${icon('eye')}</button>`:''}</div>`:''}</div>`).join(''):emptyHTML('🛡️',mod?'Sin reportes pendientes':'No has enviado reportes','Gracias por ayudar a mantener CHOGGUN como un espacio seguro.')}</div></div>`; } };
A.modAct=el=>{ const r=S.reports.find(x=>x.rid===el.dataset.id); r.status=el.dataset.v;
  if(r.status==='retirado'){ if(r.kind==='work'){ const w=work(r.id); if(w){ w.removed=true; notify(w.author,{type:'mod',text:`Moderación retiró “${esc(w.title)}” por: ${esc(r.reason)}`}); } }
    if(r.kind==='comment'){ const w=work(r.parent); if(w) w.comments.forEach(c=>{ if(c.id===r.id) c.removed=true; (c.replies||[]).forEach(y=>{ if(y.id===r.id) y.removed=true; }); }); } }
  S.reports.filter(x=>x.rid!==r.rid&&x.kind===r.kind&&x.id===r.id&&x.status==='pendiente').forEach(x=>x.status=r.status);
  if(r.by&&r.by!=='sistema') notify(r.by,{type:'mod',text:`Tu reporte fue revisado: <b>${r.status==='retirado'?'contenido retirado':'sin infracción'}</b>. ¡Gracias!`,link:{s:'reports',mode:'mine'}});
  save(); refresh(); toast(r.status==='retirado'?'Contenido retirado':'Reporte descartado'); };

/* ======================= EVENTOS GLOBALES ======================= */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-a]'); if(!el) return;
  const a=el.dataset.a; if(a==='overlayBg' && e.target!==el) return;
  if(A[a]){ e.preventDefault(); e.stopPropagation(); try{ A[a](el,e); }catch(err){ console.error(err); toast('Ups, algo salió mal'); } }
});
document.addEventListener('submit',e=>{ const f=e.target.closest('[data-f]'); if(!f) return; e.preventDefault(); if(F[f.dataset.f]) F[f.dataset.f](f); });
document.addEventListener('input',e=>{ if(e.target.matches('.composer textarea')){ const t=e.target; t.style.height='auto'; t.style.height=Math.min(110,t.scrollHeight)+'px'; } });

function handleBack(){ return back(); }
window.addEventListener('popstate',()=>{ const handled=handleBack(); if(handled) history.pushState({c:1},''); });

/* ======================= INICIO ======================= */
function boot(){
  load(); applyTheme();
  matchMedia('(prefers-color-scheme: light)').addEventListener?.('change',()=>{ if(S.settings.theme==='system') applyTheme(); });
  if(!S.settings.onboarded) stack=[{name:'onboarding',params:{i:0}}];
  else if(!S.session) stack=[{name:'auth',params:{mode:'login',first:true}}];
  else stack=[{name:'home',params:{}}];
  render();
  try{ history.pushState({c:1},''); }catch(e){}
  const sp=$('#splash'); setTimeout(()=>{ sp.style.opacity='0'; setTimeout(()=>sp.remove(),400); },1300);
  try{ window.Capacitor?.Plugins?.SplashScreen?.hide(); }catch(e){}
  try{ const App=window.Capacitor?.Plugins?.App; if(App) App.addListener('backButton',()=>{ if(!handleBack()) App.exitApp(); }); }catch(e){}
  window.addEventListener('beforeunload',()=>save(true));
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) save(true); });
}
boot();
