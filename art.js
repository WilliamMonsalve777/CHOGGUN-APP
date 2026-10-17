/* ================= Iconos + arte generado ================= */
const ICONS = {
  home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  compass:'<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  userPlus:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  comment:'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  back:'<path d="m15 18-6-6 6-6"/>',
  chevR:'<path d="m9 18 6-6-6-6"/>',
  up:'<path d="m18 15-6-6-6 6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  more:'<circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/><circle cx="5" cy="12" r="1.3" fill="currentColor"/>',
  bookmark:'<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="M2 2l20 20"/>',
  book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  image:'<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  edit:'<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.38 2.62a2.12 2.12 0 1 1 3 3L12 15l-4 1 1-4Z"/>',
  gear:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  trash:'<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  filter:'<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  star:'<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  sparkles:'<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  at:'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  type:'<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  copy:'<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  undo:'<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
  pin:'<path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  palette:'<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.56-2.5 5.56-5.55C21.97 6.01 17.46 2 12 2z"/>',
  layers:'<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  arrowUp:'<path d="m5 12 7-7 7 7M12 19V5"/>',
  minus:'<path d="M5 12h14"/>',
  hash:'<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
};
function icon(name, extra=''){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra} aria-hidden="true">${ICONS[name]||''}</svg>`;
}

/* ---------- utilidades aleatorias deterministas ---------- */
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=typeof seed==='number'?seed:hashStr(String(seed));return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const PALETTES=[
  ['#1f3d4a','#0b1720','#f5b942','#e04848'],['#3b1d4a','#120a1d','#ff8a5c','#ffd36e'],
  ['#0f3b3a','#061716','#7fe0c2','#f5b942'],['#4a1d1d','#160909','#ffb347','#ffe9b0'],
  ['#1d2a4a','#090f1d','#8ab4ff','#ff7aa8'],['#2d4a1d','#0c1608','#d8f07a','#ffcf5c'],
  ['#4a3b1d','#1a1208','#ffd27a','#e04848'],['#1d4a44','#08201d','#ffd166','#ef476f'],
  ['#3a1d4a','#140820','#c39bff','#5ce1e6'],['#4a1d35','#1d0914','#ff9ecd','#ffd36e']
];
function escXml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function wrapWords(text,maxChars,maxLines){
  const words=String(text).split(/\s+/);const lines=[];let cur='';
  for(const w of words){ if((cur+' '+w).trim().length>maxChars && cur){lines.push(cur);cur=w}else cur=(cur+' '+w).trim() }
  if(cur)lines.push(cur);
  if(lines.length>maxLines){const l=lines.slice(0,maxLines);l[maxLines-1]=l[maxLines-1].replace(/.{0,2}$/,'…');return l}
  return lines;
}
let _uid=0; function uid(p='g'){return p+(++_uid)+Math.floor(Math.random()*1e5)}

/* ---------- portadas ---------- */
function coverSVG(work){
  const r=rng(work.coverSeed||work.id);
  const p=PALETTES[Math.floor(r()*PALETTES.length)];
  const id=uid('c'); const motif=work.motif||['moon','city','sun','waves','forest','orbit'][Math.floor(r()*6)];
  let art='';
  if(motif==='moon'||motif==='forest'){
    art+=`<circle cx="${130+r()*30}" cy="${70+r()*30}" r="${26+r()*12}" fill="${p[2]}" opacity=".95"/>`;
    for(let i=0;i<30;i++)art+=`<circle cx="${r()*200}" cy="${r()*170}" r="${r()*1.4+.3}" fill="#fff" opacity="${r()*.8+.2}"/>`;
    let d='M0 230';for(let x=0;x<=200;x+=20)d+=` L${x} ${170+r()*50}`;d+=' L200 300 L0 300Z';
    art+=`<path d="${d}" fill="${p[1]}" opacity=".85"/>`;
    if(motif==='forest'){for(let i=0;i<14;i++){const x=r()*200,h=40+r()*50,b=250-r()*20;art+=`<path d="M${x} ${b-h} L${x-12} ${b} L${x+12} ${b}Z" fill="${p[1]}"/>`}}
    let d2='M0 260';for(let x=0;x<=200;x+=25)d2+=` L${x} ${215+r()*40}`;d2+=' L200 300 L0 300Z';
    art+=`<path d="${d2}" fill="#000" opacity=".45"/>`;
  }else if(motif==='city'){
    art+=`<circle cx="60" cy="80" r="34" fill="${p[3]}" opacity=".8"/>`;
    for(let i=0;i<12;i++){const w=14+r()*20,x=i*17-6,h=60+r()*120;art+=`<rect x="${x}" y="${260-h}" width="${w}" height="${h}" fill="${p[1]}" opacity="${.7+r()*.3}"/>`;
      for(let k=0;k<6;k++)if(r()>.5)art+=`<rect x="${x+3+r()*(w-6)}" y="${260-h+8+r()*(h-16)}" width="2.5" height="3.5" fill="${p[2]}" opacity=".9"/>`}
    art+=`<rect y="255" width="200" height="45" fill="#000" opacity=".55"/>`;
  }else if(motif==='sun'){
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2;art+=`<path d="M100 120 L${100+Math.cos(a)*260} ${120+Math.sin(a)*260} L${100+Math.cos(a+.12)*260} ${120+Math.sin(a+.12)*260}Z" fill="${p[2]}" opacity=".18"/>`}
    art+=`<circle cx="100" cy="120" r="44" fill="${p[2]}"/><circle cx="100" cy="120" r="30" fill="${p[3]}" opacity=".85"/>`;
  }else if(motif==='waves'){
    for(let i=0;i<7;i++){const y=110+i*24;art+=`<path d="M0 ${y} Q50 ${y-18-r()*10} 100 ${y} T200 ${y} V300 H0Z" fill="${i%2?p[1]:p[0]}" opacity="${.5+i*.07}"/>`}
    art+=`<circle cx="150" cy="70" r="20" fill="${p[2]}"/>`;
  }else{
    art+=`<circle cx="100" cy="125" r="40" fill="${p[2]}"/>`;
    for(let i=0;i<3;i++)art+=`<ellipse cx="100" cy="125" rx="${70+i*18}" ry="${18+i*6}" fill="none" stroke="${p[3]}" stroke-width="1.6" opacity="${.8-i*.2}" transform="rotate(${-18+i*6} 100 125)"/>`;
    for(let i=0;i<40;i++)art+=`<circle cx="${r()*200}" cy="${r()*300}" r="${r()*1.2+.3}" fill="#fff" opacity="${r()}"/>`;
  }
  const lines=wrapWords((work.title||'').toUpperCase(),13,3);
  const fs=lines.some(l=>l.length>10)?19:23; const y0=300-26-lines.length*(fs+1)-14;
  const title=lines.map((l,i)=>`<text x="14" y="${y0+i*(fs+1)}" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="900" font-size="${fs}" fill="#fff" letter-spacing="1">${escXml(l)}</text>`).join('');
  return `<svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></linearGradient></defs><rect width="200" height="300" fill="url(#${id})"/>${art}<rect width="200" height="300" fill="url(#${id}s)"/>${title}<rect x="14" y="${300-30}" width="26" height="3" fill="${p[2]}"/><text x="14" y="${300-14}" font-family="Rajdhani,sans-serif" font-weight="700" font-size="11" fill="#fff" opacity=".85">${escXml(work.authorName||'')}</text></svg>`;
}

/* ---------- avatar con iniciales ---------- */
function initialsAvatar(name,seed){
  const r=rng(seed||name); const p=PALETTES[Math.floor(r()*PALETTES.length)]; const id=uid('a');
  const ini=String(name||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p[3]}"/><stop offset="1" stop-color="${p[0]}"/></linearGradient></defs><rect width="100" height="100" fill="url(#${id})"/><circle cx="${20+r()*60}" cy="${10+r()*30}" r="${18+r()*14}" fill="#fff" opacity=".12"/><text x="50" y="50" dy=".35em" text-anchor="middle" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="900" font-size="42" fill="#fff">${escXml(ini)}</text></svg>`;
}
function bannerSVG(seed){
  const r=rng(seed+'b'); const p=PALETTES[Math.floor(r()*PALETTES.length)]; const id=uid('b');
  let s='';for(let i=0;i<6;i++)s+=`<circle cx="${r()*400}" cy="${r()*120}" r="${20+r()*70}" fill="${i%2?p[2]:p[3]}" opacity="${.12+r()*.18}"/>`;
  for(let i=0;i<25;i++)s+=`<circle cx="${r()*400}" cy="${r()*120}" r="${r()*1.3+.3}" fill="#fff" opacity="${r()}"/>`;
  return `<svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient></defs><rect width="400" height="120" fill="url(#${id})"/>${s}</svg>`;
}

/* ---------- ilustración grande generada ---------- */
function illustrationSVG(seed,title){
  const r=rng(seed); const p=PALETTES[Math.floor(r()*PALETTES.length)]; const id=uid('i');
  let s='';
  for(let i=0;i<60;i++)s+=`<circle cx="${r()*800}" cy="${r()*350}" r="${r()*1.8+.3}" fill="#fff" opacity="${r()}"/>`;
  s+=`<circle cx="${560+r()*80}" cy="${130+r()*40}" r="${70+r()*30}" fill="${p[2]}" opacity=".9"/>`;
  for(let l=0;l<4;l++){let d=`M0 ${330+l*50}`;for(let x=0;x<=800;x+=40)d+=` L${x} ${300+l*55-r()*90}`;d+=' L800 600 L0 600Z';s+=`<path d="${d}" fill="${l===3?'#000':p[1]}" opacity="${.45+l*.15}"/>`}
  // guardianes (siluetas)
  for(let g=0;g<3;g++){const x=230+g*150+r()*30,y=470-g*8,h=120+r()*40;
    s+=`<g transform="translate(${x} ${y})" fill="#05080b"><path d="M-22 0 L-16 ${-h*.62} Q0 ${-h*.72} 16 ${-h*.62} L22 0Z"/><circle cx="0" cy="${-h*.75}" r="${h*.11}"/><path d="M${-h*.13} ${-h*.82} L${-h*.2} ${-h*1.02} L${-h*.04} ${-h*.86}Z M${h*.13} ${-h*.82} L${h*.2} ${-h*1.02} L${h*.04} ${-h*.86}Z"/><rect x="26" y="${-h*.95}" width="4" height="${h*.95}" transform="rotate(8)"/></g>`}
  s+=`<rect width="800" height="600" fill="url(#${id}v)"/>`;
  return `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[3]}"/></linearGradient><radialGradient id="${id}v" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs><rect width="800" height="600" fill="url(#${id})"/>${s}</svg>`;
}

/* ---------- páginas de manga / cómic generadas ---------- */
const PANEL_LAYOUTS=[
  [[20,20,560,300],[20,340,270,260],[310,340,270,260],[20,620,560,260]],
  [[20,20,270,420],[310,20,270,200],[310,240,270,200],[20,460,560,420]],
  [[20,20,560,260],[20,300,560,280],[20,600,270,280],[310,600,270,280]],
];
function sceneSVG(scene,x,y,w,h,r,color){
  const ink='#111'; let s='';
  const c=color?PALETTES[Math.floor(r()*PALETTES.length)]:['#e8e8e8','#bdbdbd','#777','#333'];
  const bg=color?c[0]:'#f4f4f4';
  s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>`;
  if(scene==='city'){
    s+=`<circle cx="${x+w*.75}" cy="${y+h*.25}" r="${Math.min(w,h)*.12}" fill="${color?c[2]:'#fff'}" stroke="${ink}" stroke-width="2"/>`;
    for(let i=0;i<10;i++){const bw=w/10+r()*15,bx=x+i*w/10,bh=h*(.3+r()*.5);s+=`<rect x="${bx}" y="${y+h-bh}" width="${bw}" height="${bh}" fill="${color?c[1]:c[2+(i%2)]}" stroke="${ink}" stroke-width="2"/>`;
      for(let k=0;k<4;k++)s+=`<rect x="${bx+5+r()*(bw-12)}" y="${y+h-bh+8+r()*(bh-20)}" width="5" height="7" fill="${color?c[2]:'#fff'}"/>`}
  }else if(scene==='face'||scene==='face2'){
    const cx=x+w/2,cy=y+h*.58,R=Math.min(w,h)*.3;
    for(let i=0;i<14;i++){const a=r()*Math.PI*2;s+=`<line x1="${cx}" y1="${cy}" x2="${cx+Math.cos(a)*w}" y2="${cy+Math.sin(a)*h}" stroke="${color?c[2]:'#ccc'}" stroke-width="${1+r()*3}" opacity=".6"/>`}
    s+=`<path d="M${cx-R*1.1} ${cy+R*1.6} Q${cx} ${cy+R*.7} ${cx+R*1.1} ${cy+R*1.6}Z" fill="${color?c[3]:'#555'}" stroke="${ink}" stroke-width="2.5"/>`;
    s+=`<ellipse cx="${cx}" cy="${cy}" rx="${R*.8}" ry="${R}" fill="${color?'#ffe0c2':'#fff'}" stroke="${ink}" stroke-width="3"/>`;
    let hair=`M${cx-R*.95} ${cy-R*.2}`;for(let i=0;i<=8;i++){hair+=` L${cx-R*.95+i*R*1.9/8} ${cy-R*(i%2?1.55:1.05)}`}hair+=` L${cx+R*.95} ${cy-R*.2} Q${cx} ${cy-R*.75} ${cx-R*.95} ${cy-R*.2}Z`;
    s+=`<path d="${hair}" fill="${color?c[1]:'#222'}" stroke="${ink}" stroke-width="2.5"/>`;
    const ey=cy-R*.05, angry=scene==='face2';
    s+=`<ellipse cx="${cx-R*.32}" cy="${ey}" rx="${R*.14}" ry="${R*.2}" fill="${ink}"/><ellipse cx="${cx+R*.32}" cy="${ey}" rx="${R*.14}" ry="${R*.2}" fill="${ink}"/><circle cx="${cx-R*.28}" cy="${ey-R*.07}" r="${R*.05}" fill="#fff"/><circle cx="${cx+R*.36}" cy="${ey-R*.07}" r="${R*.05}" fill="#fff"/>`;
    s+=angry?`<path d="M${cx-R*.5} ${ey-R*.35} L${cx-R*.15} ${ey-R*.22} M${cx+R*.5} ${ey-R*.35} L${cx+R*.15} ${ey-R*.22}" stroke="${ink}" stroke-width="4"/><path d="M${cx-R*.2} ${cy+R*.5} L${cx+R*.2} ${cy+R*.5}" stroke="${ink}" stroke-width="3"/>`
      :`<path d="M${cx-R*.22} ${cy+R*.45} Q${cx} ${cy+R*.62} ${cx+R*.22} ${cy+R*.45}" stroke="${ink}" stroke-width="3" fill="none"/>`;
  }else if(scene==='action'){
    for(let i=0;i<40;i++){const a=i/40*Math.PI*2,len=Math.max(w,h);s+=`<path d="M${x+w/2+Math.cos(a)*30} ${y+h/2+Math.sin(a)*30} L${x+w/2+Math.cos(a)*len} ${y+h/2+Math.sin(a)*len} L${x+w/2+Math.cos(a+.05)*len} ${y+h/2+Math.sin(a+.05)*len}Z" fill="${color?c[3]:ink}" opacity="${.5+r()*.5}"/>`}
    s+=`<path d="M${x+w*.2} ${y+h*.8} L${x+w*.82} ${y+h*.2}" stroke="${color?c[2]:'#fff'}" stroke-width="10" stroke-linecap="round"/><path d="M${x+w*.2} ${y+h*.8} L${x+w*.82} ${y+h*.2}" stroke="${ink}" stroke-width="3"/>`;
  }else if(scene==='rain'){
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color?c[1]:'#9a9a9a'}"/>`;
    for(let i=0;i<70;i++){const rx=x+r()*w,ry=y+r()*h;s+=`<line x1="${rx}" y1="${ry}" x2="${rx-10}" y2="${ry+28}" stroke="#fff" stroke-width="1.5" opacity=".7"/>`}
    s+=`<path d="M${x+w*.45} ${y+h} L${x+w*.45} ${y+h*.45} M${x+w*.3} ${y+h*.5} Q${x+w*.45} ${y+h*.25} ${x+w*.6} ${y+h*.5}Z" stroke="${ink}" stroke-width="4" fill="${color?c[3]:'#333'}"/>`;
  }else if(scene==='cafe'){
    s+=`<rect x="${x}" y="${y+h*.7}" width="${w}" height="${h*.3}" fill="${color?c[1]:'#ccc'}"/>`;
    const cx=x+w/2,cy=y+h*.62;
    s+=`<path d="M${cx-50} ${cy-40} L${cx+50} ${cy-40} L${cx+40} ${cy+40} L${cx-40} ${cy+40}Z" fill="${color?c[2]:'#fff'}" stroke="${ink}" stroke-width="3"/><path d="M${cx+48} ${cy-25} q30 10 0 40" stroke="${ink}" stroke-width="3" fill="none"/>`;
    for(let i=0;i<3;i++)s+=`<path d="M${cx-20+i*20} ${cy-50} q-10 -20 0 -40 q10 -20 0 -40" stroke="${color?'#fff':'#888'}" stroke-width="3" fill="none" opacity=".8"/>`;
    for(let i=0;i<20;i++)s+=`<circle cx="${x+r()*w}" cy="${y+r()*h*.5}" r="${r()*2+.5}" fill="${color?'#fff':'#999'}"/>`;
  }else{ // space / mountain
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color?c[1]:'#2a2a2a'}"/>`;
    for(let i=0;i<50;i++)s+=`<circle cx="${x+r()*w}" cy="${y+r()*h}" r="${r()*2}" fill="#fff"/>`;
    s+=`<circle cx="${x+w*.3}" cy="${y+h*.4}" r="${Math.min(w,h)*.22}" fill="${color?c[2]:'#ddd'}" stroke="${ink}" stroke-width="3"/>`;
    let d=`M${x} ${y+h}`;for(let i=0;i<=8;i++)d+=` L${x+i*w/8} ${y+h*(.65+r()*.25)}`;d+=` L${x+w} ${y+h}Z`;s+=`<path d="${d}" fill="${ink}"/>`;
  }
  return s;
}
function bubbleSVG(text,x,y,w,h,r,shout){
  if(!text)return '';
  const lines=wrapWords(text,shout?12:20,4); const lh=shout?30:22, fs=shout?26:18;
  const bw=Math.min(w-30,Math.max(...lines.map(l=>l.length))*(shout?15:10)+36), bh=lines.length*lh+26;
  const bx=x+(r()>.5?14:w-bw-14), by=y+12;
  let shape;
  if(shout){let d='';const n=16;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,rr=i%2?1:1.18;d+=(i?'L':'M')+(bx+bw/2+Math.cos(a)*bw/2*rr)+' '+(by+bh/2+Math.sin(a)*bh/2*rr)}shape=`<path d="${d}Z" fill="#fff" stroke="#111" stroke-width="3"/>`}
  else shape=`<ellipse cx="${bx+bw/2}" cy="${by+bh/2}" rx="${bw/2+6}" ry="${bh/2+4}" fill="#fff" stroke="#111" stroke-width="2.5"/><path d="M${bx+bw*.45} ${by+bh} L${bx+bw*.38} ${by+bh+22} L${bx+bw*.6} ${by+bh-2}" fill="#fff" stroke="#111" stroke-width="2.5"/><rect x="${bx+bw*.43}" y="${by+bh-6}" width="${bw*.17}" height="7" fill="#fff"/>`;
  const t=lines.map((l,i)=>`<text x="${bx+bw/2}" y="${by+20+lh*.6+i*lh}" text-anchor="middle" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="${shout?900:700}" font-size="${fs}" fill="#111">${escXml(l)}</text>`).join('');
  return shape+t;
}
function pageSVG(page,seed,color){
  const r=rng(seed); const layout=PANEL_LAYOUTS[page.layout%PANEL_LAYOUTS.length]; let s='';const clips=[];
  layout.forEach((b,i)=>{const pn=page.panels[i]; if(!pn)return; const cid=uid('p');
    clips.push(`<clipPath id="${cid}"><rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}"/></clipPath>`);
    s+=`<g clip-path="url(#${cid})">${sceneSVG(pn.scene,b[0],b[1],b[2],b[3],r,color)}${bubbleSVG(pn.text,b[0],b[1],b[2],b[3],r,pn.shout)}</g><rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" fill="none" stroke="#111" stroke-width="5"/>`;
  });
  return `<svg viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg"><defs>${clips.join('')}</defs><rect width="600" height="900" fill="#fff"/>${s}<text x="580" y="893" text-anchor="end" font-family="Rajdhani,sans-serif" font-size="12" fill="#999">CHOGGUN</text></svg>`;
}
