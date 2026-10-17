/* ================= CHOGGUN — núcleo ================= */
const ASSETS = { logo:'__LOGO__', gato:'__GATO__', rana:'__RANA__' };
const APP_VERSION = '1.0.0';
const KEY = 'choggun_app_v1';
let S = null;

/* ---------- utilidades ---------- */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function fmtNum(n){ n=Number(n)||0; if(Math.abs(n)>=1e6) return (n/1e6).toFixed(1).replace('.0','')+' M'; if(Math.abs(n)>=1e3) return (n/1e3).toFixed(1).replace('.0','')+' k'; return String(n); }
function timeAgo(t){
  const s=Math.max(1,Math.floor((Date.now()-t)/1000));
  if(s<60) return 'ahora'; const m=Math.floor(s/60); if(m<60) return `hace ${m} min`;
  const h=Math.floor(m/60); if(h<24) return `hace ${h} h`; const d=Math.floor(h/24); if(d<7) return `hace ${d} d`;
  return new Date(t).toLocaleDateString('es-CO',{day:'numeric',month:'short'});
}
function clock(t){ return new Date(t).toLocaleTimeString('es-CO',{hour:'numeric',minute:'2-digit'}); }
function dayLabel(t){ const d=new Date(t), n=new Date(); const y=new Date(); y.setDate(n.getDate()-1);
  if(d.toDateString()===n.toDateString()) return 'Hoy'; if(d.toDateString()===y.toDateString()) return 'Ayer';
  return d.toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'short'}); }
function pwHash(p){ return 'h'+hashStr('choggun::'+p).toString(36)+hashStr(p+'::salt').toString(36); }
function newId(p){ return p+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36); }
function wordCount(t){ return (String(t||'').trim().match(/\S+/g)||[]).length; }
function normalize(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }
function isToxic(text){ const t=' '+normalize(text)+' '; return BAD_WORDS.some(w=>t.includes(normalize(w))); }

/* ---------- estado / persistencia ---------- */
function defaultState(){
  const users={};
  USERS_SEED.forEach((u,i)=>{ users[u.username]=Object.assign({email:u.username+'@choggun.app',passHash:null,followers:[],following:[],joined:NOW0-(200+i*13)*24*H,banner:u.username,karma:300+i*137,followersBase:120+((i*389)%1900)},u); });
  return { v:1, session:null, users, works:seedWorks(), communities:COMMUNITIES_SEED.map(c=>({...c})),
    joined:{}, saved:{}, history:{}, matches:{}, chats:{}, notifs:{}, reports:[], hidden:{}, drafts:{},
    settings:{theme:'dark',cardOpacity:1,readerSize:18,readerTheme:'sepia',notifications:true,mature:false,onboarded:false} };
}
function load(){
  try{ const raw=localStorage.getItem(KEY); if(raw) S=JSON.parse(raw); }catch(e){ S=null; }
  if(!S||S.v!==1) S=defaultState();
}
let saveTimer=null;
function save(now){
  clearTimeout(saveTimer);
  const doSave=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){ toast('⚠️ Almacenamiento lleno: elimina borradores o imágenes'); } };
  if(now) doSave(); else saveTimer=setTimeout(doSave,150);
}

/* ---------- selectores ---------- */
const me = () => S.session ? S.users[S.session] : null;
const user = u => S.users[u] || {username:u,name:u,role:'Lector/a',genres:[],collab:[],followers:[],following:[]};
const work = id => S.works.find(w=>w.id===id);
const community = id => S.communities.find(c=>c.id===id) || {id,name:id,icon:'🌐',desc:'',members:0,color:'#f5b942',cat:'Otros'};
function score(w){ return (w.baseVotes||0)+Object.values(w.votes||{}).reduce((a,b)=>a+b,0); }
function myVote(w){ return S.session ? (w.votes||{})[S.session]||0 : 0; }
function commentCount(w){ return (w.comments||[]).reduce((a,c)=>a+1+(c.replies||[]).length,0); }
function isSaved(id){ return S.session && (S.saved[S.session]||[]).includes(id); }
function isJoined(cid){ return S.session && (S.joined[S.session]||[]).includes(cid); }
function isFollowing(u){ const m=me(); return m && (m.following||[]).includes(u); }
function followersCount(u){ const x=user(u); return (x.followersBase||0)+(x.followers||[]).length; }
function isHiddenForMe(w){ return w.removed || (S.session && (S.hidden[S.session]||[]).includes(w.id)); }
function visibleWorks(){ return S.works.filter(w=>w.status==='publicado' && !w.removed && (S.settings.mature || !w.mature || w.author===S.session)); }
function hot(w){ const hrs=(Date.now()-w.created)/H; return (score(w)+commentCount(w)*3+(w.views||0)/60)/Math.pow(hrs+2,1.15); }
function myNotifs(){ return S.session ? (S.notifs[S.session]||[]) : []; }
function unreadNotifs(){ return myNotifs().filter(n=>!n.read).length; }
function myChats(){ const m=S.session; if(!m) return []; return Object.entries(S.chats).filter(([k,c])=>c.owner===m).map(([k,c])=>({id:k,...c})).sort((a,b)=>(b.msgs.at(-1)?.t||0)-(a.msgs.at(-1)?.t||0)); }
function unreadChats(){ return myChats().filter(c=>c.unread).length; }
function chatId(other){ return S.session+'__'+other; }
function karmaOf(u){ const x=user(u); return (x.karma||0)+S.works.filter(w=>w.author===u).reduce((a,w)=>a+Object.values(w.votes||{}).reduce((p,q)=>p+q,0),0); }

/* ---------- componentes ---------- */
function avatarHTML(u, cls=''){
  const x=typeof u==='string'?user(u):u; const a=x.avatar;
  if(a && ASSETS[a]) return `<img class="avatar ${cls}" src="${ASSETS[a]}" alt="">`;
  if(a && a.startsWith('data:')) return `<img class="avatar ${cls}" src="${a}" alt="">`;
  return `<div class="avatar ${cls}">${initialsAvatar(x.name||x.username, x.username)}</div>`;
}
function coverHTML(w){
  if(w.cover) return `<img src="${w.cover}" alt="">`;
  if(w.type==='ilustracion') return artHTML(w);
  return coverSVG({...w, authorName:user(w.author).name});
}
function artHTML(w){
  if(w.image && w.image.data) return `<img src="${w.image.data}" alt="${esc(w.title)}">`;
  return illustrationSVG((w.image&&w.image.gen)||w.id, w.title);
}
function fmtTag(type){ const f=FORMATS[type]||FORMATS.foro; return `<span class="tag ${f.cls}">${f.emoji} ${f.label}</span>`; }
function nameHTML(u){ const x=user(u); return `${esc(x.name)}${x.official?' <span class="gold" title="Oficial">✔</span>':''}`; }
function voteHTML(w){
  const v=myVote(w);
  return `<div class="vote ${v>0?'up':v<0?'down':''}"><button class="v-up" data-a="vote" data-id="${w.id}" data-dir="1" aria-label="Votar a favor">${icon('up','stroke-width="2.8"')}</button><b>${fmtNum(score(w))}</b><button class="v-down" data-a="vote" data-id="${w.id}" data-dir="-1" aria-label="Votar en contra">${icon('down','stroke-width="2.8"')}</button></div>`;
}
function topbar({title='',back=true,actions='',brand=false}={}){
  return `<header class="topbar">${back?`<button class="icon-btn" data-a="back" aria-label="Atrás">${icon('back')}</button>`:''}${brand?`<div class="brand"><img src="${ASSETS.logo}" alt=""><span>CHOGGUN</span></div>`:`<div class="title">${title}</div>`}${actions}</header>`;
}
function emptyHTML(emoji,title,text,btn=''){ return `<div class="empty"><div class="e">${emoji}</div><div class="h3">${title}</div><div class="small">${text}</div>${btn}</div>`; }

function postCard(w){
  if(isHiddenForMe(w)) return `<div class="card post hidden-post">${icon('eyeOff','width="20" height="20"')}<span class="grow">${w.removed?'Contenido retirado por moderación.':'Ocultaste esta publicación.'}</span>${w.removed?'':`<button class="link small" data-a="unhide" data-id="${w.id}">Mostrar</button>`}</div>`;
  const a=user(w.author); const c=community(w.community); const f=FORMATS[w.type]||FORMATS.foro;
  let body='';
  if(w.type==='foro'){
    body=`<div class="post-wide" data-a="open" data-id="${w.id}">${w.pinned?'<span class="tag" style="margin-bottom:6px">📌 Fijado</span> ':''}${fmtTag('foro')}<div class="h3" style="margin:7px 0 4px">${esc(w.title)}</div><p class="muted clamp3" style="font-size:14.5px">${esc(w.synopsis)}</p></div>`;
  }else if(w.type==='ilustracion'){
    body=`<div class="post-wide" data-a="open" data-id="${w.id}"><div class="art">${artHTML(w)}</div><div class="row" style="margin-top:9px">${fmtTag('ilustracion')}${w.mature?'<span class="tag red">+18</span>':''}</div><div class="h3" style="margin:6px 0 2px">${esc(w.title)}</div><p class="muted clamp2" style="font-size:14.5px">${esc(w.synopsis)}</p></div>`;
  }else{
    const nch=(w.chapters||[]).length;
    body=`<div class="post-cover" data-a="open" data-id="${w.id}"><div class="cover">${coverHTML(w)}</div><div class="post-body"><div class="row wrap" style="gap:6px">${fmtTag(w.type)}${w.mature?'<span class="tag red">+18</span>':''}</div><div class="h3">${esc(w.title)}</div><p class="clamp3">${esc(w.synopsis)}</p><div class="tiny faint" style="margin-top:6px">${(w.genres||[]).slice(0,3).map(esc).join(' · ')}</div><div class="tiny muted" style="margin-top:3px">${icon('book','width="12" height="12" style="display:inline;vertical-align:-1px"')} ${nch} ${w.type==='manga'||w.type==='comic'?(nch===1?'capítulo':'capítulos'):(nch===1?'capítulo':'capítulos')} · ${fmtNum(w.views)} lecturas</div></div></div>`;
  }
  const credits=(w.credits||[]).length?`<div class="av-stack" title="Colaboradores">${[w.author,...w.credits.map(c=>c.user)].slice(0,3).map(u=>avatarHTML(u,'av-xs')).join('')}</div>`:'';
  return `<article class="card post">
    <div class="post-head">${avatarHTML(a,'av-sm')}<div class="who" data-a="user" data-u="${a.username}"><b>${nameHTML(a.username)}</b><div>en <span class="gold" data-a="comm" data-id="${c.id}">c/${esc(c.id)}</span> · ${timeAgo(w.created)}</div></div><button class="icon-btn" data-a="postMenu" data-id="${w.id}" aria-label="Más opciones">${icon('more')}</button></div>
    ${body}
    <div class="post-actions">${voteHTML(w)}<button class="pa" data-a="open" data-id="${w.id}" data-focus="comments">${icon('comment')}${fmtNum(commentCount(w))}</button><button class="pa ${isSaved(w.id)?'on':''}" data-a="save" data-id="${w.id}" aria-label="Guardar">${icon('bookmark',isSaved(w.id)?'fill="currentColor"':'')}</button><button class="pa" data-a="share" data-id="${w.id}" aria-label="Compartir">${icon('share')}</button><span class="spacer"></span>${credits}</div>
  </article>`;
}

/* ---------- navegación ---------- */
let stack=[{name:'home',params:{}}];
let navAnim=true;
const SCREENS={};
const TAB_SCREENS=['home','explore','match','profile'];
function current(){ return stack[stack.length-1]; }
function saveScroll(){ const sc=$('#view .scroll'); if(sc) current().scroll=sc.scrollTop; }
function go(name,params={}){ closeOverlay(true); saveScroll(); stack.push({name,params}); navAnim=true; render(); }
function replace(name,params={}){ closeOverlay(true); stack[stack.length-1]={name,params}; navAnim=true; render(); }
function setTab(name){ closeOverlay(true); if(current().name===name && stack.length===1){ const sc=$('#view .scroll'); if(sc) sc.scrollTo({top:0,behavior:'smooth'}); return; } stack=[{name,params:{}}]; navAnim=false; render(); }
function back(){
  if(overlayOpen()){ closeOverlay(); return true; }
  if(stack.length>1){ stack.pop(); navAnim=false; render(); return true; }
  if(current().name!=='home' && S.session!==undefined && TAB_SCREENS.includes(current().name)){ setTab('home'); return true; }
  return false;
}
function refresh(){ saveScroll(); navAnim=false; render(); }

function render(){
  const cur=current(); const scr=SCREENS[cur.name]; if(!scr){ stack=[{name:'home',params:{}}]; return render(); }
  applyTheme();
  const view=$('#view');
  let html=scr.render(cur.params||{});
  const isTab=TAB_SCREENS.includes(cur.name) && !scr.noNav;
  view.innerHTML=`<section class="screen ${navAnim?'':'no-anim'} ${scr.cls||''}">${html}</section>${isTab?bottomNav(cur.name):''}`;
  const sc=$('#view .scroll'); if(sc && cur.scroll) sc.scrollTop=cur.scroll;
  if(scr.after) scr.after(cur.params||{}, view);
}
function bottomNav(active){
  const m=me();
  const item=(n,ic,label)=>`<button class="nav-item ${active===n?'on':''}" data-a="tab" data-t="${n}">${ic}<span>${label}</span></button>`;
  return `<nav class="bottom-nav">${item('home',icon('home'),'Inicio')}${item('explore',icon('compass'),'Explorar')}<button class="nav-plus" data-a="create" aria-label="Publicar"><span>${icon('plus')}</span></button>${item('match',icon('zap'),'Match')}${item('profile',m?avatarHTML(m):icon('user'),'Perfil')}</nav>`;
}
function applyTheme(){
  let t=S.settings.theme; if(t==='system') t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  document.documentElement.setAttribute('data-theme',t);
  document.documentElement.style.setProperty('--card-opacity',S.settings.cardOpacity);
  const mc=$('meta[name=theme-color]'); if(mc) mc.content=t==='light'?'#fbf7ee':'#0b1720';
  try{ const SB=window.Capacitor?.Plugins?.StatusBar; if(SB){ SB.setStyle({style:t==='light'?'LIGHT':'DARK'}); SB.setBackgroundColor?.({color:t==='light'?'#fbf7ee':'#0b1720'}); } }catch(e){}
}

/* ---------- overlays ---------- */
function overlayOpen(){ return !!$('#overlay .overlay'); }
function closeOverlay(instant){ const o=$('#overlay'); if(o) o.innerHTML=''; }
function showSheet(inner,title=''){ $('#overlay').innerHTML=`<div class="overlay" data-a="overlayBg"><div class="sheet" role="dialog"><div class="grab"></div>${title?`<div class="sheet-title">${title}</div>`:''}${inner}</div></div>`; }
function showDialog({title,text='',ok='Aceptar',cancel='Cancelar',danger=false,onOk,html=''}){
  dialogOk=onOk;
  $('#overlay').innerHTML=`<div class="overlay center" data-a="overlayBg"><div class="dialog" role="alertdialog"><div class="h2">${title}</div>${text?`<p>${text}</p>`:''}${html}<div class="row">${cancel?`<button class="btn btn-ghost btn-sm" data-a="closeOverlay">${cancel}</button>`:''}<button class="btn ${danger?'btn-red':'btn-primary'} btn-sm" data-a="dialogOk">${ok}</button></div></div></div>`;
}
let dialogOk=null;
let toastTimer=null;
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2600); }
function requireAuth(what){
  if(S.session) return true;
  showDialog({title:'Únete a CHOGGUN',text:`Inicia sesión o crea una cuenta para ${what}.`,ok:'Iniciar sesión',cancel:'Ahora no',onOk:()=>go('auth',{mode:'login'})});
  return false;
}

/* ---------- notificaciones y simulaciones ---------- */
function notify(to,{type='system',text,link=null,from=null}){
  if(!to) return; if(!S.notifs[to]) S.notifs[to]=[];
  S.notifs[to].unshift({id:newId('n'),type,text,link,from,t:Date.now(),read:false});
  S.notifs[to]=S.notifs[to].slice(0,80); save();
  if(to===S.session){ updateBadges(); if(S.settings.notifications) toast('🔔 '+text.replace(/<[^>]+>/g,'')); }
}
function updateBadges(){
  const n=unreadNotifs(), c=unreadChats();
  $$('[data-badge=notifs]').forEach(b=>{ b.textContent=n; b.style.display=n?'grid':'none'; });
  $$('[data-badge=chats]').forEach(b=>{ b.textContent=c; b.style.display=c?'grid':'none'; });
}
function later(ms,fn){ setTimeout(()=>{ try{ fn(); }catch(e){ console.error(e); } },ms); }
function randomFan(exclude=[]){ const pool=USERS_SEED.filter(u=>!u.official && !exclude.includes(u.username)); return pool[Math.floor(Math.random()*pool.length)].username; }

/* ---------- imágenes ---------- */
function pickImages({multiple=false,max=1000,quality=.82}={}){
  return new Promise(resolve=>{
    const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; if(multiple) inp.multiple=true;
    inp.onchange=async()=>{ const files=[...inp.files]; const out=[]; for(const f of files){ try{ out.push(await resizeImage(f,max,quality)); }catch(e){ toast('No se pudo leer una imagen'); } } resolve(out); };
    inp.click();
  });
}
function resizeImage(file,max,quality){
  return new Promise((res,rej)=>{
    const fr=new FileReader(); fr.onerror=rej;
    fr.onload=()=>{ const img=new Image(); img.onerror=rej; img.onload=()=>{
      const k=Math.min(1,max/Math.max(img.width,img.height)); const c=document.createElement('canvas');
      c.width=Math.round(img.width*k); c.height=Math.round(img.height*k);
      const ctx=c.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,c.width,c.height); ctx.drawImage(img,0,0,c.width,c.height);
      res(c.toDataURL('image/jpeg',quality)); }; img.src=fr.result; };
    fr.readAsDataURL(file);
  });
}

/* ---------- compartir ---------- */
async function shareText(title,text){
  const full=`${title}\n${text}\n— Léelo en CHOGGUN`;
  try{ const SP=window.Capacitor?.Plugins?.Share; if(SP){ await SP.share({title,text:full,dialogTitle:'Compartir'}); return; } }catch(e){}
  try{ if(navigator.share){ await navigator.share({title,text:full}); return; } }catch(e){ if(e&&e.name==='AbortError') return; }
  try{ await navigator.clipboard.writeText(full); toast('📋 Copiado al portapapeles'); }catch(e){ toast('No se pudo compartir'); }
}
