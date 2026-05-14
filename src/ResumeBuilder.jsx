// ═══════════════════════════════════════════════════════════════
// PREMIUM AI RESUME BUILDER - Complete Rewrite
// ═══════════════════════════════════════════════════════════════
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── CONSTANTS ───────────────────────────────────────────────────
const ACCENT_PRESETS = [
  { name:"Indigo",  color:"#6366f1" }, { name:"Violet", color:"#8b5cf6" },
  { name:"Cyan",    color:"#06b6d4" }, { name:"Rose",   color:"#f43f5e" },
  { name:"Emerald", color:"#10b981" }, { name:"Amber",  color:"#f59e0b" },
];
const TEMPLATES = [
  { id:"modern",   label:"Modern",   icon:"✦" },
  { id:"classic",  label:"Classic",  icon:"◈" },
  { id:"minimal",  label:"Minimal",  icon:"◻" },
  { id:"sidebar",  label:"Sidebar",  icon:"▣" },
  { id:"dark",     label:"Dark",     icon:"◉" },
  { id:"diagonal", label:"Diagonal", icon:"◤" },
  { id:"glass",    label:"Glass",    icon:"◇" },
  { id:"elegant",  label:"Elegant",  icon:"❧" },
];
const ATS_KEYWORDS = ["led","managed","developed","built","designed","implemented","optimized","increased","reduced","improved","collaborated","delivered","launched","architected","scaled","automated","deployed","integrated","mentored","results","impact","metrics","performance","agile","scrum"];
const SKILL_MAP = { javascript:["TypeScript","Node.js","Express","Next.js"], react:["Redux","GraphQL","React Native","Zustand"], python:["Django","FastAPI","NumPy","Pandas"], css:["TailwindCSS","SASS","Framer Motion"], java:["Spring Boot","Microservices","Maven"], sql:["PostgreSQL","MongoDB","Redis","Prisma"], aws:["Docker","Kubernetes","Terraform","CI/CD"] };
const RESUME_TIPS = [
  { icon:"🎯", tip:"Use action verbs: Led, Built, Designed, Optimized" },
  { icon:"📊", tip:"Quantify achievements: Increased performance by 40%" },
  { icon:"🔑", tip:"Mirror exact keywords from the job description" },
  { icon:"📏", tip:"Keep to 1 page for under 5 years experience" },
  { icon:"🔗", tip:"Add GitHub/LinkedIn links for credibility" },
  { icon:"⚡", tip:"List your most relevant skills first" },
];

// ─── RESUME PARSING UTILITIES ───────────────────────────────────
async function parseResumeFile(file) {
  try {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      return await parsePDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
      return await parseDOCX(file);
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      return await parseTXT(file);
    }
    throw new Error('Unsupported file type');
  } catch (err) {
    console.error('Parse error:', err);
    return null;
  }
}

async function parsePDF(file) {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return extractResumeData(fullText);
  } catch (err) {
    console.error('PDF parse error:', err);
    try {
      const text = await file.text();
      const cleaned = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
      return extractResumeData(cleaned);
    } catch { return null; }
  }
}

async function parseDOCX(file) {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return extractResumeData(result.value || '');
  } catch (err) {
    console.error('DOCX parse error:', err);
    return null;
  }
}


async function parseTXT(file) {
  const text = await file.text();
  return extractResumeData(text);
}

function extractResumeData(text) {
  // Extract real resume content from parsed text
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Simple heuristic extraction
  const data = {
    name: lines[0] || '',
    title: lines.find(l => l.match(/engineer|developer|analyst|manager|specialist/i)) || '',
    email: lines.find(l => l.includes('@')) || '',
    phone: lines.find(l => /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(l)) || '',
    location: '',
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    originalContent: text
  };
  
  // Extract sections
  let currentSection = '';
  let currentItem = { description: [] };
  
  for (const line of lines) {
    const lower = line.toLowerCase();
    
    if (lower.includes('experience') || lower.includes('professional')) {
      currentSection = 'experience';
    } else if (lower.includes('project')) {
      currentSection = 'projects';
    } else if (lower.includes('skill')) {
      currentSection = 'skills';
    } else if (lower.includes('education')) {
      currentSection = 'education';
    } else if (lower.includes('certification')) {
      currentSection = 'certifications';
    } else if (lower.includes('summary') || lower.includes('about')) {
      currentSection = 'summary';
    } else if (line && currentSection) {
      if (currentSection === 'experience' && !line.startsWith('•')) {
        if (currentItem.role) data.experience.push({...currentItem, id: 'e'+Date.now()});
        currentItem = { role: line, company: '', duration: '', description: '' };
      } else if (currentSection === 'skills' && line.length < 50) {
        if (!data.skills.includes(line)) data.skills.push(line);
      } else if (currentSection === 'summary') {
        data.summary += (data.summary ? ' ' : '') + line;
      } else if (currentSection === 'projects') {
        if (currentItem.name && line.includes('•')) {
          currentItem.description += '\n' + line;
        } else if (!currentItem.name) {
          currentItem = { name: line, tech: '', link: '', description: '', id: 'p'+Date.now() };
        }
      }
    }
  }
  
  return data;
}

// ─── UTILITIES ───────────────────────────────────────────────────
function calcATS(data) {
  let s=0;
  const txt=[data.summary,...data.experience.map(e=>e.description),...data.projects.map(p=>p.description),data.skills.join(" ")].join(" ").toLowerCase();
  if(data.name)s+=5;if(data.title)s+=5;if(data.email)s+=3;if(data.phone)s+=3;if(data.location)s+=2;
  if(data.summary?.length>50)s+=8;if(data.skills.length>=5)s+=7;if(data.experience.length>=1)s+=7;
  s+=Math.min(30,ATS_KEYWORDS.filter(k=>txt.includes(k)).length*2);
  if(data.summary?.length>100)s+=5;if(data.experience.some(e=>/\d+%|\d+x/.test(e.description)))s+=10;
  if(data.education.length>=1)s+=5;if(data.certifications.length>=1)s+=5;if(data.projects.length>=2)s+=5;
  return Math.min(100,s);
}
function calcDone(data) {
  const c=[!!data.name,!!data.title,!!data.email,!!data.phone,!!data.location,data.summary?.length>30,data.skills.length>=3,data.experience.length>=1,data.education.length>=1,data.projects.length>=1,data.certifications.length>=1,!!data.profileImage];
  return Math.round(c.filter(Boolean).length/c.length*100);
}
function getSkillSugg(skills) {
  const lo=skills.map(s=>s.toLowerCase());const out=new Set();
  for(const[k,v]of Object.entries(SKILL_MAP)){if(lo.some(s=>s.includes(k)))v.forEach(x=>{if(!lo.includes(x.toLowerCase()))out.add(x);});}  
  return[...out].slice(0,5);
}
function getMissingKw(data) {
  const txt=[data.summary,...data.experience.map(e=>e.description)].join(" ").toLowerCase();
  return["led","managed","optimized","delivered","collaborated","implemented","results","metrics"].filter(k=>!txt.includes(k)).slice(0,5);
}
async function aiImprove(text,type) {
  await new Promise(r=>setTimeout(r,1400));
  if(type==="summary")return"Results-driven professional with proven expertise in modern technologies. Demonstrated ability to deliver high-impact solutions, optimize performance by 40%+, and collaborate cross-functionally to achieve business objectives.";
  if(type==="experience")return text.split("\n").map(l=>l.trim()?"• "+l.replace(/^[•\-]\s*/,"").replace(/^(\w)/,c=>c.toUpperCase()):"").filter(Boolean).join("\n");
  return text+"\n• Improved performance by 35% through systematic code optimization\n• Implemented CI/CD pipeline reducing deployment time by 60%";
}
async function aiGenBullets(role) {
  await new Promise(r=>setTimeout(r,1200));
  const b={"Software Engineer":["• Architected microservices platform reducing system latency by 45%","• Led team of 6 engineers to deliver product feature 3 weeks ahead of schedule","• Optimized PostgreSQL queries improving response time by 60%","• Implemented CI/CD pipelines cutting deployment time from 2 hours to 15 minutes"],"Product Manager":["• Drove 35% increase in user retention through data-driven improvements","• Managed cross-functional team of 12 to launch 3 major features on time","• Conducted 50+ user interviews to define product roadmap and OKRs","• Increased NPS score from 32 to 67 within 6 months"],default:["• Delivered key projects 20% ahead of schedule through effective planning","• Collaborated with cross-functional teams to achieve all quarterly OKRs","• Improved process efficiency by 30% through systematic optimization","• Mentored 3 junior team members, accelerating their onboarding by 40%"]};
  return(b[role]||b.default).join("\n");
}
async function aiFullResume(role) {
  await new Promise(r=>setTimeout(r,2000));
  const d={"Software Engineer":{summary:"Results-driven Software Engineer with 4+ years of experience building scalable web applications and microservices. Proven track record of delivering high-impact solutions that improve performance by 40%+ and reduce operational costs. Passionate about clean code, system design, and mentoring junior developers.",skills:["JavaScript","TypeScript","React","Node.js","Python","PostgreSQL","Docker","AWS","GraphQL","Redis","Git","CI/CD"],experience:[{id:"e1",role:"Senior Software Engineer",company:"TechCorp Inc.",duration:"Jan 2022 – Present",description:"• Led development of microservices architecture serving 2M+ daily users\n• Reduced API response time by 60% through query optimization and caching\n• Mentored team of 4 junior engineers, improving sprint velocity by 35%\n• Implemented CI/CD pipelines cutting deployment time from 2 hours to 12 minutes"},{id:"e2",role:"Software Engineer",company:"StartupXYZ",duration:"Jun 2020 – Dec 2021",description:"• Built React dashboard used by 50,000+ customers, increasing engagement by 45%\n• Designed RESTful APIs handling 500K+ requests/day with 99.9% uptime\n• Collaborated with product team to ship 3 major features ahead of schedule"}],projects:[{id:"p1",name:"E-Commerce Platform",tech:"React, Node.js, PostgreSQL, Redis",link:"github.com/user/ecommerce",description:"• Full-stack platform with real-time inventory management and payment processing\n• Handles 10,000+ concurrent users with sub-200ms response times\n• Integrated Stripe payments processing $500K+ monthly transactions"},{id:"p2",name:"AI Resume Builder",tech:"React, Python, OpenAI API, AWS",link:"github.com/user/resume-ai",description:"• AI-powered resume builder with ATS optimization and real-time suggestions\n• Reduced resume creation time by 70% for 5,000+ users\n• Achieved 92% ATS pass rate across Fortune 500 job applications"}],education:[{id:"d1",degree:"B.Tech Computer Science",institution:"IIT Delhi",year:"2016–2020",gpa:"8.7"}],certifications:[{id:"c1",name:"AWS Solutions Architect",issuer:"Amazon",year:"2023"},{id:"c2",name:"Google Cloud Professional",issuer:"Google",year:"2022"}]},default:{summary:"Dedicated professional with 3+ years of experience delivering high-quality results in fast-paced environments. Proven ability to collaborate effectively with cross-functional teams, optimize processes by 30%+, and consistently exceed performance targets.",skills:["Communication","Problem Solving","Project Management","Data Analysis","Microsoft Office","Leadership","Agile","Critical Thinking"],experience:[{id:"e1",role:"Senior "+role,company:"Leading Company Ltd.",duration:"Jan 2022 – Present",description:"• Led key initiatives resulting in 25% improvement in team productivity\n• Collaborated with stakeholders to deliver projects 20% ahead of schedule\n• Implemented process improvements reducing operational costs by $150K annually\n• Mentored 3 junior team members, accelerating their professional development"},{id:"e2",role:role,company:"Growth Company Inc.",duration:"Jun 2019 – Dec 2021",description:"• Delivered 15+ successful projects with 98% client satisfaction rate\n• Optimized workflows reducing processing time by 40%\n• Contributed to team achieving 120% of annual revenue targets"}],projects:[{id:"p1",name:"Process Automation System",tech:"Python, Excel, SQL",link:"",description:"• Automated manual reporting saving 10 hours/week across the team\n• Reduced error rate by 85% through systematic validation checks"}],education:[{id:"d1",degree:"Bachelor of Science",institution:"State University",year:"2015–2019",gpa:"3.6"}],certifications:[{id:"c1",name:"Professional Certification",issuer:"Industry Body",year:"2022"}]}};
  return d[role]||d.default;
}

// ─── PREVIEW COMPONENTS ──────────────────────────────────────────
function ModernPreview({data,accent}){
  return(
    <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,lineHeight:1.6,color:"#1e1b4b",background:"#fff"}}>
      <div style={{background:"linear-gradient(135deg,"+accent+","+accent+"cc)",padding:"28px 32px"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          {data.profileImage&&<img src={data.profileImage} alt="" style={{width:68,height:68,borderRadius:"50%",border:"3px solid rgba(255,255,255,0.5)",objectFit:"cover",flexShrink:0}}/>}
          <div>
            <h1 style={{fontSize:24,fontWeight:800,color:"#fff",margin:0,letterSpacing:"-0.5px",lineHeight:1.2}}>{data.name||"Your Name"}</h1>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.85)",fontWeight:500,marginTop:4}}>{data.title||"Job Title"}</div>
            <div style={{display:"flex",gap:14,marginTop:6,fontSize:10,color:"rgba(255,255,255,0.7)",flexWrap:"wrap"}}>
              {data.email&&<span>✉ {data.email}</span>}{data.phone&&<span>📞 {data.phone}</span>}{data.location&&<span>📍 {data.location}</span>}
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"24px 32px 24px 32px"}}>
        {data.summary&&<div style={{marginBottom:18}}><h2 style={{fontSize:9,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:4,marginBottom:8}}>Summary</h2><p style={{fontSize:11,color:"#374151",lineHeight:1.7,margin:0}}>{data.summary}</p></div>}
        {data.skills.length>0&&<div style={{marginBottom:18}}><h2 style={{fontSize:9,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:4,marginBottom:8}}>Skills</h2><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{data.skills.map((s,i)=><span key={i} style={{background:accent+"15",border:"1px solid "+accent+"33",color:accent,padding:"3px 10px",borderRadius:12,fontSize:10,fontWeight:600}}>{s}</span>)}</div></div>}
        {data.experience.length>0&&<div style={{marginBottom:18}}><h2 style={{fontSize:9,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:4,marginBottom:8}}>Experience</h2>{data.experience.map((e,i)=><div key={i} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:2}}><div><div style={{fontWeight:700,fontSize:12,color:"#111827"}}>{e.role||"Role"}</div><div style={{fontSize:10,color:"#6b7280",marginTop:1}}>{e.company}</div></div><div style={{fontSize:9,color:"#9ca3af",whiteSpace:"nowrap",marginLeft:8}}>{e.duration}</div></div>{e.description&&e.description.split("\n").map((l,j)=>l.trim()&&<p key={j} style={{fontSize:10,color:"#4b5563",margin:"2px 0",lineHeight:1.5}}>{l}</p>)}</div>)}</div>}
        {data.projects.length>0&&<div style={{marginBottom:18}}><h2 style={{fontSize:9,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:4,marginBottom:8}}>Projects</h2>{data.projects.map((p,i)=><div key={i} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}><span style={{fontWeight:700,fontSize:11,color:"#111827"}}>{p.name||"Project"}</span>{p.link&&<span style={{fontSize:9,color:accent}}>{p.link}</span>}</div>{p.tech&&<div style={{fontSize:9,color:"#9ca3af",marginBottom:2}}>Stack: {p.tech}</div>}{p.description&&p.description.split("\n").map((l,j)=>l.trim()&&<p key={j} style={{fontSize:10,color:"#4b5563",margin:"1px 0",lineHeight:1.5}}>{l}</p>)}</div>)}</div>}
        {data.education.length>0&&<div style={{marginBottom:18}}><h2 style={{fontSize:9,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:4,marginBottom:8}}>Education</h2>{data.education.map((e,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div><div style={{fontWeight:700,fontSize:11,color:"#111827"}}>{e.degree}</div><div style={{fontSize:10,color:"#6b7280",marginTop:1}}>{e.institution}{e.gpa?" · GPA "+e.gpa:""}</div></div><div style={{fontSize:9,color:"#9ca3af",whiteSpace:"nowrap",marginLeft:8}}>{e.year}</div></div>)}</div>}
        {data.certifications.length>0&&<div><h2 style={{fontSize:9,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:4,marginBottom:8}}>Certifications</h2>{data.certifications.map((c,i)=><div key={i} style={{fontSize:10,color:"#374151",marginBottom:4,lineHeight:1.5}}><span style={{fontWeight:600}}>{c.name}</span>{c.issuer&&" — "+c.issuer}{c.year&&" ("+c.year+")"}</div>)}</div>}
      </div>
    </div>
  );
}

function ClassicPreview({data,accent}){
  return(
    <div style={{fontFamily:"Georgia,'Times New Roman',serif",fontSize:11,lineHeight:1.7,color:"#1a1a1a",background:"#fff",padding:"32px 36px"}}>
      <div style={{textAlign:"center",borderBottom:"3px double #1a1a1a",paddingBottom:16,marginBottom:16}}>
        {data.profileImage&&<img src={data.profileImage} alt="" style={{width:72,height:72,borderRadius:"50%",border:"3px solid #333",objectFit:"cover",marginBottom:8}}/>}
        <h1 style={{fontSize:26,fontWeight:700,color:"#1a1a1a",margin:"0 0 4px",letterSpacing:1,lineHeight:1.2}}>{data.name||"Your Name"}</h1>
        <div style={{fontSize:13,color:"#555",fontStyle:"italic",marginBottom:6}}>{data.title}</div>
        <div style={{display:"flex",justifyContent:"center",gap:16,fontSize:10,color:"#666",flexWrap:"wrap"}}>{data.email&&<span>{data.email}</span>}{data.phone&&<span>{data.phone}</span>}{data.location&&<span>{data.location}</span>}</div>
      </div>
      {data.summary&&<div style={{marginBottom:14}}><h2 style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:2,borderBottom:"1px solid #ccc",paddingBottom:4,marginBottom:8}}>Professional Summary</h2><p style={{fontSize:11,color:"#333",lineHeight:1.8,fontStyle:"italic",margin:0}}>{data.summary}</p></div>}
      {data.skills.length>0&&<div style={{marginBottom:14}}><h2 style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:2,borderBottom:"1px solid #ccc",paddingBottom:4,marginBottom:8}}>Core Competencies</h2><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"3px 8px"}}>{data.skills.map((s,i)=><span key={i} style={{fontSize:10,color:"#444"}}>▸ {s}</span>)}</div></div>}
      {data.experience.length>0&&<div style={{marginBottom:14}}><h2 style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:2,borderBottom:"1px solid #ccc",paddingBottom:4,marginBottom:8}}>Professional Experience</h2>{data.experience.map((e,i)=><div key={i} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:12}}>{e.role}</span><span style={{fontSize:10,color:"#666",fontStyle:"italic"}}>{e.duration}</span></div><div style={{fontSize:11,color:"#555",fontStyle:"italic",marginBottom:4}}>{e.company}</div>{e.description&&e.description.split("\n").map((l,j)=>l.trim()&&<p key={j} style={{fontSize:10,color:"#444",margin:"2px 0",lineHeight:1.5}}>{l}</p>)}</div>)}</div>}
      {data.education.length>0&&<div style={{marginBottom:14}}><h2 style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:2,borderBottom:"1px solid #ccc",paddingBottom:4,marginBottom:8}}>Education</h2>{data.education.map((e,i)=><div key={i} style={{marginBottom:8,display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:11}}>{e.degree}</div><div style={{fontSize:10,color:"#666",fontStyle:"italic"}}>{e.institution}{e.gpa?" | GPA: "+e.gpa:""}</div></div><div style={{fontSize:10,color:"#888"}}>{e.year}</div></div>)}</div>}
      {data.certifications.length>0&&<div><h2 style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:2,borderBottom:"1px solid #ccc",paddingBottom:4,marginBottom:8}}>Certifications</h2>{data.certifications.map((c,i)=><div key={i} style={{fontSize:10,color:"#444",marginBottom:3}}><span style={{fontWeight:600}}>{c.name}</span>{c.issuer&&" — "+c.issuer}{c.year&&" ("+c.year+")"}</div>)}</div>}
    </div>
  );
}

function MinimalPreview({data,accent}){
  return(
    <div style={{fontFamily:"'Inter','Helvetica Neue',sans-serif",fontSize:11,lineHeight:1.7,color:"#222",background:"#fff",padding:"32px 36px"}}>
      <div style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          {data.profileImage&&<img src={data.profileImage} alt="" style={{width:56,height:56,borderRadius:8,objectFit:"cover",flexShrink:0}}/>}
          <div><h1 style={{fontSize:22,fontWeight:700,color:"#111",margin:0,lineHeight:1.2}}>{data.name||"Your Name"}</h1><div style={{fontSize:12,color:"#666",marginTop:3}}>{data.title}</div></div>
        </div>
        <div style={{display:"flex",gap:16,marginTop:8,fontSize:10,color:"#888",flexWrap:"wrap"}}>{data.email&&<span>{data.email}</span>}{data.phone&&<span>{data.phone}</span>}{data.location&&<span>{data.location}</span>}</div>
        <div style={{height:2,background:accent,marginTop:12,borderRadius:1}}/>
      </div>
      {data.summary&&<div style={{marginBottom:16}}><h2 style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:"#999",marginBottom:6}}>About</h2><p style={{fontSize:11,color:"#444",lineHeight:1.8,margin:0}}>{data.summary}</p></div>}
      {data.skills.length>0&&<div style={{marginBottom:16}}><h2 style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:"#999",marginBottom:6}}>Skills</h2><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{data.skills.map((s,i)=><span key={i} style={{background:"#f3f4f6",padding:"3px 9px",borderRadius:4,fontSize:10,color:"#555"}}>{s}</span>)}</div></div>}
      {data.experience.length>0&&<div style={{marginBottom:16}}><h2 style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:"#999",marginBottom:6}}>Experience</h2>{data.experience.map((e,i)=><div key={i} style={{marginBottom:12,paddingLeft:12,borderLeft:"2px solid "+accent+"55"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600,fontSize:11}}>{e.role}</span><span style={{fontSize:9,color:"#aaa"}}>{e.duration}</span></div><div style={{fontSize:10,color:"#888",marginBottom:3}}>{e.company}</div>{e.description&&e.description.split("\n").map((l,j)=>l.trim()&&<p key={j} style={{fontSize:10,color:"#555",margin:"1px 0",lineHeight:1.5}}>{l}</p>)}</div>)}</div>}
      {data.projects.length>0&&<div style={{marginBottom:16}}><h2 style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:"#999",marginBottom:6}}>Projects</h2>{data.projects.map((p,i)=><div key={i} style={{marginBottom:10,paddingLeft:12,borderLeft:"2px solid "+accent+"55"}}><span style={{fontWeight:600,fontSize:11}}>{p.name}</span>{p.tech&&<span style={{fontSize:9,color:"#aaa"}}> · {p.tech}</span>}{p.description&&p.description.split("\n").map((l,j)=>l.trim()&&<p key={j} style={{fontSize:10,color:"#555",margin:"1px 0",lineHeight:1.5}}>{l}</p>)}</div>)}</div>}
      {data.education.length>0&&<div style={{marginBottom:16}}><h2 style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:"#999",marginBottom:6}}>Education</h2>{data.education.map((e,i)=><div key={i} style={{marginBottom:8,display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:600,fontSize:11}}>{e.degree}</div><div style={{fontSize:10,color:"#888"}}>{e.institution}{e.gpa?" · GPA "+e.gpa:""}</div></div><div style={{fontSize:9,color:"#aaa"}}>{e.year}</div></div>)}</div>}
      {data.certifications.length>0&&<div><h2 style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:"#999",marginBottom:6}}>Certifications</h2>{data.certifications.map((c,i)=><div key={i} style={{fontSize:10,color:"#555",marginBottom:3}}>{c.name}{c.issuer&&" · "+c.issuer}{c.year&&" ("+c.year+")"}</div>)}</div>}
    </div>
  );
}

function SidebarPreview({data,accent}){
  return(
    <div style={{display:"flex",height:"100%",fontFamily:"'Inter',sans-serif",fontSize:11,lineHeight:1.6,color:"#1e1b4b",background:"#fff"}}>
      <div style={{width:"34%",background:accent,padding:"24px 14px",display:"flex",flexDirection:"column",gap:10,color:"#fff",flexShrink:0}}>
        {data.profileImage?<img src={data.profileImage} alt="" style={{width:56,height:56,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(255,255,255,0.5)",margin:"0 auto 8px"}}/>:<div style={{width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,0.2)",margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>}
        <div style={{textAlign:"center",marginBottom:6}}><div style={{fontWeight:800,fontSize:13,lineHeight:1.2}}>{data.name||"Your Name"}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.8)",marginTop:3}}>{data.title||"Job Title"}</div></div>
        {data.email&&<div style={{fontSize:8,color:"rgba(255,255,255,0.75)",wordBreak:"break-all"}}>✉ {data.email}</div>}
        {data.phone&&<div style={{fontSize:8,color:"rgba(255,255,255,0.75)"}}>📞 {data.phone}</div>}
        {data.location&&<div style={{fontSize:8,color:"rgba(255,255,255,0.75)"}}>📍 {data.location}</div>}
        {data.skills.length>0&&<div style={{marginTop:8}}><div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,0.6)",marginBottom:6}}>Skills</div>{data.skills.slice(0,8).map((s,i)=><div key={i} style={{fontSize:8,color:"rgba(255,255,255,0.85)",padding:"2px 0",borderBottom:"1px solid rgba(255,255,255,0.15)"}}>{s}</div>)}</div>}
      </div>
      <div style={{flex:1,padding:"20px 16px",display:"flex",flexDirection:"column",gap:12,overflow:"hidden"}}>
        {data.summary&&<div><div style={{fontSize:8,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:3,marginBottom:6}}>Summary</div><p style={{fontSize:10,color:"#444",lineHeight:1.6,margin:0}}>{data.summary}</p></div>}
        {data.experience.length>0&&<div><div style={{fontSize:8,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:3,marginBottom:6}}>Experience</div>{data.experience.map((e,i)=><div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{fontWeight:700,fontSize:11,color:"#111"}}>{e.role||"Role"}</div><div style={{fontSize:8,color:"#888",whiteSpace:"nowrap",marginLeft:4}}>{e.duration}</div></div><div style={{fontSize:9,color:"#666",marginBottom:2}}>{e.company}</div>{e.description&&e.description.split("\n").map((l,j)=>l.trim()&&<p key={j} style={{fontSize:9,color:"#555",margin:"1px 0",lineHeight:1.5}}>{l}</p>)}</div>)}</div>}
        {data.education.length>0&&<div><div style={{fontSize:8,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:3,marginBottom:6}}>Education</div>{data.education.map((e,i)=><div key={i} style={{marginBottom:6,display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:10}}>{e.degree}</div><div style={{fontSize:9,color:"#666"}}>{e.institution}</div></div><div style={{fontSize:8,color:"#888"}}>{e.year}</div></div>)}</div>}
      </div>
    </div>
  );
}

function DarkPreview({data,accent}){
  return(
    <div style={{display:"flex",height:"100%",fontFamily:"'Inter',sans-serif",fontSize:11,lineHeight:1.6,background:"#0f172a"}}>
      <div style={{width:"36%",background:"#1e293b",padding:"20px 12px",display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
        <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,"+accent+","+accent+"88)",margin:"0 auto 6px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 16px "+accent+"66",overflow:"hidden"}}>{data.profileImage?<img src={data.profileImage} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"👤"}</div>
        <div style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:12,color:"#fff"}}>{data.name||"Your Name"}</div><div style={{fontSize:9,color:accent,marginTop:2}}>{data.title||"Job Title"}</div></div>
        {data.email&&<div style={{fontSize:8,color:"#94a3b8",wordBreak:"break-all"}}>✉ {data.email}</div>}
        {data.skills.length>0&&<div style={{marginTop:6}}><div style={{fontSize:7,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:accent,marginBottom:5}}>Skills</div>{data.skills.slice(0,7).map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}><div style={{width:5,height:5,borderRadius:"50%",background:accent,flexShrink:0}}/><span style={{fontSize:8,color:"#cbd5e1"}}>{s}</span></div>)}</div>}
      </div>
      <div style={{flex:1,padding:"18px 14px",display:"flex",flexDirection:"column",gap:10}}>
        <div style={{borderBottom:"1px solid "+accent+"44",paddingBottom:8,marginBottom:2}}><div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{data.name||"Your Name"}</div><div style={{fontSize:10,color:accent}}>{data.title||"Job Title"}</div></div>
        {data.summary&&<div><div style={{fontSize:7,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:accent,marginBottom:4,borderBottom:"1px solid "+accent+"33",paddingBottom:2}}>Summary</div><p style={{fontSize:9,color:"#94a3b8",lineHeight:1.6,margin:0}}>{data.summary}</p></div>}
        {data.experience.length>0&&<div><div style={{fontSize:7,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:accent,marginBottom:4,borderBottom:"1px solid "+accent+"33",paddingBottom:2}}>Experience</div>{data.experience.map((e,i)=><div key={i} style={{marginBottom:7}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontWeight:700,fontSize:10,color:"#e2e8f0"}}>{e.role||"Role"}</div><div style={{fontSize:8,color:"#64748b"}}>{e.duration}</div></div><div style={{fontSize:9,color:accent+"cc",marginBottom:2}}>{e.company}</div>{e.description&&e.description.split("\n").map((l,j)=>l.trim()&&<p key={j} style={{fontSize:8,color:"#94a3b8",margin:"1px 0"}}>{l}</p>)}</div>)}</div>}
        {data.education.length>0&&<div><div style={{fontSize:7,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:accent,marginBottom:4,borderBottom:"1px solid "+accent+"33",paddingBottom:2}}>Education</div>{data.education.map((e,i)=><div key={i} style={{marginBottom:5,display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:9,color:"#e2e8f0"}}>{e.degree}</div><div style={{fontSize:8,color:"#64748b"}}>{e.institution}</div></div><div style={{fontSize:8,color:"#64748b"}}>{e.year}</div></div>)}</div>}
      </div>
    </div>
  );
}

function DiagonalPreview({data,accent}){
  return(
    <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,lineHeight:1.6,color:"#1e1b4b",background:"#fff",position:"relative",overflow:"hidden",minHeight:"297mm"}}>
      <div style={{background:"linear-gradient(135deg,"+accent+","+accent+"cc)",padding:"28px 28px 56px",clipPath:"polygon(0 0,100% 0,100% 72%,0 100%)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          {data.profileImage?<img src={data.profileImage} alt="" style={{width:60,height:60,borderRadius:"50%",border:"3px solid rgba(255,255,255,0.6)",objectFit:"cover",flexShrink:0}}/>:<div style={{width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>👤</div>}
          <div><h1 style={{fontSize:20,fontWeight:800,color:"#fff",margin:0}}>{data.name||"Your Name"}</h1><div style={{fontSize:12,color:"rgba(255,255,255,0.85)",marginTop:3}}>{data.title||"Job Title"}</div><div style={{display:"flex",gap:10,marginTop:5,fontSize:8,color:"rgba(255,255,255,0.7)",flexWrap:"wrap"}}>{data.email&&<span>✉ {data.email}</span>}{data.phone&&<span>📞 {data.phone}</span>}</div></div>
        </div>
      </div>
      <div style={{padding:"9px 20px",marginTop:-16}}>
        {data.skills.length>0&&<div style={{marginBottom:12}}><h2 style={{fontSize:8,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:3,marginBottom:6}}>Skills</h2><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{data.skills.map((s,i)=><span key={i} style={{background:accent+"18",border:"1px solid "+accent+"44",color:accent,padding:"2px 7px",borderRadius:10,fontSize:9,fontWeight:600}}>{s}</span>)}</div></div>}
        {data.summary&&<div style={{marginBottom:12}}><h2 style={{fontSize:8,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:3,marginBottom:6}}>Summary</h2><p style={{fontSize:10,color:"#444",lineHeight:1.6,margin:0}}>{data.summary}</p></div>}
        {data.experience.length>0&&<div style={{marginBottom:12}}><h2 style={{fontSize:8,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:3,marginBottom:6}}>Experience</h2>{data.experience.map((e,i)=><div key={i} style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontWeight:700,fontSize:11}}>{e.role||"Role"}</div><div style={{fontSize:8,color:"#888"}}>{e.duration}</div></div><div style={{fontSize:9,color:"#666",marginBottom:2}}>{e.company}</div>{e.description&&e.description.split("\n").map((l,j)=>l.trim()&&<p key={j} style={{fontSize:9,color:"#555",margin:"1px 0"}}>{l}</p>)}</div>)}</div>}
        {data.education.length>0&&<div><h2 style={{fontSize:8,fontWeight:800,color:accent,textTransform:"uppercase",letterSpacing:1.5,borderBottom:"2px solid "+accent,paddingBottom:3,marginBottom:6}}>Education</h2>{data.education.map((e,i)=><div key={i} style={{marginBottom:6,display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:10}}>{e.degree}</div><div style={{fontSize:9,color:"#666"}}>{e.institution}</div></div><div style={{fontSize:8,color:"#888"}}>{e.year}</div></div>)}</div>}
      </div>
    </div>
  );
}

function GlassPreview({data,accent}){
  return(
    <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,lineHeight:1.6,background:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)",minHeight:"297mm",padding:"20px"}}>
      <div style={{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(20px)",borderRadius:14,padding:"18px",marginBottom:14,border:"1px solid rgba(255,255,255,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>{data.profileImage?<img src={data.profileImage} alt="" style={{width:56,height:56,borderRadius:"50%",border:"3px solid rgba(255,255,255,0.6)",objectFit:"cover",flexShrink:0}}/>:<div style={{width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👤</div>}<div><h1 style={{fontSize:18,fontWeight:800,color:"#fff",margin:0}}>{data.name||"Your Name"}</h1><div style={{fontSize:11,color:"rgba(255,255,255,0.85)",marginTop:2}}>{data.title||"Job Title"}</div><div style={{display:"flex",gap:8,marginTop:4,fontSize:8,color:"rgba(255,255,255,0.7)",flexWrap:"wrap"}}>{data.email&&<span>✉ {data.email}</span>}{data.phone&&<span>📞 {data.phone}</span>}</div></div></div>
      </div>
      {data.skills.length>0&&<div style={{background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",borderRadius:10,padding:"12px",marginBottom:10,border:"1px solid rgba(255,255,255,0.2)"}}><div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,0.7)",marginBottom:7}}>Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{data.skills.map((s,i)=><span key={i} style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",padding:"2px 7px",borderRadius:8,fontSize:8,fontWeight:600}}>{s}</span>)}</div></div>}
      {data.summary&&<div style={{background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",borderRadius:10,padding:"12px",marginBottom:10,border:"1px solid rgba(255,255,255,0.2)"}}><div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,0.7)",marginBottom:5}}>Summary</div><p style={{fontSize:9,color:"rgba(255,255,255,0.9)",lineHeight:1.6,margin:0}}>{data.summary}</p></div>}
      {data.experience.length>0&&<div style={{background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",borderRadius:10,padding:"12px",marginBottom:10,border:"1px solid rgba(255,255,255,0.2)"}}><div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,0.7)",marginBottom:7}}>Experience</div>{data.experience.map((e,i)=><div key={i} style={{marginBottom:7}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontWeight:700,fontSize:10,color:"#fff"}}>{e.role||"Role"}</div><div style={{fontSize:8,color:"rgba(255,255,255,0.6)"}}>{e.duration}</div></div><div style={{fontSize:9,color:"rgba(255,255,255,0.75)",marginBottom:2}}>{e.company}</div>{e.description&&e.description.split("\n").map((l,j)=>l.trim()&&<p key={j} style={{fontSize:8,color:"rgba(255,255,255,0.7)",margin:"1px 0"}}>{l}</p>)}</div>)}</div>}
      {data.education.length>0&&<div style={{background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",borderRadius:10,padding:"12px",border:"1px solid rgba(255,255,255,0.2)"}}><div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:"rgba(255,255,255,0.7)",marginBottom:7}}>Education</div>{data.education.map((e,i)=><div key={i} style={{marginBottom:5,display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:9,color:"#fff"}}>{e.degree}</div><div style={{fontSize:8,color:"rgba(255,255,255,0.7)"}}>{e.institution}</div></div><div style={{fontSize:8,color:"rgba(255,255,255,0.6)"}}>{e.year}</div></div>)}</div>}
    </div>
  );
}

function ElegantPreview({data,accent}){
  return(
    <div style={{fontFamily:"Georgia,'Times New Roman',serif",fontSize:11,lineHeight:1.7,color:"#1a1a1a",background:"#fffbf0",padding:"32px 36px"}}>
      <div style={{textAlign:"center",borderBottom:"3px double "+accent,paddingBottom:16,marginBottom:16}}>
        {data.profileImage&&<img src={data.profileImage} alt="" style={{width:68,height:68,borderRadius:"50%",border:"3px solid "+accent,objectFit:"cover",marginBottom:8}}/>}
        <h1 style={{fontSize:24,fontWeight:700,color:"#1a1a1a",margin:"0 0 4px",letterSpacing:2,lineHeight:1.2}}>{data.name||"Your Name"}</h1>
        <div style={{fontSize:12,color:accent,fontStyle:"italic",marginBottom:6,letterSpacing:1}}>{data.title||"Job Title"}</div>
        <div style={{display:"flex",justifyContent:"center",gap:14,fontSize:9,color:"#666",flexWrap:"wrap"}}>{data.email&&<span>✉ {data.email}</span>}{data.phone&&<span>✆ {data.phone}</span>}{data.location&&<span>⌖ {data.location}</span>}</div>
      </div>
      {data.summary&&<div style={{marginBottom:14}}><h2 style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:3,color:accent,marginBottom:7,borderBottom:"1px solid "+accent+"55",paddingBottom:4}}>Profile</h2><p style={{fontSize:10,color:"#333",lineHeight:1.8,fontStyle:"italic",margin:0}}>{data.summary}</p></div>}
      {data.skills.length>0&&<div style={{marginBottom:14}}><h2 style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:3,color:accent,marginBottom:7,borderBottom:"1px solid "+accent+"55",paddingBottom:4}}>Expertise</h2><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"3px 8px"}}>{data.skills.map((s,i)=><span key={i} style={{fontSize:9,color:"#444"}}>◆ {s}</span>)}</div></div>}
      {data.experience.length>0&&<div style={{marginBottom:14}}><h2 style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:3,color:accent,marginBottom:7,borderBottom:"1px solid "+accent+"55",paddingBottom:4}}>Career History</h2>{data.experience.map((e,i)=><div key={i} style={{marginBottom:11}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:11}}>{e.role}</span><span style={{fontSize:9,color:"#666",fontStyle:"italic"}}>{e.duration}</span></div><div style={{fontSize:10,color:accent,fontStyle:"italic",marginBottom:3}}>{e.company}</div>{e.description&&e.description.split("\n").map((l,j)=>l.trim()&&<p key={j} style={{fontSize:9,color:"#444",margin:"2px 0"}}>{l}</p>)}</div>)}</div>}
      {data.education.length>0&&<div><h2 style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:3,color:accent,marginBottom:7,borderBottom:"1px solid "+accent+"55",paddingBottom:4}}>Education</h2>{data.education.map((e,i)=><div key={i} style={{marginBottom:7,display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:10}}>{e.degree}</div><div style={{fontSize:9,color:"#666",fontStyle:"italic"}}>{e.institution}{e.gpa?" | GPA: "+e.gpa:""}</div></div><div style={{fontSize:9,color:"#888"}}>{e.year}</div></div>)}</div>}
    </div>
  );
}

// ─── SMALL ATOMS ─────────────────────────────────────────────────
function SortSec({id,children}){
  const{attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id});
  return <div ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition,opacity:isDragging?0.4:1,zIndex:isDragging?999:"auto"}} {...attributes}><div className="group relative"><button {...listeners} className="absolute -left-6 top-4 opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing text-slate-500 hover:text-indigo-400 transition-all text-xl select-none">⠿</button>{children}</div></div>;
}
function Chip({skill,onRemove,accent}){
  return <motion.span layout initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}} whileHover={{scale:1.08}} className="inline-flex items-center gap-0.5 rounded-full font-semibold" style={{fontSize:"10px",padding:"2px 7px",background:accent+"18",border:"1px solid "+accent+"44",color:accent}}>{skill}{onRemove&&<button onClick={()=>onRemove(skill)} className="ml-0.5 w-3 h-3 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all" style={{fontSize:"9px",lineHeight:1}}>×</button>}</motion.span>;
}
function FIn({label,value,onChange,placeholder,type="text",rows=3,multi=false,accent="#6366f1"}){
  const cls="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 resize-none border bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";
  return <div className="mb-4">{label&&<label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-widest">{label}</label>}{multi?<textarea className={cls} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}/>:<input type={type} className={cls} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>}</div>;
}
function SecHead({icon,title,onAdd,addLabel,collapsed,onToggle}){
  return <div className="flex items-center justify-between mb-5"><button onClick={onToggle} className="flex items-center gap-2.5 group"><span className="text-lg">{icon}</span><span className="text-sm font-bold text-white/60 uppercase tracking-widest group-hover:text-white/90 transition-colors">{title}</span><span className="text-white/20 text-xs ml-1">{collapsed?"▶":"▼"}</span></button>{onAdd&&<motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={onAdd} style={{padding:"6px 14px"}} className="text-xs rounded-full border border-white/10 text-white/40 hover:border-indigo-500/60 hover:text-indigo-400 transition-all">+ {addLabel}</motion.button>}</div>;
}
function ATSRing({score}){
  const r=36,circ=2*Math.PI*r,color=score>=75?"#10b981":score>=50?"#f59e0b":"#f43f5e";
  return <div className="relative inline-flex items-center justify-center"><svg width={88} height={88} style={{transform:"rotate(-90deg)"}}><circle cx={44} cy={44} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8}/><motion.circle cx={44} cy={44} r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" initial={{strokeDasharray:"0 "+circ}} animate={{strokeDasharray:(score/100)*circ+" "+circ}} transition={{duration:1.4,ease:"easeOut"}} style={{filter:"drop-shadow(0 0 8px "+color+")"}}/></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-lg font-black" style={{color}}>{score}</span><span className="text-[9px] text-white/30 font-bold tracking-wider">ATS</span></div></div>;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function ResumeBuilder({user={},initTemplate,initAccent,onBack}){
  const[dark,setDark]=useState(true);
  const[tpl,setTpl]=useState(initTemplate||"modern");
  const[accent,setAccent]=useState(initAccent||"#6366f1");
  const[col,setCol]=useState({});
  const[aiL,setAiL]=useState({});
  const[tipI,setTipI]=useState(0);
  const[skIn,setSkIn]=useState("");
  const[secOrd,setSecOrd]=useState(["experience","projects","education","certifications"]);
  const[pdfL,setPdfL]=useState(false);
  const[toast,setToast]=useState(null);
  const[scale,setScale]=useState(0.70);
  const[fixPanel,setFixPanel]=useState(false);
  const[grammarFixes,setGrammarFixes]=useState([]);
  const[fixingGrammar,setFixingGrammar]=useState(false);
  const[appliedFixes,setAppliedFixes]=useState({});
  const[showTipsPanel,setShowTipsPanel]=useState(false);
  const[uploadedFileName,setUploadedFileName]=useState(null);
  const[isParsingResume,setIsParsingResume]=useState(false);
  const prvRef=useRef(null);
  const imgRef=useRef(null);
  const fileInputRef=useRef(null);

  // SINGLE SOURCE OF TRUTH - updatedResumeData tracks ALL changes
  const[updatedResumeData,setUpdatedResumeData]=useState({
    name:user.name||"",title:"Software Engineer",email:user.email||"",phone:"",location:"",summary:"",profileImage:null,
    skills:user.skills?Object.keys(user.skills).filter(k=>(user.skills[k]||0)>=50):[],
    experience:[{id:"e1",role:"",company:"",duration:"",description:""}],
    projects:[{id:"p1",name:"",tech:"",link:"",description:""}],
    education:[{id:"d1",degree:"",institution:"",year:"",gpa:""}],
    certifications:[{id:"c1",name:"",issuer:"",year:""}],
  });

  // Use updatedResumeData as the main data source
  const data = updatedResumeData;
  const setData = setUpdatedResumeData;
  
  const ats=calcATS(data);
  const done=calcDone(data);
  const sugg=getSkillSugg(data.skills);
  const mkw=getMissingKw(data);
  const showT=useCallback((m,t="ok")=>{setToast({m,t});setTimeout(()=>setToast(null),3500);},[]);
  const upd=useCallback((f,v)=>setData(p=>({...p,[f]:v})),[]);
  const updI=useCallback((s,id,f,v)=>setData(p=>({...p,[s]:p[s].map(x=>x.id===id?{...x,[f]:v}:x)})),[]);
  const addI=useCallback((s,t)=>setData(p=>({...p,[s]:[...p[s],{id:s+Date.now(),...t}]})),[]);
  const remI=useCallback((s,id)=>setData(p=>({...p,[s]:p[s].filter(x=>x.id!==id)})),[]);
  const togC=useCallback(k=>setCol(p=>({...p,[k]:!p[k]})),[]);
  function onSkKey(e){
    if((e.key==="Enter"||e.key===",")&&skIn.trim()){e.preventDefault();const s=skIn.trim().replace(/,$/,"");if(s&&!data.skills.includes(s))upd("skills",[...data.skills,s]);setSkIn("");}
    if(e.key==="Backspace"&&!skIn&&data.skills.length>0)upd("skills",data.skills.slice(0,-1));
  }
  
  function onImg(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>upd("profileImage",ev.target.result);r.readAsDataURL(f);}

  // ✅ FIX #1: UPLOAD AND PARSE REAL RESUME
  async function handleResumeUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsParsingResume(true);
    setUploadedFileName(file.name);
    
    try {
      // Parse the uploaded file
      const parsedData = await parseResumeFile(file);
      
      if (!parsedData) {
        showT("Could not parse resume file", "err");
        setIsParsingResume(false);
        return;
      }
      
      // Merge parsed data with existing data - preserve custom changes
      setData(prev => ({
        ...prev,
        name: parsedData.name || prev.name,
        title: parsedData.title || prev.title,
        email: parsedData.email || prev.email,
        phone: parsedData.phone || prev.phone,
        location: parsedData.location || prev.location,
        summary: parsedData.summary || prev.summary,
        skills: parsedData.skills?.length > 0 ? parsedData.skills : prev.skills,
        experience: parsedData.experience?.length > 0 ? parsedData.experience : prev.experience,
        projects: parsedData.projects?.length > 0 ? parsedData.projects : prev.projects,
        education: parsedData.education?.length > 0 ? parsedData.education : prev.education,
        certifications: parsedData.certifications?.length > 0 ? parsedData.certifications : prev.certifications,
      }));
      
      showT("✅ Resume uploaded and parsed successfully!", "ok");
      
      // Trigger analysis after parsing
      setTimeout(() => {
        analyzeResume();
      }, 500);
    } catch (err) {
      console.error("Upload error:", err);
      showT("Error uploading resume", "err");
    } finally {
      setIsParsingResume(false);
    }
  }

  // ✅ FIX #2: ANALYZE RESUME BASED ON REAL CONTENT (Not fake data)
  async function analyzeResume(){
    setFixingGrammar(true);
    setFixPanel(true);
    await new Promise(r=>setTimeout(r,1800));
    
    const issues=[];
    
    // Check summary - based on ACTUAL content
    if(data.summary&&data.summary.length>0){
      if(!data.summary.match(/\d+%|\d+x|\$\d+/)){
        const improved = data.summary.replace(/\./,".")+" Delivered measurable results with 30%+ improvement in key performance indicators.";
        issues.push({
          id:"sum1",
          section:"Summary",
          field:"summary",
          type:"⚠ No metrics",
          original:data.summary,
          fixed:improved
        });
      }
      if(data.summary.toLowerCase().includes("responsible for")){
        const improved = data.summary.replace(/responsible for/gi,"led and delivered");
        issues.push({
          id:"sum2",
          section:"Summary",
          field:"summary",
          type:"⚠ Weak phrasing",
          original:data.summary,
          fixed:improved
        });
      }
    }
    
    // Check experience - based on ACTUAL content from resume
    data.experience.forEach((exp,i)=>{
      if(exp.description){
        if(!exp.description.includes("•")&&exp.description.length>20){
          const fixed = exp.description.split("\n").map(l=>l.trim()?"• "+l.replace(/^[•\-]\s*/,"").replace(/^(\w)/,c=>c.toUpperCase()):"").filter(Boolean).join("\n");
          issues.push({
            id:"exp"+i,
            section:"Experience: "+exp.role,
            field:"exp_desc",
            expId:exp.id,
            type:"⚠ Missing bullet points",
            original:exp.description,
            fixed:fixed
          });
        }
        if(exp.description.toLowerCase().includes("helped with")||exp.description.toLowerCase().includes("worked on")){
          const fixed=exp.description.replace(/helped with/gi,"delivered").replace(/worked on/gi,"developed and launched");
          issues.push({
            id:"exp_weak"+i,
            section:"Experience: "+exp.role,
            field:"exp_desc",
            expId:exp.id,
            type:"⚠ Weak action verbs",
            original:exp.description,
            fixed:fixed
          });
        }
      }
    });
    
    // Check skills count
    if(data.skills.length<5){
      const suggested = [...data.skills,...(sugg.filter(s=>!data.skills.includes(s)).slice(0,5))];
      issues.push({
        id:"skills1",
        section:"Skills",
        field:"skills",
        type:"⚠ Too few skills",
        original:data.skills.join(", "),
        fixed:suggested.join(", ")
      });
    }
    
    setGrammarFixes(issues.length>0?issues:[{
      id:"ok",
      section:"All sections",
      field:"",
      type:"✅ Looks good!",
      original:"Your resume is well-structured.",
      fixed:"No major issues found. Consider adding more quantified achievements."
    }]);
    setFixingGrammar(false);
  }

  // ✅ FIX #3: APPLY FIX - Update ONLY that specific line in updatedResumeData
  function applyFix(fix){
    if(!fix.field) return; // Skip info-only entries
    
    if(fix.field==="summary"){
      upd("summary",fix.fixed);
    }
    else if(fix.field==="exp_desc"){
      updI("experience",fix.expId,"description",fix.fixed);
    }
    else if(fix.field==="skills"){
      upd("skills",fix.fixed.split(", ").map(s=>s.trim()).filter(Boolean));
    }
    
    setAppliedFixes(p=>({...p,[fix.id]:true}));
    
    // Recalculate ATS score after applying fix
    setTimeout(() => {
      showT("✅ Fix applied and resume updated!", "ok");
    }, 100);
  }

  function applyAllFixes(){
    grammarFixes.forEach(fix=>{if(!appliedFixes[fix.id]&&fix.field)applyFix(fix);});
    showT("✅ All fixes applied to resume!", "ok");
  }
  // ✅ FIX #4: DOWNLOAD FUNCTION - USE updatedResumeData (NOT blank/initial state)
  async function doPDF(){
    setPdfL(true);
    try{
      const h=(await import("html2pdf.js")).default;
      const el=prvRef.current;
      if(!el){showT("Preview not ready","err");return;}
      const filename = (updatedResumeData.name || "resume").replace(/[^a-z0-9]/gi, '_') + ".pdf";
      await h().set({
        margin:0,
        filename:filename,
        image:{type:"jpeg",quality:0.98},
        html2canvas:{scale:2,useCORS:true,logging:false},
        jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}
      }).from(el).save();
      showT("📥 PDF downloaded! ✨", "ok");
    }catch(err){
      console.error(err);
      showT("Export failed","err");
    }finally{
      setPdfL(false);
    }
  }

  // AI Enhancement function for real data
  async function doAI(type,id){
    const k=id||type;
    setAiL(p=>({...p,[k]:true}));
    try{
      if(type==="full"){
        const g=await aiFullResume(data.title||"Software Engineer");
        // Update updatedResumeData with AI-generated content
        setData(p=>({
          ...p,
          summary:g.summary,
          skills:g.skills,
          experience:g.experience,
          projects:g.projects,
          education:g.education,
          certifications:g.certifications
        }));
        showT("✨ Full resume generated! Click any section to edit.", "ok");
      }else if(type==="summary"){
        const improved = await aiImprove(data.summary,"summary");
        upd("summary",improved);
        showT("✨ Summary improved!", "ok");
      }
      else if(type==="exp"){
        const e=data.experience.find(x=>x.id===id);
        if(e){
          const improved = await aiImprove(e.description,"experience");
          updI("experience",id,"description",improved);
          showT("✨ Experience bullets improved!", "ok");
        }
      }
      else if(type==="proj"){
        const p=data.projects.find(x=>x.id===id);
        if(p){
          const improved = await aiImprove(p.description,"project");
          updI("projects",id,"description",improved);
          showT("✨ Project description improved!", "ok");
        }
      }
      else if(type==="bul"){
        const e=data.experience.find(x=>x.id===id);
        if(e){
          const bullets = await aiGenBullets(e?.role);
          updI("experience",id,"description",bullets);
          showT("⚡ Auto bullets generated!", "ok");
        }
      }
    }finally{
      setAiL(p=>({...p,[k]:false}));
    }
  }
  const sens=useSensors(useSensor(PointerSensor),useSensor(KeyboardSensor,{coordinateGetter:sortableKeyboardCoordinates}));
  function onDrag({active,over}){if(active.id!==over?.id)setSecOrd(p=>arrayMove(p,p.indexOf(active.id),p.indexOf(over.id)));}
  useEffect(()=>{const t=setInterval(()=>setTipI(i=>(i+1)%RESUME_TIPS.length),5000);return()=>clearInterval(t);},[]);
  useEffect(()=>{function r(){const w=window.innerWidth;setScale(w<1280?0.60:w<1536?0.65:0.70);}r();window.addEventListener("resize",r);return()=>window.removeEventListener("resize",r);},[]);
  const bg=dark?"bg-gradient-to-br from-[#05071a] via-[#0c0f2e] to-[#130a2e]":"bg-gradient-to-br from-slate-50 via-white to-indigo-50";
  const card=dark?"bg-white/5 border-white/10":"bg-white border-gray-200";
  const tp=dark?"text-white":"text-gray-900";
  const tm=dark?"text-white/40":"text-gray-500";
  const inp=dark?"bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20":"bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
  const iCls="w-full rounded-xl text-sm border outline-none transition-all duration-200 leading-relaxed "+inp;
  const tCls=iCls+" resize-none leading-relaxed";
  const iStyle={padding:"10px 18px"};

  return(
    <div className={"min-h-screen "+bg+" transition-colors duration-500"}>
      {/* BG blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{x:[0,30,0],y:[0,-20,0]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut"}} className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{background:"radial-gradient(circle,"+accent+",transparent)"}}/>
        <motion.div animate={{x:[0,-20,0],y:[0,30,0]}} transition={{duration:10,repeat:Infinity,ease:"easeInOut",delay:2}} className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{background:"radial-gradient(circle,#6366f1,transparent)"}}/>
      </div>
      {/* Toast */}
      <AnimatePresence>{toast&&(<motion.div initial={{opacity:0,y:-50,x:"-50%"}} animate={{opacity:1,y:0,x:"-50%"}} exit={{opacity:0,y:-50,x:"-50%"}} className="fixed top-6 left-1/2 z-50 px-6 py-3 rounded-2xl text-sm font-semibold shadow-2xl backdrop-blur-xl text-white" style={{background:toast.t==="err"?"rgba(239,68,68,0.9)":accent+"ee",border:"1px solid "+accent}}>{toast.m}</motion.div>)}</AnimatePresence>
      {/* ── TOP BAR ── */}
      <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} className={"relative z-10 px-8 py-4 border-b "+(dark?"border-white/10":"border-gray-200")}>
        <div className="max-w-[1700px] mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <motion.button whileHover={{scale:1.05,x:-2}} whileTap={{scale:0.95}}
                onClick={onBack||(() => window.history.back())}
                className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all "+(dark?"border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5":"border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50")}>
                ← Back
              </motion.button>
              <div>
                <h1 className="text-xl font-black" style={{background:"linear-gradient(135deg,"+(dark?"#fff":"#1e1b4b")+" 30%,"+accent+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Resume Builder</h1>
                <p className={"text-xs "+tm}>Live preview · AI-powered · ATS-optimized</p>
              </div>
            </div>
            {/* Center: Stats */}
            <div className="flex items-center gap-2">
              {[{l:"ATS",v:ats+"%",c:ats>=75?"#10b981":ats>=50?"#f59e0b":"#f43f5e"},{l:"Done",v:done+"%",c:accent},{l:"Skills",v:data.skills.length,c:"#06b6d4"}].map(s=>(
                <div key={s.l} className={"rounded-xl border "+card+" flex items-center gap-2"} style={{padding:"7px 14px"}}><span className="text-xs font-medium" style={{color:s.c}}>{s.l}</span><span className="text-sm font-black" style={{color:s.c}}>{s.v}</span></div>
              ))}
            </div>
            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setDark(d=>!d)} className={"p-2 rounded-xl border transition-all "+(dark?"border-white/10 text-white/60 hover:text-white":"border-gray-200 text-gray-500")}>{dark?"☀️":"🌙"}</motion.button>
              <motion.button whileHover={{scale:1.05,boxShadow:"0 0 20px rgba(16,185,129,0.4)"}} whileTap={{scale:0.95}}
                onClick={()=>fileInputRef.current?.click()} disabled={isParsingResume}
                className="flex items-center gap-1.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all"
                style={{padding:"8px 16px",background:"linear-gradient(135deg,#10b981,#059669)"}}>
                {isParsingResume?<motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">📄</motion.span>:"📤"}
                {isParsingResume?"Parsing...":uploadedFileName?"Re-Upload":"Upload Resume"}
              </motion.button>
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleResumeUpload}/>
              <motion.button whileHover={{scale:1.05,boxShadow:"0 0 20px rgba(139,92,246,0.6)"}} whileTap={{scale:0.95}}
                onClick={()=>doAI("full")} disabled={aiL.full}
                className="flex items-center gap-1.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all"
                style={{padding:"8px 16px",background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
                {aiL.full?<motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">✨</motion.span>:"🤖"}
                {aiL.full?"Generating...":"Generate with AI"}
              </motion.button>
              <motion.button whileHover={{scale:1.05,boxShadow:"0 0 20px "+accent+"66"}} whileTap={{scale:0.95}}
                onClick={doPDF} disabled={pdfL}
                className="flex items-center gap-1.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all"
                style={{padding:"8px 16px",background:"linear-gradient(135deg,"+accent+","+accent+"99)"}}>
                {pdfL?<motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">⟳</motion.span>:"📥"}
                {pdfL?"Exporting...":"Download PDF"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      {/* ── 3-COLUMN LAYOUT — Canva/Figma style ── */}
      {/* The row is viewport-height. Left scrolls internally. Center + Right are fixed. */}
      <div className="relative z-10 resume-builder-layout" style={{height:"calc(100vh - 73px)"}}>
        <div className="max-w-[1700px] mx-auto h-full flex gap-7 px-8 resume-three-col">

          {/* ── LEFT FORM — scrolls independently ── */}
          <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:0.5,delay:0.1}}
            className="w-[440px] flex-shrink-0"
            style={{height:"100%",overflowY:"auto",paddingTop:"32px",paddingBottom:"80px",scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.1) transparent"}}>
            <div className="space-y-5">
            {/* Template + Color */}
            <div className={"rounded-2xl border "+card} style={{padding:"24px 32px"}}>
              <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>Template</p>
              <div className="flex gap-2 flex-wrap mb-5">
                {TEMPLATES.map(t=>(
                  <motion.button key={t.id} whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>setTpl(t.id)}
                    className="flex-1 min-w-[80px] py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{background:tpl===t.id?accent+"33":"rgba(255,255,255,0.05)",border:"1px solid "+(tpl===t.id?accent:"rgba(255,255,255,0.1)"),color:tpl===t.id?accent:"rgba(255,255,255,0.5)"}}>
                    {t.icon} {t.label}
                  </motion.button>
                ))}
              </div>
              <br /><p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>Accent Color</p>
              <div className="flex gap-2 flex-wrap">
                {ACCENT_PRESETS.map(p=>(
                  <motion.button key={p.name} whileHover={{scale:1.15}} whileTap={{scale:0.9}} onClick={()=>setAccent(p.color)} title={p.name}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{background:p.color,boxShadow:accent===p.color?"0 0 0 3px rgba(255,255,255,0.3),0 0 12px "+p.color:"none",border:accent===p.color?"2px solid white":"2px solid transparent"}}/>
                ))}
                <input type="color" value={accent} onChange={e=>setAccent(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer border-2 border-white/20" style={{padding:1}} title="Custom"/>
              <br></br></div>
            </div><br></br>
            {/* Personal Info */}
            <div className={"rounded-2xl border "+card} style={{padding:"24px 32px"}}>
              <br></br><SecHead icon="👤" title="Personal Info" collapsed={col.personal} onToggle={()=>togC("personal")}/>
              <AnimatePresence>
                {!col.personal&&(
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}>
                    <div className="flex items-center gap-4 mb-5">
                      <div onClick={()=>imgRef.current?.click()} className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-all overflow-hidden flex-shrink-0" style={{background:data.profileImage?"transparent":"rgba(255,255,255,0.05)"}}>
                        {data.profileImage?<img src={data.profileImage} alt="" className="w-full h-full object-cover"/>:<span className="text-2xl">📷</span>}
                      </div>
                      <div><div className={"text-xs font-semibold "+tm+" mb-1.5"}>Profile Photo</div><button onClick={()=>imgRef.current?.click()} className={"text-xs rounded-lg border transition-all "+(dark?"border-white/10 text-white/40 hover:text-white/70":"border-gray-200 text-gray-400 hover:text-gray-700")} style={{padding:"6px 14px"}}>{data.profileImage?"Change":"Upload Photo"}</button></div>
                      <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={onImg}/>
                    </div>
                    <br />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                      {[["Full Name","name","text","John Doe"],["Job Title","title","text","Software Engineer"],["Email","email","email","john@example.com"],["Phone","phone","text","+1 234 567 8900"]].map(([l,k,t,ph])=>(
                        <div key={k}><label className={"block text-xs font-semibold "+tm+" mb-2 uppercase tracking-widest"}>{l}</label><input type={t} className={iCls} style={iStyle} value={data[k]} onChange={e=>upd(k,e.target.value)} placeholder={ph}/></div>
                      ))}
                    </div>
                    <br />
                    <div className="mt-4"><label className={"block text-xs font-semibold "+tm+" mb-2 uppercase tracking-widest"}>Location</label><input className={iCls} style={iStyle} value={data.location} onChange={e=>upd("location",e.target.value)} placeholder="San Francisco, CA"/></div><br></br>
                  </motion.div>
                )}
              </AnimatePresence>
            </div><br></br>
            {/* Summary */}
            <div className={"rounded-2xl border "+card} style={{padding:"24px 32px"}}>
              <br></br><SecHead icon="📝" title="Professional Summary" collapsed={col.summary} onToggle={()=>togC("summary")}/>
              <AnimatePresence>
                {!col.summary&&(
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}>
                    <textarea className={tCls+" mb-4"} style={iStyle} rows={5} value={data.summary} onChange={e=>upd("summary",e.target.value)} placeholder="Write a compelling 2-3 sentence summary..."/>
                    <br />
                    <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>doAI("summary")} disabled={aiL.summary}
                      className="flex items-center gap-2 text-xs rounded-xl font-semibold transition-all mt-1"
                      style={{padding:"5px 12px",background:accent+"22",color:accent,border:"1px solid "+accent+"44"}}>
                      {aiL.summary?<motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">⟳</motion.span>:"✨"} AI Improve
                    </motion.button><br></br>
                  </motion.div>
                )}
              </AnimatePresence>
            </div><br></br>
            {/* Skills */}
            <div className={"rounded-2xl border "+card} style={{padding:"24px 32px"}}>
              <br></br><SecHead icon="⚡" title="Skills" collapsed={col.skills} onToggle={()=>togC("skills")}/>
              <AnimatePresence>
                {!col.skills&&(
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}>
                    <div className={"flex flex-wrap gap-2 px-5 py-4 rounded-xl border min-h-[40px] mb-4 "+(dark?"border-white/10 bg-white/5":"border-gray-200 bg-gray-50")}>
                      <AnimatePresence>{data.skills.map(s=><Chip key={s} skill={s} onRemove={x=>upd("skills",data.skills.filter(y=>y!==x))} accent={accent}/>)}</AnimatePresence>
                      <input value={skIn} onChange={e=>setSkIn(e.target.value)} onKeyDown={onSkKey} placeholder={data.skills.length===0?"Type skill + Enter...":"Add more..."} className={"flex-1 min-w-[120px] bg-transparent text-sm outline-none "+(dark?"text-white placeholder-white/30":"text-gray-700 placeholder-gray-400")}/>
                    </div>
                    <p className={"text-xs "+tm+" mb-4 mt-1 leading-relaxed"}>Enter or comma to add · Backspace to remove</p>
                    {sugg.length>0&&<div><p className={"text-xs font-semibold "+tm+" mb-3"}>💡 Smart Suggestions</p><div className="flex flex-wrap gap-2.5">{sugg.map(s=>(<motion.button key={s} whileHover={{scale:1.08}} whileTap={{scale:0.95}} onClick={()=>{if(!data.skills.includes(s))upd("skills",[...data.skills,s]);}} className={"text-xs rounded-full border transition-all "+(dark?"border-white/10 text-white/50 hover:text-white hover:border-white/20":"border-gray-200 text-gray-500 hover:text-gray-800")} style={{padding:"5px 12px"}}>+ {s}</motion.button>))}</div></div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div><br></br>
            {/* Draggable sections */}
            <DndContext sensors={sens} collisionDetection={closestCenter} onDragEnd={onDrag}>
              <SortableContext items={secOrd} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-8">
                {secOrd.map(sec=>(
                  <SortSec key={sec} id={sec}>
                    <div className={"rounded-2xl border "+card} style={{padding:"20px 32px"}}>
                      {sec==="experience"&&(<>
                        <br></br><SecHead icon="💼" title="Experience" onAdd={()=>addI("experience",{role:"",company:"",duration:"",description:""})} addLabel="Add Role" collapsed={col.experience} onToggle={()=>togC("experience")}/>
                        <AnimatePresence>{!col.experience&&data.experience.map(exp=>(
                          <motion.div key={exp.id} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="mb-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <input className={iCls} style={iStyle} value={exp.role} onChange={e=>updI("experience",exp.id,"role",e.target.value)} placeholder="Job Title"/>
                              <input className={iCls} style={iStyle} value={exp.company} onChange={e=>updI("experience",exp.id,"company",e.target.value)} placeholder="Company"/>
                            </div>
                            <br></br><input className={iCls+" mb-4"} style={iStyle} value={exp.duration} onChange={e=>updI("experience",exp.id,"duration",e.target.value)} placeholder="Jan 2023 – Present"/><br></br><br></br>
                            <textarea className={tCls+" mb-4"} style={iStyle} rows={5} value={exp.description} onChange={e=>updI("experience",exp.id,"description",e.target.value)} placeholder="Describe responsibilities and achievements..."/>
                            <div className="flex gap-3 flex-wrap items-center mt-1">
                              <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>doAI("exp",exp.id)} disabled={aiL[exp.id]} className="flex items-center gap-1.5 text-xs rounded-lg font-semibold transition-all" style={{padding:"5px 12px",background:accent+"22",color:accent,border:"1px solid "+accent+"44"}}>{aiL[exp.id]?<motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">⟳</motion.span>:"✨"} AI Improve</motion.button>
                              <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>doAI("bul",exp.id)} className={"text-xs rounded-lg border transition-all "+(dark?"border-white/10 text-white/50 hover:text-white/80":"border-gray-200 text-gray-500 hover:text-gray-800")} style={{padding:"5px 12px"}}>⚡ Auto Bullets</motion.button>
                              {data.experience.length>1&&<motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>remI("experience",exp.id)} className="ml-auto text-xs rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all" style={{padding:"5px 12px"}}>✕ Remove</motion.button>}
                            </div>
                          </motion.div>
                        ))}</AnimatePresence>
                      </>)}<br></br>
                      {sec==="projects"&&(<>
                        <SecHead icon="🚀" title="Projects" onAdd={()=>addI("projects",{name:"",tech:"",link:"",description:""})} addLabel="Add Project" collapsed={col.projects} onToggle={()=>togC("projects")}/>
                        <AnimatePresence>{!col.projects&&data.projects.map(proj=>(
                          <motion.div key={proj.id} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="mb-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <input className={iCls} style={iStyle} value={proj.name} onChange={e=>updI("projects",proj.id,"name",e.target.value)} placeholder="Project Name"/>
                              <input className={iCls} style={iStyle} value={proj.tech} onChange={e=>updI("projects",proj.id,"tech",e.target.value)} placeholder="Tech Stack"/>
                            </div>
                            <br></br><input className={iCls+" mb-4"} style={iStyle} value={proj.link} onChange={e=>updI("projects",proj.id,"link",e.target.value)} placeholder="GitHub / Live URL"/><br></br><br></br>
                            <textarea className={tCls+" mb-4"} style={iStyle} rows={5} value={proj.description} onChange={e=>updI("projects",proj.id,"description",e.target.value)} placeholder="Describe what you built and its impact..."/>
                            <div className="flex gap-3 items-center mt-1">
                              <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>doAI("proj",proj.id)} disabled={aiL[proj.id]} className="flex items-center gap-1.5 text-xs rounded-lg font-semibold transition-all" style={{padding:"5px 12px",background:accent+"22",color:accent,border:"1px solid "+accent+"44"}}>{aiL[proj.id]?<motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="inline-block">⟳</motion.span>:"✨"} AI Improve</motion.button>
                              {data.projects.length>1&&<motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>remI("projects",proj.id)} className="ml-auto text-xs rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 transition-all" style={{padding:"5px 12px"}}>✕ Remove</motion.button>}
                            </div>
                          </motion.div>
                        ))}</AnimatePresence>
                      </>)}
                      {sec==="education"&&(<>
                        <SecHead icon="🎓" title="Education" onAdd={()=>addI("education",{degree:"",institution:"",year:"",gpa:""})} addLabel="Add" collapsed={col.education} onToggle={()=>togC("education")}/>
                        <AnimatePresence>{!col.education&&data.education.map(edu=>(
                          <motion.div key={edu.id} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="mb-4">
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <input className={iCls} style={iStyle} value={edu.degree} onChange={e=>updI("education",edu.id,"degree",e.target.value)} placeholder="Degree / Course"/>
                              <input className={iCls} style={iStyle} value={edu.institution} onChange={e=>updI("education",edu.id,"institution",e.target.value)} placeholder="Institution"/>
                              <input className={iCls} style={iStyle} value={edu.year} onChange={e=>updI("education",edu.id,"year",e.target.value)} placeholder="2022–2026"/>
                              <input className={iCls} style={iStyle} value={edu.gpa} onChange={e=>updI("education",edu.id,"gpa",e.target.value)} placeholder="GPA / %"/>
                            </div>
                            {data.education.length>1&&<motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>remI("education",edu.id)} className="mt-3 text-xs rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 transition-all" style={{padding:"5px 12px"}}>✕ Remove</motion.button>}
                          </motion.div>
                        ))}</AnimatePresence>
                      </>)}
                      {sec==="certifications"&&(<>
                        <SecHead icon="🏆" title="Certifications" onAdd={()=>addI("certifications",{name:"",issuer:"",year:""})} addLabel="Add" collapsed={col.certifications} onToggle={()=>togC("certifications")}/>
                        <AnimatePresence>{!col.certifications&&data.certifications.map(cert=>(
                          <motion.div key={cert.id} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="mb-4">
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <input className={iCls} style={iStyle} value={cert.name} onChange={e=>updI("certifications",cert.id,"name",e.target.value)} placeholder="Certification"/>
                              <input className={iCls} style={iStyle} value={cert.issuer} onChange={e=>updI("certifications",cert.id,"issuer",e.target.value)} placeholder="Issuer"/>
                              <input className={iCls} style={iStyle} value={cert.year} onChange={e=>updI("certifications",cert.id,"year",e.target.value)} placeholder="Year"/>
                            </div>
                            {data.certifications.length>1&&<motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>remI("certifications",cert.id)} className="mt-3 text-xs rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 transition-all" style={{padding:"5px 12px"}}>✕ Remove</motion.button>}
                          </motion.div>
                        ))}</AnimatePresence>
                      </>)}
                    </div>
                  </SortSec>
                ))}
                </div>
              </SortableContext>
            </DndContext>
            </div>{/* end space-y-5 */}
          </motion.div>

          {/* ── CENTER PREVIEW — fixed, never moves ── */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.2}}
            className="flex-1 min-w-0 resume-center-sticky"
            style={{height:"100%",display:"flex",flexDirection:"column",paddingTop:"24px",paddingBottom:"24px",minWidth:0}}>
            <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <span className={"text-xs font-bold "+tm+" uppercase tracking-widest"}>Live Preview</span>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setScale(s=>Math.max(0.4,s-0.05))} className={"text-xs px-2.5 py-1.5 rounded-lg border transition-all "+(dark?"border-white/10 text-white/40 hover:text-white/70":"border-gray-200 text-gray-400 hover:text-gray-700")}>−</button>
                  <span className={"text-xs "+tm+" w-10 text-center"}>{Math.round(scale*100)}%</span>
                  <button onClick={()=>setScale(s=>Math.min(1,s+0.05))} className={"text-xs px-2.5 py-1.5 rounded-lg border transition-all "+(dark?"border-white/10 text-white/40 hover:text-white/70":"border-gray-200 text-gray-400 hover:text-gray-700")}>+</button>
                </div>
              </div>
              {/* Preview card — square corners, fills column height, scrollable when zoomed in */}
              <motion.div whileHover={{boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}
                className={"border shadow-2xl transition-all duration-300 flex-1 "+(dark?"border-white/10":"border-gray-200")}
                style={{background:"#111827",overflow:"hidden",position:"relative",borderRadius:"4px"}}>
                <div style={{
                  position:"absolute",inset:0,
                  overflow:"auto",
                  background:"#111827",
                  padding:"16px"
                }}>
                  {/* Wrapper sized to the scaled dimensions so scroll works correctly */}
                  <div style={{
                    width:"calc(210mm * "+scale+")",
                    minHeight:"calc(297mm * "+scale+")",
                    margin:"0 auto",
                    position:"relative"
                  }}>
                    <div ref={prvRef}
                      className="resume-preview-sheet"
                      style={{
                        width:"210mm",
                        minHeight:"297mm",
                        background:"white",
                        transform:"scale("+scale+")",
                        transformOrigin:"top left",
                        wordBreak:"break-word",
                        overflowWrap:"break-word",
                        boxShadow:"0 8px 40px rgba(0,0,0,0.5)",
                        position:"absolute",
                        top:0,left:0
                      }}>
                      <AnimatePresence mode="wait">
                        <motion.div key={tpl} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}>
                          {tpl==="modern"   &&<ModernPreview   data={data} accent={accent}/>}
                          {tpl==="classic"  &&<ClassicPreview  data={data} accent={accent}/>}
                          {tpl==="minimal"  &&<MinimalPreview  data={data} accent={accent}/>}
                          {tpl==="sidebar"  &&<SidebarPreview  data={data} accent={accent}/>}
                          {tpl==="dark"     &&<DarkPreview     data={data} accent={accent}/>}
                          {tpl==="diagonal" &&<DiagonalPreview data={data} accent={accent}/>}
                          {tpl==="glass"    &&<GlassPreview    data={data} accent={accent}/>}
                          {tpl==="elegant"  &&<ElegantPreview  data={data} accent={accent}/>}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── RIGHT SIDEBAR — scrolls independently ── */}
          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{duration:0.5,delay:0.3}}
            className="w-[260px] flex-shrink-0 resume-right-sticky resume-sidebar"
            style={{height:"100%",overflowY:"auto",paddingTop:"32px",paddingBottom:"80px",display:"flex",flexDirection:"column",gap:"20px",scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.1) transparent"}}>
            {/* ATS Score */}
            <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
              <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-4"}>ATS Score</p>
              <div className="flex items-center gap-4">
                <ATSRing score={ats}/>
                <div>
                  <p className={"text-sm font-bold "+tp+" mb-1"}>{ats>=75?"🟢 Strong":ats>=50?"🟡 Average":"🔴 Weak"}</p>
                  <p className={"text-xs "+tm+" leading-[1.8]"}>{ats>=75?"Well optimized!":ats>=50?"Add more keywords":"Fill all sections"}</p>
                </div>
              </div>
            </div>
            {/* Missing keywords */}
            {mkw.length>0&&(
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5" style={{padding:"20px 20px"}}>
              <p className="text-xs font-bold text-amber-400/70 uppercase tracking-widest mb-3">⚠ Missing Keywords</p>
                <div className="flex flex-wrap gap-2">{mkw.map(k=><span key={k} className="text-xs rounded-full border border-amber-500/30 text-amber-400/70" style={{padding:"5px 12px"}}>{k}</span>)}</div>
                <br />
                <p className={"text-xs "+tm+" mt-2"}>Add these to boost ATS score.</p>
              </div>
            )}
            {/* Resume Tips */}
            <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
              <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>💡 Resume Tips</p>
              <AnimatePresence mode="wait">
                <motion.p key={tipI} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.3}} className={"text-sm "+tm+" leading-[1.8]"}>
                  <span className="text-base mr-2">{RESUME_TIPS[tipI].icon}</span>{RESUME_TIPS[tipI].tip}
                </motion.p>
              </AnimatePresence>
              <div className="flex gap-1 mt-4">{RESUME_TIPS.map((_,i)=><button key={i} onClick={()=>setTipI(i)} className="h-1.5 rounded-full transition-all duration-300" style={{width:i===tipI?16:6,background:i===tipI?accent:"rgba(255,255,255,0.15)"}}/>)}</div>
            </div>
            {/* Section Checklist */}
            <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
              <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>📋 Checklist</p>
              {[["Name & Email",!!(data.name&&data.email)],["Summary",data.summary.length>30],["5+ Skills",data.skills.length>=5],["Experience",data.experience.some(e=>e.role&&e.company)],["Projects",data.projects.some(p=>p.name)],["Education",data.education.some(e=>e.degree)],["Photo",!!data.profileImage]].map(([l,ok])=>(
                <div key={l} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0"><span className="text-base">{ok?"✅":"⭕"}</span><span className={"text-sm "+(ok?tp:tm)}>{l}</span></div>
              ))}
            </div>
﻿            {/* Quick Actions */}
            <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
              <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>⚡ Quick Actions</p>
              <div className="space-y-2">
                <motion.button whileHover={{scale:1.02,x:2}} whileTap={{scale:0.98}} onClick={()=>doAI("summary")} className={"w-full text-left text-xs rounded-xl border transition-all leading-relaxed "+(dark?"border-white/10 text-white/50 hover:text-white/80 hover:border-white/20":"border-gray-200 text-gray-500 hover:text-gray-800")} style={{padding:"10px 18px"}}>✨ AI Improve Summary</motion.button>
                <motion.button whileHover={{scale:1.02,x:2}} whileTap={{scale:0.98}} onClick={()=>{const add=sugg.filter(s=>!data.skills.includes(s));if(add.length)upd("skills",[...data.skills,...add]);}} className={"w-full text-left text-xs rounded-xl border transition-all leading-relaxed "+(dark?"border-white/10 text-white/50 hover:text-white/80 hover:border-white/20":"border-gray-200 text-gray-500 hover:text-gray-800")} style={{padding:"10px 18px"}}>⚡ Add Suggested Skills</motion.button>
                <motion.button whileHover={{scale:1.02,x:2}} whileTap={{scale:0.98}} onClick={doPDF} className="w-full text-left text-xs rounded-xl font-semibold transition-all" style={{padding:"10px 18px",background:accent+"22",color:accent,border:"1px solid "+accent+"33"}}>📥 Export as PDF</motion.button>
              </div>
            </div>

            {/* ── NEW: Resume Health Score ── */}
            <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
              <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>🏥 Resume Health</p>
              <div className="space-y-2">
                {[
                  {label:"Content Quality",val:Math.min(100,done+10),color:"#10b981"},
                  {label:"ATS Readiness",val:ats,color:ats>=75?"#10b981":ats>=50?"#f59e0b":"#f43f5e"},
                  {label:"Keyword Density",val:Math.min(100,ATS_KEYWORDS.filter(k=>[data.summary,...data.experience.map(e=>e.description)].join(" ").toLowerCase().includes(k)).length*8),color:"#6366f1"},
                  {label:"Completeness",val:done,color:"#06b6d4"},
                ].map(({label,val,color})=>(
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className={"text-xs "+tm}>{label}</span>
                      <span className="text-xs font-bold" style={{color}}>{val}%</span>
                    </div>
                    <div className={"h-1.5 rounded-full "+(dark?"bg-white/10":"bg-gray-100")}>
                      <motion.div initial={{width:0}} animate={{width:val+"%"}} transition={{duration:0.8,ease:"easeOut"}} className="h-full rounded-full" style={{background:color}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── NEW: Skill Strength Meter ── */}
            {data.skills.length>0&&(
              <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
                <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>💪 Skill Strength</p>
                <div className="space-y-2">
                  {data.skills.slice(0,6).map((skill,i)=>{
                    const strength=Math.min(100,60+i*7+(skill.length%3)*10);
                    return(
                      <div key={skill} className="flex items-center gap-2">
                        <span className={"text-xs truncate flex-1 "+tm} style={{maxWidth:100}}>{skill}</span>
                        <div className={"flex-1 h-1.5 rounded-full "+(dark?"bg-white/10":"bg-gray-100")}>
                          <motion.div initial={{width:0}} animate={{width:strength+"%"}} transition={{duration:0.6,delay:i*0.08,ease:"easeOut"}} className="h-full rounded-full" style={{background:`linear-gradient(90deg,${accent},${accent}99)`}}/>
                        </div>
                        <span className="text-xs font-bold" style={{color:accent,minWidth:28,textAlign:"right"}}>{strength}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── NEW: AI Suggestions ── */}
            <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
              <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>🤖 AI Suggestions</p>
              <div className="space-y-2">
                {[
                  !data.summary&&{icon:"📝",text:"Add a professional summary to stand out"},
                  data.skills.length<5&&{icon:"⚡",text:"Add at least 5 skills for better ATS"},
                  !data.profileImage&&{icon:"📷",text:"Upload a photo for a personal touch"},
                  !data.experience.some(e=>e.description?.includes("%"))&&{icon:"📊",text:"Add metrics (%, $, x) to experience"},
                  data.experience.length<2&&{icon:"💼",text:"Add more experience entries"},
                ].filter(Boolean).slice(0,3).map((s,i)=>(
                  <div key={i} className={"flex items-start gap-2 p-2.5 rounded-xl "+(dark?"bg-white/5":"bg-gray-50")}>
                    <span className="text-sm flex-shrink-0">{s.icon}</span>
                    <span className={"text-xs leading-relaxed "+tm}>{s.text}</span>
                  </div>
                ))}
                {[
                  !data.summary&&null,
                  data.skills.length<5&&null,
                  !data.profileImage&&null,
                  !data.experience.some(e=>e.description?.includes("%"))&&null,
                  data.experience.length<2&&null,
                ].filter(Boolean).length===0&&(
                  <div className={"flex items-center gap-2 p-2.5 rounded-xl "+(dark?"bg-emerald-500/10":"bg-emerald-50")}>
                    <span className="text-sm">✅</span>
                    <span className="text-xs text-emerald-400">Looking great! Keep it up.</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── NEW: Interview Tips ── */}
            <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
              <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>🎤 Interview Tips</p>
              <div className="space-y-2">
                {[
                  {icon:"⭐",tip:"Use STAR method: Situation, Task, Action, Result"},
                  {icon:"🔢",tip:"Prepare 3 stories for each key achievement"},
                  {icon:"🔍",tip:"Research the company before every interview"},
                  {icon:"❓",tip:"Always have 2-3 questions ready to ask"},
                ].map((t,i)=>(
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-sm flex-shrink-0">{t.icon}</span>
                    <span className={"text-xs leading-relaxed "+tm}>{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── NEW: Auto Save Status ── */}
            <div className={"rounded-2xl border "+card} style={{padding:"16px 20px"}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div animate={{scale:[1,1.3,1]}} transition={{duration:2,repeat:Infinity}} className="w-2 h-2 rounded-full bg-emerald-400"/>
                  <span className={"text-xs font-semibold "+tp}>Auto Saved</span>
                </div>
                <span className={"text-xs "+tm}>Just now</span>
              </div>
              <p className={"text-xs "+tm+" mt-1"}>All changes saved locally</p>
            </div>


            {/* ── NEW: Resume Analytics ── */}
            <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
              <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>📈 Analytics</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {label:"Words",val:([data.summary,...data.experience.map(e=>e.description),...data.projects.map(p=>p.description)].join(" ").split(/\s+/).filter(Boolean).length)||0,icon:"📝"},
                  {label:"Sections",val:[data.summary,data.skills.length,data.experience.length,data.projects.length,data.education.length,data.certifications.length].filter(Boolean).length,icon:"📋"},
                  {label:"Skills",val:data.skills.length,icon:"⚡"},
                  {label:"Exp. Roles",val:data.experience.filter(e=>e.role).length,icon:"💼"},
                ].map(({label,val,icon})=>(
                  <div key={label} className={"rounded-xl p-3 text-center "+(dark?"bg-white/5":"bg-gray-50")}>
                    <div className="text-lg mb-0.5">{icon}</div>
                    <div className="text-lg font-black" style={{color:accent}}>{val}</div>
                    <div className={"text-xs "+tm}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── NEW: Quick Improve Buttons ── */}
            <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
              <p className={"text-xs font-bold "+tm+" uppercase tracking-widest mb-3"}>🚀 Quick Improve</p>
              <div className="space-y-2">
                <motion.button whileHover={{scale:1.02,x:2}} whileTap={{scale:0.98}} onClick={()=>doAI("full")} disabled={aiL.full}
                  className="w-full text-left text-xs rounded-xl font-semibold text-white transition-all"
                  style={{padding:"10px 14px",background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
                  {aiL.full?"⟳ Generating...":"🤖 AI Full Resume"}
                </motion.button>
                <motion.button whileHover={{scale:1.02,x:2}} whileTap={{scale:0.98}} onClick={()=>doAI("summary")} disabled={aiL.summary}
                  className={"w-full text-left text-xs rounded-xl border transition-all "+(dark?"border-white/10 text-white/50 hover:text-white/80":"border-gray-200 text-gray-500 hover:text-gray-800")} style={{padding:"10px 14px"}}>
                  ✨ Improve Summary
                </motion.button>
                <motion.button whileHover={{scale:1.02,x:2}} whileTap={{scale:0.98}}
                  onClick={()=>{const add=sugg.filter(s=>!data.skills.includes(s));if(add.length)upd("skills",[...data.skills,...add]);showT("⚡ Skills added!","ok");}}
                  className={"w-full text-left text-xs rounded-xl border transition-all "+(dark?"border-white/10 text-white/50 hover:text-white/80":"border-gray-200 text-gray-500 hover:text-gray-800")} style={{padding:"10px 14px"}}>
                  ⚡ Boost Skills
                </motion.button>
                <motion.button whileHover={{scale:1.02,x:2}} whileTap={{scale:0.98}} onClick={analyzeResume} disabled={fixingGrammar}
                  className={"w-full text-left text-xs rounded-xl border transition-all "+(dark?"border-white/10 text-white/50 hover:text-white/80":"border-gray-200 text-gray-500 hover:text-gray-800")} style={{padding:"10px 14px"}}>
                  🔍 Fix Issues
                </motion.button>
                <motion.button whileHover={{scale:1.02,x:2}} whileTap={{scale:0.98}} onClick={doPDF} disabled={pdfL}
                  className="w-full text-left text-xs rounded-xl font-semibold transition-all"
                  style={{padding:"10px 14px",background:accent+"22",color:accent,border:"1px solid "+accent+"33"}}>
                  📥 Download PDF
                </motion.button>
              </div>
            </div>

            {/* How to Improve Guide */}
            <div className={"rounded-2xl border "+card} style={{padding:"20px 20px"}}>
              <button onClick={()=>setShowTipsPanel(p=>!p)} className="w-full flex items-center justify-between">
                <p className={"text-xs font-bold "+tm+" uppercase tracking-widest"}>📖 How to Improve</p>
                <motion.span animate={{rotate:showTipsPanel?180:0}} transition={{duration:0.3}} className="text-white/30 text-xs">▼</motion.span>
              </button>
              <AnimatePresence>
                {showTipsPanel && (
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} className="mt-4 space-y-3">
                    {[
                      {icon:"🎯",title:"Use Strong Action Verbs",tips:["• Led, Built, Designed, Optimized","• Architected, Delivered, Launched","• Increased, Reduced, Improved","• Mentored, Collaborated, Drove"]},
                      {icon:"📊",title:"Quantify Everything",tips:["• Increased sales by 40%","• Reduced load time by 60%","• Managed team of 8 engineers","• Delivered 3 projects on time"]},
                      {icon:"•",title:"Bullet Point Format",tips:["• Start each line with •","• One achievement per bullet","• Keep each bullet 1-2 lines","• Format: Action → Result → Impact"]},
                      {icon:"🔑",title:"ATS Keywords",tips:["• Copy keywords from job posting","• Use exact phrases, not synonyms","• Include technical skills section","• Match job title exactly"]},
                      {icon:"📏",title:"Length and Format",tips:["• 1 page for under 5 years exp","• 2 pages max for senior roles","• Consistent font size 10-12pt","• Clear section headings"]},
                      {icon:"✉️",title:"Contact and Links",tips:["• Professional email address","• LinkedIn profile URL","• GitHub for tech roles","• Portfolio or website link"]},
                    ].map((section,i)=>(
                      <div key={i} className="rounded-xl p-3 border border-white/8" style={{background:"rgba(255,255,255,0.03)"}}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base">{section.icon}</span>
                          <span className={"text-xs font-bold "+tp}>{section.title}</span>
                        </div>
                        <div className="space-y-1">
                          {section.tips.map((tip,j)=>(
                            <p key={j} className={"text-xs "+tm+" leading-[1.8]"}>{tip}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
// PREVIEW COMPONENTS
