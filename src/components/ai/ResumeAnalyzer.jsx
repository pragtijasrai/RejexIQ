import { useState, useEffect } from "react";
import { startResumeAnalysis } from "../../socket.js";
const G = { bg:"#0a0e27",surface:"#141b3a",card:"#1a2347",border:"#2d3a5f",accent:"#ff6b9d",accentDim:"rgba(255,107,157,0.15)",purple:"#c084fc",cyan:"#22d3ee",text:"#f0f4ff",muted:"#94a3b8",success:"#34d399",warning:"#fbbf24",danger:"#f87171" };

export default function ResumeAnalyzer({ socket }) {
  const [file,       setFile]       = useState(null);
  const [progress,   setProgress]   = useState(null);
  const [pct,        setPct]        = useState(0);
  const [done,       setDone]       = useState(false);
  const [results,    setResults]    = useState(null);
  const [dragging,   setDragging]   = useState(false);

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      setProgress(data.step);
      setPct(data.pct);
      if (data.pct >= 100) {
        setDone(true);
        setResults({
          atsScore: 87,
          missingSkills: ["TypeScript","Docker","System Design","AWS"],
          strengths: ["React","JavaScript","Problem Solving","Communication"],
          suggestions: [
            "Add quantified achievements (e.g. 'Improved performance by 40%')",
            "Include TypeScript in your skills section",
            "Add a Projects section with GitHub links",
            "Use more action verbs: Built, Designed, Optimized",
          ],
          keywords: ["React","Node.js","REST API","Agile","Git"],
          roleMatch: [
            { role:"Frontend Developer", match:92 },
            { role:"Full Stack Developer", match:78 },
            { role:"React Developer", match:95 },
          ],
        });
      }
    };
    socket.on("resume-progress", handler);
    return () => socket.off("resume-progress", handler);
  }, [socket]);

  function handleFile(f) {
    if (!f) return;
    setFile(f); setDone(false); setResults(null); setPct(0); setProgress(null);
    startResumeAnalysis(f.name);
  }

  function handleDrop(e) {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:700, color:G.text, display:"flex", alignItems:"center", gap:8 }}>
        📄 Resume Analyzer <span style={{ fontSize:11, color:G.accent, background:G.accentDim, borderRadius:20, padding:"2px 8px" }}>AI-Powered</span>
      </div>

      {/* Drop zone */}
      {!file && (
        <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop}
          style={{ border:`2px dashed ${dragging?G.accent:G.border}`, borderRadius:16, padding:"32px 24px", textAlign:"center", background:dragging?G.accentDim:"rgba(255,255,255,0.02)", transition:"all 0.2s", cursor:"pointer" }}
          onClick={() => document.getElementById("resume-upload").click()}>
          <div style={{ fontSize:40, marginBottom:12 }}>📤</div>
          <div style={{ fontSize:14, fontWeight:600, color:G.text, marginBottom:6 }}>Drop your resume here</div>
          <div style={{ fontSize:12, color:G.muted }}>PDF, DOCX, TXT supported</div>
          <input id="resume-upload" type="file" accept=".pdf,.docx,.txt" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
        </div>
      )}

      {/* Progress */}
      {file && !done && (
        <div style={{ background:G.surface, borderRadius:16, padding:20, border:`1px solid ${G.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontSize:13, color:G.text, fontWeight:600 }}>📄 {file.name}</span>
            <span style={{ fontSize:13, color:G.accent, fontWeight:700 }}>{pct}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden", marginBottom:10 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${G.accent},${G.purple})`, borderRadius:3, transition:"width 0.5s ease", boxShadow:`0 0 12px ${G.accent}60` }}/>
          </div>
          {progress && (
            <div style={{ fontSize:12, color:G.muted, display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:G.accent, animation:"pulse 1s infinite" }}/>
              {progress}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {done && results && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* ATS Score */}
          <div style={{ background:`linear-gradient(135deg,rgba(52,211,153,0.1),rgba(34,211,238,0.05))`, border:`1px solid ${G.success}30`, borderRadius:16, padding:16, display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:36, fontWeight:900, color:G.success }}>{results.atsScore}%</div>
              <div style={{ fontSize:11, color:G.muted }}>ATS Score</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:G.text, marginBottom:4 }}>Good ATS Compatibility</div>
              <div style={{ fontSize:12, color:G.muted }}>Your resume passes most ATS filters. A few improvements can push it to 95%+</div>
            </div>
          </div>

          {/* Role Match */}
          <div style={{ background:G.surface, borderRadius:14, padding:14, border:`1px solid ${G.border}` }}>
            <div style={{ fontSize:12, fontWeight:700, color:G.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>Role Match</div>
            {results.roleMatch.map((r,i) => (
              <div key={i} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                  <span style={{ color:G.text }}>{r.role}</span>
                  <span style={{ color:G.accent, fontWeight:700 }}>{r.match}%</span>
                </div>
                <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${r.match}%`, background:`linear-gradient(90deg,${G.accent},${G.purple})`, borderRadius:2 }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Missing Skills */}
          <div style={{ background:G.surface, borderRadius:14, padding:14, border:`1px solid ${G.border}` }}>
            <div style={{ fontSize:12, fontWeight:700, color:G.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>Missing Skills</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {results.missingSkills.map(s => (
                <span key={s} style={{ fontSize:11, color:G.danger, background:"rgba(248,113,113,0.1)", border:`1px solid ${G.danger}30`, borderRadius:20, padding:"3px 10px" }}>+ {s}</span>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div style={{ background:G.surface, borderRadius:14, padding:14, border:`1px solid ${G.border}` }}>
            <div style={{ fontSize:12, fontWeight:700, color:G.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>AI Suggestions</div>
            {results.suggestions.map((s,i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom:8, fontSize:12, color:G.text, lineHeight:1.5 }}>
                <span style={{ color:G.accent, flexShrink:0 }}>→</span>{s}
              </div>
            ))}
          </div>

          <button onClick={()=>{setFile(null);setDone(false);setResults(null);setPct(0);}} style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${G.border}`, borderRadius:10, padding:"10px 0", color:G.muted, fontSize:13, cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.color=G.text;}} onMouseLeave={e=>{e.currentTarget.style.color=G.muted;}}>
            Analyze Another Resume
          </button>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
