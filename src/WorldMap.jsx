import { useState, useEffect, useRef } from "react";
import { fetchWorlds, fetchProgress } from "./storyApi";

// ── NEBULA CANVAS ─────────────────────────────────────────────────────────────
function NebulaCanvas() {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const W = canvas.width, H = canvas.height;
    const COLS = ["#00e5ff","#c084fc","#34d399","#f59e0b","#f0f4ff"];
    const pts = Array.from({length:130},()=>({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-0.5)*0.28, vy:(Math.random()-0.5)*0.28,
      r:Math.random()*1.8+0.3,
      color:COLS[Math.floor(Math.random()*COLS.length)],
      a:Math.random()*0.5+0.2, pulse:Math.random()*Math.PI*2
    }));
    let raf;
    function draw() {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{
        p.pulse+=0.018; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0;
        if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        const a=p.a*(0.7+0.3*Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.color+Math.floor(a*255).toString(16).padStart(2,"0");
        ctx.fill();
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<75){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(0,229,255,${0.07*(1-d/75)})`;ctx.lineWidth=0.5;ctx.stroke();}
      }
      raf=requestAnimationFrame(draw);
    }
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

// ── LEVEL UP MODAL ────────────────────────────────────────────────────────────
function LevelUpModal({level,onClose}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.8)",backdropFilter:"blur(10px)"}}>
      <div style={{textAlign:"center",animation:"levelUpPop 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{fontSize:80,marginBottom:8,filter:"drop-shadow(0 0 30px #fbbf24)"}}>🏅</div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:"#64748b",letterSpacing:4,textTransform:"uppercase",marginBottom:8}}>Level Up!</div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:48,fontWeight:900,background:"linear-gradient(135deg,#fbbf24,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:24}}>{level}</div>
        <button onClick={onClose} style={{background:"linear-gradient(135deg,#fbbf24,#f59e0b)",border:"none",color:"#060912",padding:"12px 36px",borderRadius:24,fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif"}}>Awesome! →</button>
      </div>
    </div>
  );
}

// ── WORLD CARD ────────────────────────────────────────────────────────────────
const WMETA = {
  arrays:    {bg:"linear-gradient(135deg,#020d1a 0%,#0a1f35 100%)",particle:"#00e5ff",difficulty:"Beginner",   missions:5},
  recursion: {bg:"linear-gradient(135deg,#0e0520 0%,#1e0d3a 100%)",particle:"#c084fc",difficulty:"Intermediate",missions:3},
  graphs:    {bg:"linear-gradient(135deg,#020e08 0%,#071a10 100%)",particle:"#34d399",difficulty:"Advanced",   missions:3}
};
const DIFF_COLOR = {Beginner:"#34d399",Intermediate:"#f59e0b",Advanced:"#ef4444"};

function WorldCard({world,index,completedMissions,onSelect}) {
  const [hov,setHov]=useState(false);
  const [clicked,setClicked]=useState(false);
  const meta=WMETA[world.id]||WMETA.arrays;
  const dc=DIFF_COLOR[meta.difficulty]||"#94a3b8";
  const done=(completedMissions||[]).filter(id=>id.startsWith(world.id.slice(0,3))).length;
  const pct=Math.round((done/meta.missions)*100);

  function click(){setClicked(true);setTimeout(()=>{setClicked(false);onSelect(world);},200);}

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={click}
      style={{position:"relative",borderRadius:24,padding:"36px 28px 28px",cursor:"pointer",overflow:"hidden",textAlign:"center",
        background:meta.bg,
        border:`1.5px solid ${hov?world.color:"rgba(255,255,255,0.07)"}`,
        transform:clicked?"scale(0.96)":hov?"translateY(-10px) scale(1.02)":"translateY(0) scale(1)",
        boxShadow:hov?`0 24px 70px ${world.color}35,0 0 0 1px ${world.color}20`:"0 4px 24px rgba(0,0,0,0.5)",
        transition:"all 0.35s cubic-bezier(0.34,1.2,0.64,1)",
        animation:`cardEntrance 0.6s ease ${index*0.12}s both`}}>

      {/* Scanlines */}
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.012) 2px,rgba(255,255,255,0.012) 4px)",pointerEvents:"none",borderRadius:24}}/>

      {/* Shimmer on hover */}
      {hov&&<div style={{position:"absolute",inset:0,background:`linear-gradient(105deg,transparent 40%,${world.color}18 50%,transparent 60%)`,backgroundSize:"200% 100%",animation:"shimmerSlide 1.2s ease infinite",borderRadius:24,pointerEvents:"none"}}/>}

      {/* Floating dots */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",borderRadius:24,pointerEvents:"none"}}>
        {[...Array(10)].map((_,j)=>(
          <div key={j} style={{position:"absolute",width:j%3===0?4:2,height:j%3===0?4:2,borderRadius:"50%",background:meta.particle,opacity:hov?0.7:0.25,left:`${8+j*9}%`,top:`${15+(j%4)*20}%`,animation:`floatDot ${1.8+j*0.25}s ease-in-out infinite`,animationDelay:`${j*0.18}s`,transition:"opacity 0.3s"}}/>
        ))}
      </div>

      {/* Difficulty badge */}
      <div style={{position:"absolute",top:16,right:16,background:`${dc}20`,border:`1px solid ${dc}50`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,color:dc,letterSpacing:0.5}}>{meta.difficulty}</div>

      <div style={{position:"relative",zIndex:1}}>
        <div style={{fontSize:56,marginBottom:10,filter:hov?`drop-shadow(0 0 20px ${world.color})`:"none",transition:"filter 0.3s"}}>{world.icon}</div>
        <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,color:world.color,marginBottom:6}}>{world.name}</h2>
        <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.6,marginBottom:20}}>{world.description}</p>

        {/* Progress */}
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#64748b",marginBottom:5}}>
            <span>{done}/{meta.missions} missions</span>
            <span style={{color:world.color}}>{pct}%</span>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${world.color},${world.color}aa)`,borderRadius:2,boxShadow:`0 0 8px ${world.color}80`,transition:"width 1s ease"}}/>
          </div>
        </div>

        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${world.color}15`,border:`1px solid ${world.color}40`,borderRadius:20,padding:"9px 22px",fontSize:13,fontWeight:700,color:world.color}}>
          {hov?<>Enter World <span style={{animation:"arrowBounce 0.6s ease infinite",display:"inline-block"}}>→</span></>:"Explore"}
        </div>
      </div>
    </div>
  );
}

// ── STATS ROW ─────────────────────────────────────────────────────────────────
function StatsRow({progress}) {
  const stats=[
    {icon:"⭐",label:"Total XP",value:progress?.xp||0,color:"#fbbf24"},
    {icon:"🏅",label:"Level",value:progress?.level||"Beginner",color:"#c084fc"},
    {icon:"✅",label:"Missions Done",value:progress?.completedMissions?.length||0,color:"#34d399"},
    {icon:"🔥",label:"Worlds Explored",value:new Set((progress?.completedMissions||[]).map(id=>id.split("_")[0])).size,color:"#f59e0b"}
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,padding:"0 40px 32px",maxWidth:1100,margin:"0 auto"}}>
      {stats.map((s,i)=>(
        <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"18px 20px",display:"flex",alignItems:"center",gap:14,animation:`cardEntrance 0.5s ease ${i*0.08}s both`}}>
          <div style={{fontSize:28,filter:`drop-shadow(0 0 8px ${s.color})`}}>{s.icon}</div>
          <div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,color:s.color}}>{s.value}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:1}}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function WorldMap({userId,onSelectWorld,onBack}) {
  const [worlds,setWorlds]=useState([]);
  const [progress,setProgress]=useState(null);
  const [loading,setLoading]=useState(true);
  const [levelUpMsg,setLevelUpMsg]=useState(null);
  const prevLevel=useRef(null);

  useEffect(()=>{
    Promise.all([fetchWorlds(),fetchProgress(userId)])
      .then(([w,p])=>{setWorlds(w.worlds);setProgress(p);prevLevel.current=p.level;})
      .catch(console.error).finally(()=>setLoading(false));
  },[userId]);

  useEffect(()=>{
    if(!progress) return;
    if(prevLevel.current&&prevLevel.current!==progress.level) setLevelUpMsg(progress.level);
    prevLevel.current=progress.level;
  },[progress?.level]);

  const xpNext=getXpToNext(progress?.xp||0);

  if (loading) return (
    <div style={S.center}>
      <div style={S.spinner}/>
      <p style={{color:"#94a3b8",marginTop:16,fontFamily:"'Inter',sans-serif"}}>Summoning worlds...</p>
    </div>
  );

  return (
    <div style={S.page}>
      <style>{KF}</style>
      {levelUpMsg&&<LevelUpModal level={levelUpMsg} onClose={()=>setLevelUpMsg(null)}/>}

      {/* Hero */}
      <div style={S.hero}>
        <NebulaCanvas/>
        <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"60px 40px 50px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,229,255,0.08)",border:"1px solid rgba(0,229,255,0.25)",borderRadius:20,padding:"5px 16px",marginBottom:20,fontSize:12,color:"#00e5ff",fontWeight:600,letterSpacing:1}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#00e5ff",display:"inline-block",animation:"pulse 1.5s ease infinite"}}/>
            STORY MODE — ACTIVE
          </div>
          <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"clamp(32px,5vw,56px)",fontWeight:900,lineHeight:1.1,marginBottom:12,background:"linear-gradient(135deg,#f0f4ff 30%,#00e5ff 70%,#c084fc 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            Choose Your World
          </h1>
          <p style={{color:"#64748b",fontSize:15,maxWidth:480,margin:"0 auto 32px",lineHeight:1.6}}>
            Each world is a DSA realm. Conquer missions, earn XP, and level up your skills.
          </p>
          {progress&&(
            <div style={{maxWidth:420,margin:"0 auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#64748b",marginBottom:8}}>
                <span style={{color:"#c084fc",fontWeight:600}}>{progress.level}</span>
                <span>{progress.xp} / {xpNext.max} XP → <span style={{color:"#00e5ff"}}>{xpNext.next}</span></span>
              </div>
              <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden",position:"relative"}}>
                <div style={{height:"100%",width:`${xpNext.pct}%`,background:"linear-gradient(90deg,#00e5ff,#c084fc)",borderRadius:4,boxShadow:"0 0 14px #00e5ff80",transition:"width 1s ease",position:"relative"}}>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)",animation:"shimmerSlide 2s ease infinite"}}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {progress&&<StatsRow progress={progress}/>}

      <div style={S.grid}>
        {worlds.map((w,i)=>(
          <WorldCard key={w.id} world={w} index={i} completedMissions={progress?.completedMissions} onSelect={onSelectWorld}/>
        ))}
      </div>

      <div style={{textAlign:"center",paddingBottom:48}}>
        <button onClick={onBack} style={S.backBtn}>← Exit Story Mode</button>
      </div>
    </div>
  );
}

function getXpToNext(xp) {
  const lvls=[{name:"Beginner",min:0},{name:"Apprentice",min:30},{name:"Coder",min:80},{name:"Developer",min:150},{name:"Engineer",min:250},{name:"Master",min:400}];
  for(let i=0;i<lvls.length-1;i++){
    if(xp<lvls[i+1].min){const pct=((xp-lvls[i].min)/(lvls[i+1].min-lvls[i].min))*100;return{pct:Math.min(100,pct),max:lvls[i+1].min,next:lvls[i+1].name};}
  }
  return{pct:100,max:400,next:"Master"};
}

const KF=`
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes floatDot{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes cardEntrance{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerSlide{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes arrowBounce{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
  @keyframes levelUpPop{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
`;

const S={
  page:{minHeight:"100vh",background:"#060912",fontFamily:"'Inter',sans-serif"},
  center:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#060912"},
  spinner:{width:40,height:40,border:"3px solid #1e2a4a",borderTop:"3px solid #00e5ff",borderRadius:"50%",animation:"spin 0.8s linear infinite"},
  hero:{position:"relative",overflow:"hidden",borderBottom:"1px solid rgba(255,255,255,0.05)"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:28,padding:"0 40px 40px",maxWidth:1100,margin:"0 auto"},
  backBtn:{background:"transparent",border:"1px solid rgba(255,255,255,0.12)",color:"#64748b",padding:"10px 24px",borderRadius:20,cursor:"pointer",fontSize:13,fontFamily:"'Inter',sans-serif"}
};
