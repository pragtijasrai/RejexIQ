const fs = require("fs");
const lines = [];
const p = (s) => lines.push(s);

p("import { useState, useRef, useEffect } from \"react\";");
p("import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from \"recharts\";");
p("");
p("const T = {");
p("  bg:\"#0a0e27\", surface:\"#141b3a\", card:\"#1a2347\", border:\"#2d3a5f\",");
p("  accent:\"#ff6b9d\", purple:\"#c084fc\", cyan:\"#22d3ee\",");
p("  text:\"#f0f4ff\", muted:\"#94a3b8\",");
p("  success:\"#34d399\", warning:\"#fbbf24\", danger:\"#f87171\",");
p("  indigo:\"#818cf8\", teal:\"#2dd4bf\",");
p("};");

fs.writeFileSync("src/MarketDemand.jsx", lines.join("\n"));
console.log("done: " + lines.length + " lines");
