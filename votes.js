// Voting backend. Modes: 'supabase' (public, everyone) -> 'claude' (signed-in Claude viewers) -> 'local' (this device only)
const Votes=(()=>{let mode='local',counts={},mine=new Set(),cb=()=>{},uid,db;const MAX=5;
const H=()=>({apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'});
const vid=()=>{let v=LS('dgh-vid');if(!v){v=(crypto.randomUUID?crypto.randomUUID():String(Math.random()).slice(2)+Date.now());LS('dgh-vid',v)}return v};
function tally(rows){const c={},m=new Set();rows.forEach(r=>{c[r.g]=(c[r.g]||0)+1;if(r.u==uid)m.add(r.g)});counts=c;mine=m;cb()}
async function pull(){try{const r=await fetch(SUPABASE_URL+'/rest/v1/votes?select=game_id,voter',{headers:H()});tally((await r.json()).map(x=>({g:x.game_id,u:x.voter})))}catch(e){}}
async function init(f){cb=f;uid=vid();
if(typeof SUPABASE_URL!=='undefined'&&SUPABASE_URL){mode='supabase';pull();setInterval(pull,15000);return}
try{if(window.claude){const d=await claude.use('db'),u=await claude.use('user');if(d&&u){db=d;uid=String(await u.id());mode='claude';
d.collection('votes').onSnapshot(s=>{const rows=[];s.docs.forEach(x=>(x.data().g||[]).forEach(g=>rows.push({g,u:x.id})));tally(rows)},()=>{});return}}}catch(e){}
mode='local';mine=new Set(LS('dgh-votes')||[]);mine.forEach(g=>counts[g]=1);cb()}
async function toggle(g){const on=!mine.has(g);if(on&&mine.size>=MAX)return false;
on?mine.add(g):mine.delete(g);counts[g]=Math.max(0,(counts[g]||0)+(on?1:-1));cb();
try{if(mode=='supabase'){if(on)await fetch(SUPABASE_URL+'/rest/v1/votes',{method:'POST',headers:{...H(),Prefer:'resolution=ignore-duplicates'},body:JSON.stringify({game_id:g,voter:uid})});
else await fetch(`${SUPABASE_URL}/rest/v1/votes?game_id=eq.${encodeURIComponent(g)}&voter=eq.${encodeURIComponent(uid)}`,{method:'DELETE',headers:H()})}
else if(mode=='claude')await db.collection('votes').doc(uid).set({g:[...mine]});
else LS('dgh-votes',[...mine])}catch(e){}return true}
return{init,toggle,MAX,get counts(){return counts},get mine(){return mine},get mode(){return mode}}})();
