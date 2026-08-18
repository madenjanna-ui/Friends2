const canvas=document.getElementById("space");
const ctx=canvas.getContext("2d");
const scenes=[...document.querySelectorAll(".scene")];
const startBtn=document.getElementById("startBtn");
const skipBtn=document.getElementById("skip");
const musicBtn=document.getElementById("musicBtn");
const song=document.getElementById("song");
const backgroundMusic=document.getElementById("backgroundMusic");
const progress=document.querySelector("#progress i");

let W,H,stars=[],comets=[],currentScene=0,started=false,timers=[];

function resize(){
 W=innerWidth;H=innerHeight;
 canvas.width=W;canvas.height=H;
 stars=Array.from({length:180},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.2,a:Math.random()*.8+.2}));
 createComets();
}
function createComets(){
 comets=[{x:-180,y:H*.32,vx:3.1,vy:.7},{x:W+180,y:H*.68,vx:-3.1,vy:-.7}];
}
function drawStars(t){
 ctx.fillStyle="#02030a";ctx.fillRect(0,0,W,H);
 for(const s of stars){
  ctx.globalAlpha=s.a*(.55+.45*Math.sin(t*.001+s.x));
  ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
 }
 ctx.globalAlpha=1;
}
function drawComet(c){
 const a=Math.atan2(c.vy,c.vx);ctx.save();ctx.translate(c.x,c.y);ctx.rotate(a);
 const g=ctx.createLinearGradient(-200,0,30,0);
 g.addColorStop(0,"rgba(255,120,20,0)");g.addColorStop(.7,"rgba(255,200,100,.35)");g.addColorStop(1,"rgba(255,245,220,.95)");
 ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-200,0);ctx.quadraticCurveTo(-70,-22,10,-6);ctx.quadraticCurveTo(-70,22,-200,0);ctx.fill();
 const glow=ctx.createRadialGradient(0,0,0,0,0,30);
 glow.addColorStop(0,"#fff");glow.addColorStop(.2,"#ffe5a0");glow.addColorStop(.65,"#ff9e3d");glow.addColorStop(1,"rgba(255,70,10,0)");
 ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,30,0,Math.PI*2);ctx.fill();ctx.restore();
}
function animation(t){
 drawStars(t);
 if(started&&currentScene<=1) comets.forEach(c=>{c.x+=c.vx;c.y+=c.vy;drawComet(c)});
 requestAnimationFrame(animation);
}
function showScene(n){
 currentScene=n;
 scenes.forEach((s,i)=>s.classList.toggle("active",i===n));
}
function flash(){
 const f=document.createElement("div");f.className="flash";document.body.appendChild(f);
 requestAnimationFrame(()=>f.classList.add("go"));setTimeout(()=>f.remove(),1000);
}
function fadeBackground(){
 if(!backgroundMusic)return;
 const start=backgroundMusic.volume;
 const begin=performance.now(),duration=2200;
 function step(now){
  const p=Math.min(1,(now-begin)/duration);
  backgroundMusic.volume=start*(1-p);
  if(p<1)requestAnimationFrame(step);
  else{backgroundMusic.pause();backgroundMusic.currentTime=0;backgroundMusic.volume=.28;}
 }
 requestAnimationFrame(step);
}
const timeline=[[0,0],[16000,1],[34000,2],[78000,3],[125000,4],[188000,5]];
function startTimeline(){
 timers.forEach(clearTimeout);timers=[];
 timeline.forEach(([time,scene])=>timers.push(setTimeout(()=>{if(scene===1)flash();showScene(scene);},time)));
 const pt=setInterval(()=>{
  if(!started||currentScene===5){clearInterval(pt);return}
  progress.style.width=Math.min(100,(performance.now()%188000)/188000*100)+"%";
 },100);
 timers.push(pt);
}
startBtn.onclick=async function(){
 if(started)return;
 started=true;
 startBtn.style.display="none";
 if(backgroundMusic){
  backgroundMusic.volume=.28;
  try{await backgroundMusic.play();}catch(e){console.log("Фоновая музыка:",e);}
 }
 startTimeline();
};
skipBtn.onclick=function(){
 timers.forEach(clearTimeout);showScene(5);
 if(backgroundMusic){backgroundMusic.pause();backgroundMusic.currentTime=0;}
};
musicBtn.onclick=async function(){
 if(backgroundMusic){backgroundMusic.pause();backgroundMusic.currentTime=0;}
 musicBtn.style.display="none";
 try{await song.play();}
 catch(e){musicBtn.style.display="inline-block";musicBtn.textContent="▶ Нажмите ещё раз";}
};
song.onended=function(){musicBtn.textContent="▶ Послушать ещё раз";musicBtn.style.display="inline-block";};
resize();addEventListener("resize",resize);requestAnimationFrame(animation);
