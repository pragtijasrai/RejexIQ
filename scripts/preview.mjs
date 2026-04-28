import{readFileSync,writeFileSync}from"fs";
let c=readFileSync("src/ResumeBuilderLanding.jsx","utf8");

// 1. Fix the download button text - remove "auto-apply" messaging
c=c.replace(
  `<p className="text-xs text-slate-500 text-center mt-2">Applies all AI fixes and downloads as PDF instantly</p>`,
  `<p className="text-xs text-slate-500 text-center mt-2">Downloads only your manually applied fixes as PDF</p>`
);

// 2. Add live preview section BEFORE the download button
// Find the motion.button for download
const btnMarker=`                      <motion.button\n                        onClick={downloadFixedPDF}`;
const previewBlock=`                      {/* Live Preview of Applied Fixes */}
                      {Object.keys(improved).filter(k=>improved[k]==="done").length>0&&(
                        <div className="mb-4 rounded-2xl border border-white/10 overflow-hidden" style={{background:"rgba(255,255,255,0.03)"}}> 
                          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">📄 Preview — Improved Resume</span>
                            <span className="text-xs text-emerald-400 font-semibold">{Object.keys(improved).filter(k=>improved[k]==="done").length} fixes applied</span>
                          </div>
                          <div className="p-4 max-h-64 overflow-y-auto" style={{background:"white",borderRadius:"0 0 16px 16px"}}>
                            <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"16px 20px",marginBottom:12}}>
                              <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>Your Name</div>
                              <div style={{fontSize:11,color:"rgba(255,255,255,0.85)"}}>Software Engineer</div>
                              <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",marginTop:4}}>email@example.com · +1 234 567 8900</div>
                            </div>
                            <div style={{padding:"0 4px"}}>
                              <div style={{fontSize:8,fontWeight:800,color:"#6366f1",textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid #6366f1",paddingBottom:3,marginBottom:8}}>
                                Experience <span style={{background:"#10b98120",color:"#10b981",padding:"1px 6px",borderRadius:6,fontSize:7,fontWeight:600,marginLeft:4}}>{Object.keys(improved).filter(k=>improved[k]==="done").length} AI Improved</span>
                              </div>
                              {GRAMMAR_ISSUES.map((g,i)=>(
                                <div key={g.id} style={{marginBottom:8,paddingLeft:improved[g.id]==="done"?8:0,borderLeft:improved[g.id]==="done"?"3px solid #10b981":"none",background:improved[g.id]==="done"?"rgba(16,185,129,0.05)":"transparent",borderRadius:4,padding:improved[g.id]==="done"?"4px 8px":"0"}}>
                                  {improved[g.id]==="done"&&<div style={{fontSize:7,color:"#10b981",fontWeight:700,marginBottom:2}}>✓ FIXED</div>}
                                  <p style={{fontSize:9,color:improved[g.id]==="done"?"#1a1a1a":"#9ca3af",lineHeight:1.5,margin:0}}>{improved[g.id]==="done"?g.improved:g.original}</p>
                                </div>
                              ))}
                              <div style={{marginTop:10}}><div style={{fontSize:8,fontWeight:800,color:"#6366f1",textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid #6366f1",paddingBottom:3,marginBottom:6}}>Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{["JavaScript","TypeScript","React","Node.js","Python","Docker","AWS"].map(s=>(<span key={s} style={{background:"#6366f115",border:"1px solid #6366f133",color:"#6366f1",padding:"2px 7px",borderRadius:10,fontSize:8,fontWeight:600}}>{s}</span>))}</div></div>
                            </div>
                          </div>
                        </div>
                      )}`,

c=c.replace(btnMarker,previewBlock+"\n"+btnMarker);

writeFileSync("src/ResumeBuilderLanding.jsx",c,"utf8");
console.log("Preview added! lines:",c.split("\n").length);
