# 📐 Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ATS Resume Checker                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌─────────────────────────┐   │
│  │   Frontend UI    │         │   Resume Processing    │   │
│  ├──────────────────┤         ├─────────────────────────┤   │
│  │ • Upload Button  │────────▶│ • Parse PDF/DOCX/TXT   │   │
│  │ • Live Preview   │         │ • Extract Sections     │   │
│  │ • Fix Panel      │         │ • Identify Content     │   │
│  │ • Download Btn   │         └─────────────────────────┘   │
│  └──────────────────┘                  │                    │
│           ▲                            ▼                    │
│           │                  ┌─────────────────────────┐    │
│           │                  │  updatedResumeData      │    │
│           │                  │  (Single Source Truth)  │    │
│           │                  │                         │    │
│           │                  │ • name                  │    │
│           │                  │ • email                 │    │
│           │                  │ • skills[]              │    │
│           │                  │ • experience[]          │    │
│           │                  │ • projects[]            │    │
│           │                  │ • education[]           │    │
│           │                  └─────────────────────────┘    │
│           │                            │                    │
│           └────────────────────────────┴───────────────────┘
│
│  ┌──────────────────┐         ┌─────────────────────────┐
│  │   AI Analysis    │         │  Template Rendering    │
│  ├──────────────────┤         ├─────────────────────────┤
│  │ • Check metrics  │────────▶│ • Modern               │
│  │ • Suggest fixes  │         │ • Classic              │
│  │ • Action verbs   │         │ • Minimal              │
│  │ • Keywords       │         │ • Sidebar              │
│  └──────────────────┘         │ • Dark                 │
│           ▲                   │ • Custom               │
│           │                   └─────────────────────────┘
│           └────────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────────────┐
│  │         Backend API (Node.js/Express)               │
│  ├──────────────────────────────────────────────────────┤
│  │ • POST /api/parse-resume                           │
│  │ • Resume parsing and validation                    │
│  └──────────────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Upload Flow
```
User Selects File
      │
      ▼
handleResumeUpload()
      │
      ├─ Check file type
      │
      ├─ Call parseResumeFile()
      │
      ├─ Read file content
      │
      ├─ Extract structured data
      │
      ├─ Merge with existing state
      │
      ▼
setUpdatedResumeData()
      │
      ├─ Update UI Preview
      │
      └─ Trigger Analysis
```

### Analysis & Fix Flow
```
User Clicks "Analyze"
      │
      ▼
analyzeResume()
      │
      ├─ Check summary for metrics
      │ └─ Create "add metrics" fix
      │
      ├─ Check experience for weak verbs
      │ └─ Create "improve verbs" fix
      │
      ├─ Check skills count
      │ └─ Create "add skills" fix
      │
      ▼
setGrammarFixes([...])
      │
      ├─ Display fixes in UI
      │
User Clicks "Apply Fix"
      │
      ▼
applyFix(fix)
      │
      ├─ Update specific field in updatedResumeData
      │
      ├─ Mark fix as applied
      │
      ▼
Preview Updates (automatic)
ATS Score Recalculates (automatic)
```

### Download Flow
```
User Clicks "Download PDF"
      │
      ▼
doPDF()
      │
      ├─ Get preview element
      │
      ├─ Set proper dimensions
      │
      ├─ Use html2pdf.js
      │
      ├─ Extract filename from updatedResumeData.name
      │
      ▼
Generate PDF
      │
      ├─ From live preview (renders updatedResumeData)
      │
      ├─ Include all applied fixes
      │
      └─ Download to user's device
```

---

## State Tree

```
ResumeBuilder Component
│
├─ updatedResumeData (📌 SINGLE SOURCE OF TRUTH)
│  ├─ name: string
│  ├─ title: string
│  ├─ email: string
│  ├─ phone: string
│  ├─ location: string
│  ├─ summary: string
│  ├─ profileImage: data URL
│  ├─ skills: string[]
│  ├─ experience: [{id, role, company, duration, description}]
│  ├─ projects: [{id, name, tech, link, description}]
│  ├─ education: [{id, degree, institution, year, gpa}]
│  └─ certifications: [{id, name, issuer, year}]
│
├─ grammarFixes
│  └─ [{id, section, field, type, original, fixed}]
│
├─ appliedFixes
│  └─ {fixId: boolean}
│
├─ UI State
│  ├─ dark: boolean
│  ├─ tpl: string (template)
│  ├─ accent: string (color)
│  ├─ scale: number (zoom)
│  ├─ col: {section: boolean} (collapsed)
│  ├─ toast: {m, t}
│  ├─ uploadedFileName: string
│  ├─ isParsingResume: boolean
│  └─ fixingGrammar: boolean
│
└─ AI State
   ├─ aiL: {key: boolean} (loading)
   └─ fixPanel: boolean
```

---

## Component Interaction

### Key Callbacks

```javascript
// Update single field
upd(field, value)
  └─ setUpdatedResumeData(prev => ({...prev, [field]: value}))

// Update nested item in array
updI(section, id, field, value)
  └─ setUpdatedResumeData(prev => ({
       ...prev,
       [section]: prev[section].map(item => 
         item.id === id ? {...item, [field]: value} : item
       )
     }))

// Add new item to section
addI(section, template)
  └─ setUpdatedResumeData(prev => ({
       ...prev,
       [section]: [...prev[section], {id: section+Date.now(), ...template}]
     }))

// Remove item from section
remI(section, id)
  └─ setUpdatedResumeData(prev => ({
       ...prev,
       [section]: prev[section].filter(item => item.id !== id)
     }))
```

---

## Parsing Algorithm

```
Input: File (PDF/DOCX/TXT)
  │
  ├─ Extract raw text
  │
  ├─ Split into lines
  │
  ├─ Identify sections by keywords
  │  ├─ "experience", "professional" → experience section
  │  ├─ "project" → projects section
  │  ├─ "skill" → skills section
  │  ├─ "education" → education section
  │  ├─ "certification" → certifications section
  │  └─ "summary", "about" → summary section
  │
  ├─ Extract fields
  │  ├─ Line 0-2: name, title
  │  ├─ First @: email
  │  ├─ Phone pattern: phone number
  │  ├─ Section lines: relevant content
  │  └─ Filter duplicates & clean
  │
  └─ Return structured data

Output: 
{
  name: extracted_name,
  title: extracted_title,
  email: extracted_email,
  skills: [extracted_skills],
  experience: [{role, company, duration, description}],
  projects: [{name, tech, description}],
  education: [{degree, institution, year}],
  certifications: [{name, issuer, year}]
}
```

---

## AI Improvement Logic

### Summary Analysis
```
Check 1: Contains metrics?
  ├─ Pattern: /\d+%|\d+x|\$\d+/
  ├─ If NO → Add metrics suggestion
  └─ If YES → Skip

Check 2: Weak phrasing?
  ├─ Check for: "responsible for", "worked on", "helped with"
  ├─ If found → Replace with stronger verbs
  └─ If not → Skip
```

### Experience Analysis
```
For each experience entry:
  
  Check 1: Bullet format?
    ├─ Check for "•" prefix
    ├─ If NO → Convert to bullets
    └─ If YES → Skip
  
  Check 2: Weak verbs?
    ├─ Check for: "helped", "worked on"
    ├─ If found → Replace with: "delivered", "developed"
    └─ If not → Skip
```

### Skills Analysis
```
Check: Minimum count?
  ├─ If < 5 skills → Suggest adding related skills
  ├─ Use SKILL_MAP to find related skills
  └─ If >= 5 → Skip
```

---

## ATS Score Calculation

```
Base Points: 100

Points Deducted For:
┌─────────────────────────────────────────┐
│ Missing Section       │ Points Lost     │
├───────────────────────┼─────────────────┤
│ No name              │ -5              │
│ No title             │ -5              │
│ No email             │ -3              │
│ No phone             │ -3              │
│ No location          │ -2              │
│ Empty summary        │ -8              │
│ Less than 5 skills   │ -7              │
│ No experience        │ -7              │
│ No education         │ -5              │
│ No certifications    │ -5              │
│ No projects          │ -5              │
│ No photo             │ -1              │
└─────────────────────────────────────────┘

Points Added For:
┌─────────────────────────────────────────┐
│ Achievement          │ Points Gained   │
├───────────────────────┼─────────────────┤
│ Summary > 50 chars   │ +8              │
│ 5+ skills            │ +7              │
│ Experience entry     │ +7              │
│ Metrics in desc      │ +10             │
│ ATS keywords         │ +2 per keyword  │
│ Education entry      │ +5              │
│ Certification entry  │ +5              │
│ 2+ projects          │ +5              │
│ Profile photo        │ +1              │
└─────────────────────────────────────────┘

Final: Max(0, Min(100, score))
```

---

## Error Handling

```
File Upload
  │
  ├─ Unsupported format?
  │  └─ Show: "Unsupported file type"
  │
  ├─ Parse error?
  │  └─ Show: "Could not parse resume file"
  │
  └─ Success
     └─ Show: "Resume uploaded and parsed successfully!"


PDF Generation
  │
  ├─ Preview not ready?
  │  └─ Show: "Preview not ready"
  │
  ├─ Export error?
  │  └─ Show: "Export failed"
  │
  └─ Success
     └─ Show: "PDF downloaded with all updates!"
```

---

## Performance Optimizations

1. **Memoized Callbacks**
   - `upd`, `updI`, `addI`, `remI` use `useCallback`
   - Prevents unnecessary re-renders

2. **Lazy Template Rendering**
   - Templates render conditionally with AnimatePresence
   - Only active template renders

3. **Debounced ATS Calculation**
   - Recalculates only when data changes
   - Not on every keystroke

4. **Optimized Preview Scaling**
   - Uses CSS transform (GPU accelerated)
   - Smooth zoom in/out

5. **Efficient File Parsing**
   - Parses file once
   - Caches extracted data

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Tested & optimized |
| Firefox | ✅ Full | All features work |
| Safari | ✅ Full | CSS compatibility |
| Edge | ✅ Full | Chromium-based |
| IE11 | ❌ Not supported | Requires modern JS |

---

## Security Considerations

1. **File Upload**
   - Only accepts safe file types
   - No server execution of uploaded files
   - File content extracted, not executed

2. **Data Storage**
   - Stored in React state (client-side)
   - Not persisted to backend by default
   - Optional backend storage available

3. **XSS Prevention**
   - All user input sanitized
   - React prevents inline HTML injection
   - Safe string interpolation

4. **CORS**
   - Backend only accepts requests from localhost:5173
   - Can be configured for production domain

---

**This architecture ensures reliability, performance, and user satisfaction! 🎯**
