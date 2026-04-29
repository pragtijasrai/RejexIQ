import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { fetchMissions, submitAnswer } from "./storyApi";

const ArrayKingdom     = lazy(() => import("./ArrayKingdom"));
const RecursionDungeon = lazy(() => import("./RecursionDungeon"));
const GraphMaze        = lazy(() => import("./GraphMaze"));

const WORLD_COMPONENTS = { arrays: ArrayKingdom, recursion: RecursionDungeon, graphs: GraphMaze };
const WORLD_COLORS     = { arrays: "#00e5ff", recursion: "#c084fc", graphs: "#34d399" };
const TIMER_SECONDS    = 30;

// ── FIREWORKS ─────────────────────────────────────────────────────────────────
function FireworksCanvas() {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    const W = canvas.width, H = canvas.height;
    const COLS = ["#00e5ff","#c084fc","#fbbf24","#34d399","#f87171","#f0f4ff"];
    const bursts = [];
    function spawn() {
      const x = Math.random()*W, y = Math.random()*H*0.6+50;
      const c = COLS[Math.floor(Math.random()*COLS.length)];
      for (let i=0;i<40;i++) {
        const a=(i/40)*Math.PI*2, s=Math.random()*5+2;
        bursts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,alpha:1,color:c,r:Math.random()*2.5+1});
      }
    }
    spawn(); spawn();
    const iv = setInterval(spawn, 450);
    let raf;
    function draw() {
      ctx.fillStyle="rgba(6,9,18,0.18)"; ctx.fillRect(0,0,W,H);
      for (let i=bursts.length-1;i>=0;i--) {
        const p=bursts[i];
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.09; p.alpha-=0.018;
        if (p.alpha<=0){bursts.splice(i,1);continue;}
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.color+Math.floor(p.alpha*255).toString(16).padStart(2,"0");
        ctx.fill();
      }
      raf=requestAnimationFrame(draw);
    }
    draw();
    return ()=>{cancelAnimationFrame(raf);clearInterval(iv);};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

// ── STREAK BADGE ──────────────────────────────────────────────────────────────
function StreakBadge({streak}) {
  if (streak<2) return null;
  const labels={2:"2× Combo!",3:"3× ULTRA!",4:"4× INSANE!",5:"5× GODLIKE!"};
  const colors={2:"#f59e0b",3:"#ef4444",4:"#c084fc",5:"#00e5ff"};
  const label=labels[Math.min(streak,5)]||`${streak}× STREAK!`;
  const color=colors[Math.min(streak,5)]||"#00e5ff";
  return (
    <div style={{position:"absolute",top:80,left:"50%",transform:"translateX(-50%)",zIndex:30,animation:"streakPop 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>
      <div style={{background:`${color}20`,border:`2px solid ${color}`,borderRadius:24,padding:"8px 24px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:900,fontSize:18,color,boxShadow:`0 0 30px ${color}60`,letterSpacing:1,whiteSpace:"nowrap"}}>
        🔥 {label}
      </div>
    </div>
  );
}

// ── XP TICKER ─────────────────────────────────────────────────────────────────
function XpTicker({value}) {
  const [disp,setDisp]=useState(0);
  const prev=useRef(0);
  useEffect(()=>{
    const diff=value-prev.current; if(!diff) return;
    const start=prev.current; let step=0;
    const id=setInterval(()=>{
      step++; setDisp(Math.round(start+(diff*step)/20));
      if(step>=20){clearInterval(id);prev.current=value;}
    },30);
    return ()=>clearInterval(id);
  },[value]);
  return <span>{disp}</span>;
}

// ── COUNTDOWN RING ────────────────────────────────────────────────────────────
function CountdownRing({seconds,total,color}) {
  const r=20,circ=2*Math.PI*r,dash=(seconds/total)*circ,urgent=seconds<=8;
  return (
    <div style={{position:"relative",width:52,height:52}}>
      <svg width={52} height={52} style={{transform:"rotate(-90deg)"}}>
        <circle cx={26} cy={26} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4}/>
        <circle cx={26} cy={26} r={r} fill="none" stroke={urgent?"#ef4444":color} strokeWidth={4}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{transition:"stroke-dasharray 0.9s linear",filter:`drop-shadow(0 0 4px ${urgent?"#ef4444":color})`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:14,color:urgent?"#ef4444":"#f0f4ff",animation:urgent?"pulse 0.5s ease infinite":"none"}}>
        {seconds}
      </div>
    </div>
  );
}

// ── WORLD COMPLETE ────────────────────────────────────────────────────────────
function WorldCompleteScreen({world,totalXp,accuracy,onExit,accentColor}) {
  const stars=accuracy>=80?3:accuracy>=50?2:1;
  return (
    <div style={{position:"relative",minHeight:"100vh",background:"#060912",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <FireworksCanvas/>
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"40px 24px",animation:"fadeUp 0.6s ease"}}>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>
          {[1,2,3].map(n=>(
            <div key={n} style={{fontSize:48,filter:n<=stars?`drop-shadow(0 0 20px #fbbf24)`:"grayscale(1) opacity(0.2)",animation:n<=stars?`starPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${n*0.15}s both`:"none"}}>⭐</div>
          ))}
        </div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,color:"#64748b",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>World Conquered</div>
        <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:42,fontWeight:900,color:accentColor,marginBottom:4,textShadow:`0 0 40px ${accentColor}80`}}>{world.name}</h2>
        <div style={{color:"#64748b",marginBottom:36,fontSize:14}}>{world.icon} All missions complete</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,maxWidth:420,margin:"0 auto 36px"}}>
          {[{label:"XP Earned",value:`+${totalXp}`,color:"#fbbf24",icon:"⭐"},{label:"Accuracy",value:`${accuracy}%`,color:"#34d399",icon:"🎯"},{label:"Stars",value:`${stars}/3`,color:"#c084fc",icon:"🏅"}].map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"18px 12px",animation:`cardEntrance 0.5s ease ${0.3+i*0.1}s both`}}>
              <div style={{fontSize:24,marginBottom:6}}>{s.icon}</div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:800,color:s.color}}>{s.value}</div>
              <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={onExit}
          style={{background:`linear-gradient(135deg,${accentColor},${accentColor}bb)`,border:"none",color:"#060912",padding:"14px 40px",borderRadius:28,fontWeight:900,fontSize:16,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",boxShadow:`0 8px 30px ${accentColor}50`}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          ← Back to World Map
        </button>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function MissionEngine({world,userId,onExit,onXpUpdate}) {
  const [missions,setMissions]         = useState([]);
  const [currentIdx,setCurrentIdx]     = useState(0);
  const [loading,setLoading]           = useState(true);
  const [answerStates,setAnswerStates] = useState(["idle","idle","idle","idle"]);
  const [feedback,setFeedback]         = useState(null);
  const [answered,setAnswered]         = useState(false);
  const [totalXp,setTotalXp]           = useState(0);
  const [streak,setStreak]             = useState(0);
  const [correctCount,setCorrectCount] = useState(0);
  const [worldComplete,setWorldComplete] = useState(false);
  const [timeLeft,setTimeLeft]         = useState(TIMER_SECONDS);
  const [showStreak,setShowStreak]     = useState(false);
  const timerRef = useRef();

  const accentColor    = WORLD_COLORS[world.id]||"#00e5ff";
  const WorldComponent = WORLD_COMPONENTS[world.id]||ArrayKingdom;

  useEffect(()=>{
    fetchMissions(world.id).then(d=>setMissions(d.missions)).catch(console.error).finally(()=>setLoading(false));
  },[world.id]);

  // Timer
  useEffect(()=>{
    if (answered||loading) return;
    setTimeLeft(TIMER_SECONDS);
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if (t<=1){clearInterval(timerRef.current);handleTimeUp();return 0;}
        return t-1;
      });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[currentIdx,answered,loading]);

  function handleTimeUp(){
    if (answered) return;
    setAnswered(true); setStreak(0);
    setFeedback({correct:false,xpGained:0,correctAnswer:"—",explanation:"⏰ Time's up! No XP awarded.",timedOut:true});
  }

  const handleAnswer=useCallback(async(selectedOption,optionIndex)=>{
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    const mission=missions[currentIdx]; if (!mission) return;
    try {
      const result=await submitAnswer(userId,mission.id,selectedOption);
      let bonusXp=0;
      if (result.correct){
        const newStreak=streak+1; setStreak(newStreak);
        if (newStreak>=2){bonusXp=result.xpGained*(Math.min(newStreak,5)-1);setShowStreak(true);setTimeout(()=>setShowStreak(false),1800);}
        setCorrectCount(c=>c+1);
      } else { setStreak(0); }
      setAnswerStates(mission.options.map((opt,i)=>{
        if (i===optionIndex) return result.correct?"correct":"wrong";
        if (!result.correct&&opt===result.correctAnswer) return "correct";
        return "idle";
      }));
      setFeedback({...result,bonusXp});
      if (result.correct){setTotalXp(p=>p+result.xpGained+bonusXp);onXpUpdate?.(result.progress);}
    } catch(e){console.error(e);}
  },[answered,missions,currentIdx,userId,streak,onXpUpdate]);

  function handleNext(){
    if (currentIdx<missions.length-1){
      setCurrentIdx(i=>i+1);
      setAnswerStates(["idle","idle","idle","idle"]);
      setFeedback(null); setAnswered(false);
    } else { setWorldComplete(true); }
  }

  if (loading) return <div style={S.center}><div style={{...S.spinner,borderTopColor:accentColor}}/><p style={{color:"#94a3b8",marginTop:16}}>Loading {world.name}...</p></div>;

  if (worldComplete) {
    const accuracy=missions.length>0?Math.round((correctCount/missions.length)*100):0;
    return <><style>{KF}</style><WorldCompleteScreen world={world} totalXp={totalXp} accuracy={accuracy} onExit={onExit} accentColor={accentColor}/></>;
  }

  const mission=missions[currentIdx];

  return (
    <div style={S.container}>
      <style>{KF}</style>

      {/* HUD */}
      <div style={S.hud}>
        <div style={S.hudLeft}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>{world.icon}</span>
            <span style={{color:accentColor,fontWeight:700,fontSize:14,fontFamily:"'Space Grotesk',sans-serif"}}>{world.name}</span>
          </div>
          <div style={{display:"flex",gap:4,marginTop:4}}>
            {missions.map((_,i)=>(
              <div key={i} style={{width:26,height:4,borderRadius:2,background:i<currentIdx?accentColor:i===currentIdx?`${accentColor}70`:"rgba(255,255,255,0.07)",transition:"background 0.3s",boxShadow:i<currentIdx?`0 0 6px ${accentColor}80`:"none"}}/>
            ))}
          </div>
          <span style={{color:"#64748b",fontSize:11,marginTop:2}}>Mission {currentIdx+1} / {missions.length}</span>
        </div>

        <div style={S.questionBox}>
          <p style={S.questionText}>{mission?.question}</p>
        </div>

        <div style={S.hudRight}>
          {streak>=2&&<div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:16,padding:"4px 10px",fontSize:12,color:"#ef4444",fontWeight:700}}>🔥 {streak}×</div>}
          <div style={S.xpChip}><span style={{color:"#fbbf24"}}>⭐</span><span style={{color:"#f0f4ff",fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}><XpTicker value={totalXp}/> XP</span></div>
          <CountdownRing seconds={timeLeft} total={TIMER_SECONDS} color={accentColor}/>
          <button onClick={onExit} style={S.exitBtn}>✕</button>
        </div>
      </div>

      {showStreak&&<StreakBadge streak={streak}/>}

      {/* 3D Canvas */}
      <div style={S.canvas}>
        <Suspense fallback={<div style={S.center}><div style={{...S.spinner,borderTopColor:accentColor}}/></div>}>
          <WorldComponent mission={mission} onAnswer={handleAnswer} answerStates={answerStates} feedback={feedback}/>
        </Suspense>
      </div>

      {answered&&(
        <div style={S.nextWrap}>
          <button onClick={handleNext}
            style={{...S.nextBtn,background:`linear-gradient(135deg,${accentColor},${accentColor}bb)`,boxShadow:`0 8px 30px ${accentColor}50`}}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            {currentIdx<missions.length-1?"Next Mission →":"Complete World 🏆"}
          </button>
        </div>
      )}

      {!answered&&<div style={S.hint}>🖱️ Click a cube to answer</div>}
    </div>
  );
}

const KF=`
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes cardEntrance{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes streakPop{from{opacity:0;transform:translateX(-50%) scale(0.5)}to{opacity:1;transform:translateX(-50%) scale(1)}}
  @keyframes starPop{from{opacity:0;transform:scale(0) rotate(-30deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}
`;

const S={
  container:{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:"#060912",fontFamily:"'Inter',sans-serif",position:"relative",overflow:"hidden"},
  center:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",background:"#060912",color:"#f0f4ff"},
  spinner:{width:40,height:40,border:"3px solid #1e2a4a",borderTop:"3px solid #00e5ff",borderRadius:"50%",animation:"spin 0.8s linear infinite"},
  hud:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",background:"rgba(6,9,18,0.96)",borderBottom:"1px solid rgba(255,255,255,0.05)",backdropFilter:"blur(16px)",zIndex:10,gap:12,flexShrink:0},
  hudLeft:{display:"flex",flexDirection:"column",gap:2,minWidth:180},
  questionBox:{flex:1,textAlign:"center",padding:"0 16px"},
  questionText:{color:"#f0f4ff",fontSize:14,fontWeight:600,lineHeight:1.5,margin:0},
  hudRight:{display:"flex",alignItems:"center",gap:10,flexShrink:0},
  xpChip:{display:"flex",alignItems:"center",gap:6,background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:16,padding:"5px 12px",fontSize:13},
  exitBtn:{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"#64748b",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:14},
  canvas:{flex:1,position:"relative",minHeight:0},
  nextWrap:{position:"absolute",bottom:90,left:"50%",transform:"translateX(-50%)",zIndex:20},
  nextBtn:{padding:"13px 36px",borderRadius:28,border:"none",color:"#060912",fontWeight:900,fontSize:15,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",transition:"transform 0.2s"},
  hint:{position:"absolute",bottom:18,left:"50%",transform:"translateX(-50%)",color:"#64748b",fontSize:12,background:"rgba(6,9,18,0.85)",padding:"6px 18px",borderRadius:20,border:"1px solid rgba(255,255,255,0.05)",zIndex:10,whiteSpace:"nowrap"}
};
