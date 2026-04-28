import { readFileSync } from "fs";
const c = readFileSync("src/ResumeBuilder.jsx","utf8");
const i = c.indexOf('template === "modern"');
console.log(c.slice(i-20, i+300));
