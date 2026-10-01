// Chill procedural background music (Web Audio, no audio file needed)
const Music=(()=>{let ctx,master,timer,step=0,next=0,playing=false;
const chords=[[48,55,59,64],[45,52,57,60],[41,48,52,57],[43,50,55,59]],pat=[0,2,1,3,2,3,1,2],S=.45;
const hz=m=>440*2**((m-69)/12);
function note(m,t,d,type,v){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=hz(m);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.05)}
function sched(){while(next<ctx.currentTime+.6){const c=chords[Math.floor(step/8)%4],i=step%8;
if(i==0)c.forEach(m=>note(m,next,S*8,'sine',.05));
note(c[pat[i]]+12,next,1.3,'triangle',.07);
if(i%4==2)note(c[3]+24,next,.9,'sine',.025);
step++;next+=S}}
function start(){if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1800;
const dl=ctx.createDelay();dl.delayTime.value=S*.75;const fb=ctx.createGain();fb.gain.value=.38;dl.connect(fb);fb.connect(dl);
master.connect(lp);lp.connect(ctx.destination);lp.connect(dl);dl.connect(ctx.destination);master.gain.value=0}
ctx.resume();next=ctx.currentTime+.1;master.gain.cancelScheduledValues(0);master.gain.linearRampToValueAtTime(.55,ctx.currentTime+2);
clearInterval(timer);timer=setInterval(sched,150);playing=true}
function stop(){if(!ctx)return;master.gain.linearRampToValueAtTime(0,ctx.currentTime+.6);clearInterval(timer);setTimeout(()=>{if(!playing)ctx.suspend()},800);playing=false}
return{start,stop,get playing(){return playing}}})();
