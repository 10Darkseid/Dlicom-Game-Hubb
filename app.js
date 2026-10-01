const $=i=>document.getElementById(i),LS=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let bm=new Set(LS('dgh-bm')||[]),mode='all',cur=null,unsub=null,db=null;
const letter=g=>/[A-Z]/i.test(g.t[0])?g.t[0].toUpperCase():'#';
$('az').innerHTML=[...new Set(GAMES.map(letter))].map(l=>`<a href="#L-${l}">${l}</a>`).join('');
function stats(){$('s1').textContent=GAMES.length;$('s2').textContent=new Set(GAMES.map(g=>g.a.toLowerCase())).size;$('s3').textContent=bm.size}
function card(g,i){return `<article class="card" style="animation-delay:${Math.min(i,12)*40}ms"><div class="top"><div class="ic"><i></i></div><div><h3>${esc(g.t)}</h3><a class="by" target="_blank" rel="noopener" href="https://x.com/${g.a}">by @${esc(g.a)}</a></div></div><div class="row"><a class="pl" target="_blank" rel="noopener" href="${g.u}">▶ Play</a><button class="bm ${bm.has(g.id)?'on':''}" data-b="${g.id}" title="Bookmark">${bm.has(g.id)?'★':'☆'}</button><button data-c="${g.id}" title="Comments">💬</button></div></article>`}
function render(){const q=$('q').value.toLowerCase(),l=GAMES.filter(g=>(mode=='all'||bm.has(g.id))&&(g.t+g.a).toLowerCase().includes(q));let h='',L='';
l.forEach((g,i)=>{const c=letter(g);if(c!==L){L=c;h+=`<h2 class="ltr" id="L-${c}">${c}</h2>`}h+=card(g,i)});
$('g').innerHTML=h||`<div class="empty"><img src="mascot-pink.webp" alt=""><p>${mode=='all'?'No games match your search.':'No bookmarks yet — tap ☆ on a game you like!'}</p></div>`;$('az').style.display=mode=='all'&&!q?'':'none';stats()}
$('g').onclick=e=>{const b=e.target.closest('[data-b]'),c=e.target.closest('[data-c]');
if(b){const i=b.dataset.b;bm.has(i)?bm.delete(i):bm.add(i);LS('dgh-bm',[...bm]);render()}if(c)openC(c.dataset.c)};
$('q').oninput=render;
$('all').onclick=()=>{mode='all';$('all').classList.add('on');$('sv').classList.remove('on');render()};
$('sv').onclick=()=>{mode='sv';$('sv').classList.add('on');$('all').classList.remove('on');render()};
function show(l){$('cl').innerHTML=l.length?l.sort((a,b)=>a.ts-b.ts).map(c=>`<div class="c"><small>${esc(c.n||'Player')} · ${new Date(c.ts).toLocaleDateString()}</small>${esc(c.t)}</div>`).join(''):'<p style="color:var(--mu)">No comments yet. Be the first!</p>';$('cl').scrollTop=1e5}
const local=id=>LS('dgh-c-'+id)||[];
function openC(id){cur=GAMES.find(g=>g.id==id);$('dt').textContent='💬 '+cur.t;$('nm').value=LS('dgh-name')||'';$('d').showModal();if(unsub){unsub();unsub=null}let ok=false;
try{if(db){unsub=db.collection('comments/'+id+'/items').onSnapshot(s=>show(s.docs.map(d=>d.data())),()=>show(local(id)));ok=true}}catch(e){}
$('nt').textContent=ok?'Comments are shared with everyone signed in.':'Comments are saved on this device only.';if(!ok)show(local(id))}
$('x').onclick=()=>{$('d').close();if(unsub){unsub();unsub=null}};
$('sd').onclick=async()=>{const t=$('tx').value.trim();if(!t)return;const n=$('nm').value.trim()||'Player';LS('dgh-name',n);const c={n,t,ts:Date.now()};let ok=false;
try{if(db){await db.doc('comments/'+cur.id+'/items/'+c.ts+Math.random().toString(36).slice(2,6)).set(c);ok=true}}catch(e){}
if(!ok){const l=local(cur.id);l.push(c);LS('dgh-c-'+cur.id,l);show(l)}$('tx').value=''};
// mascot waves every 10 seconds
const stage=document.querySelector('.stage');
function wave(){stage.classList.add('wave');setTimeout(()=>stage.classList.remove('wave'),2800)}
setTimeout(wave,2000);setInterval(wave,10000);
// music starts on first tap unless the visitor muted it
const mu=$('mu');let first=true;function setM(on){on?Music.start():Music.stop();mu.classList.toggle('play',on);LS('dgh-music',on?'on':'off')}
mu.onclick=e=>{e.stopPropagation();first=false;setM(!Music.playing)};
addEventListener('pointerdown',()=>{if(first){first=false;if(LS('dgh-music')!=='off')setM(true)}},{once:true});
render();try{window.claude&&claude.use('db').then(x=>{db=x}).catch(()=>{})}catch(e){}
