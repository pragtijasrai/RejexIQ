import { useState } from "react";
import DSATutorial from "./DSATutorial.jsx";
import ArraysRecursion from "./ArraysRecursion.jsx";
import ControlFlow from "./ControlFlow.jsx";
import StringsTutorial from "./StringsTutorial.jsx";
import LinkedList from "./LinkedList.jsx";
import StacksQueues from "./StacksQueues.jsx";
import Backtracking from "./Backtracking.jsx";

function RecursionTopic({ onPrev, onNext }) { return <ArraysRecursion onPrev={onPrev} onNext={onNext} _startAt="rec" />; }
function ArraysTopic({ onPrev, onNext }) { return <ArraysRecursion onPrev={onPrev} onNext={onNext} _startAt="arr" />; }
function StackTopic({ onPrev, onNext }) { return <StacksQueues onPrev={onPrev} onNext={onNext} _startAt="stack" />; }
function QueueTopic({ onPrev, onNext }) { return <StacksQueues onPrev={onPrev} onNext={onNext} _startAt="queue" />; }

// ── Per-topic hero graphics (pure SVG) ──
function HeroBasics() {
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      {/* Code editor window */}
      <rect x="10" y="10" width="260" height="140" rx="10" fill="#1e1e2e" stroke="#6c63ff" strokeWidth="1.5" />
      <rect x="10" y="10" width="260" height="28" rx="10" fill="#2a2a3d" />
      <rect x="10" y="28" width="260" height="10" fill="#2a2a3d" />
      <circle cx="28" cy="24" r="5" fill="#ff5f57" /><circle cx="44" cy="24" r="5" fill="#ffbd2e" /><circle cx="60" cy="24" r="5" fill="#28c840" />
      <text x="22" y="58" fontFamily="monospace" fontSize="11" fill="#c792ea">public class</text>
      <text x="110" y="58" fontFamily="monospace" fontSize="11" fill="#82aaff">Hello</text>
      <text x="148" y="58" fontFamily="monospace" fontSize="11" fill="#abb2bf">{" {"}</text>
      <text x="30" y="76" fontFamily="monospace" fontSize="10" fill="#c792ea">  static void</text>
      <text x="118" y="76" fontFamily="monospace" fontSize="10" fill="#82aaff">main</text>
      <text x="148" y="76" fontFamily="monospace" fontSize="10" fill="#abb2bf">(String[] args)</text>
      <text x="30" y="94" fontFamily="monospace" fontSize="10" fill="#abb2bf">    System.out.</text>
      <text x="130" y="94" fontFamily="monospace" fontSize="10" fill="#82aaff">println</text>
      <text x="30" y="112" fontFamily="monospace" fontSize="10" fill="#c3e88d">      "Hello, World!"</text>
      <text x="30" y="130" fontFamily="monospace" fontSize="10" fill="#abb2bf">  {"}"}</text>
      <text x="22" y="148" fontFamily="monospace" fontSize="10" fill="#abb2bf">{"}"}</text>
      {/* Output terminal */}
      <rect x="290" y="50" width="120" height="60" rx="8" fill="#0d1117" stroke="#43e97b" strokeWidth="1.5" />
      <text x="300" y="68" fontFamily="monospace" fontSize="9" fill="#43e97b">$ java Hello</text>
      <text x="300" y="84" fontFamily="monospace" fontSize="10" fill="#fff">Hello, World!</text>
      <rect x="300" y="90" width="6" height="10" rx="1" fill="#43e97b" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite" />
      </rect>
      {/* Arrow */}
      <path d="M272 80 L288 80" stroke="#6c63ff" strokeWidth="2" markerEnd="url(#arr)" />
      <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#6c63ff" strokeWidth="1.5" /></marker></defs>
    </svg>
  );
}

function HeroComplexity() {
  const bars = [8, 20, 45, 90, 140];
  const colors = ["#43e97b", "#4ecdc4", "#6c63ff", "#ffd166", "#ff6b6b"];
  const labels = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"];
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      {/* Grid lines */}
      {[0, 1, 2, 3].map(i => <line key={i} x1="40" y1={20 + i * 35} x2="400" y2={20 + i * 35} stroke="#2a2a3d" strokeWidth="0.5" />)}
      {/* Bars */}
      {bars.map((h, i) => (
        <g key={i}>
          <rect x={55 + i * 68} y={155 - h} width="44" height={h} rx="4" fill={colors[i]} opacity="0.85">
            <animate attributeName="height" from="0" to={h} dur={`${0.4 + i * 0.15}s`} fill="freeze" />
            <animate attributeName="y" from="155" to={155 - h} dur={`${0.4 + i * 0.15}s`} fill="freeze" />
          </rect>
          <text x={77 + i * 68} y="155" textAnchor="middle" fontSize="9" fill={colors[i]} fontFamily="monospace">{labels[i]}</text>
        </g>
      ))}
      {/* Axes */}
      <line x1="40" y1="20" x2="40" y2="155" stroke="#6c63ff" strokeWidth="1.5" />
      <line x1="40" y1="155" x2="410" y2="155" stroke="#6c63ff" strokeWidth="1.5" />
      <text x="15" y="90" fontSize="10" fill="#9090a8" transform="rotate(-90,15,90)">Operations</text>
      <text x="220" y="12" textAnchor="middle" fontSize="11" fill="#e8e8f0" fontWeight="600">Growth Rate Comparison</text>
    </svg>
  );
}

function HeroArrays() {
  const vals = [12, 45, 7, 89, 23, 56, 34];
  const colors = ["#6c63ff", "#4ecdc4", "#ff6b6b", "#ffd166", "#43e97b", "#6c63ff", "#4ecdc4"];
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      <text x="210" y="20" textAnchor="middle" fontSize="11" fill="#9090a8" fontFamily="monospace">int[] arr = {"{12, 45, 7, 89, 23, 56, 34}"}</text>
      {/* Memory cells */}
      {vals.map((v, i) => (
        <g key={i}>
          <rect x={15 + i * 56} y="35" width="48" height="52" rx="6" fill="#1a1a25" stroke={colors[i]} strokeWidth="1.5" />
          <text x={39 + i * 56} y="58" textAnchor="middle" fontSize="16" fontWeight="700" fill={colors[i]}>{v}</text>
          <text x={39 + i * 56} y="76" textAnchor="middle" fontSize="9" fill="#9090a8" fontFamily="monospace">[{i}]</text>
          {/* Address */}
          <text x={39 + i * 56} y="100" textAnchor="middle" fontSize="8" fill="#5c5c7a" fontFamily="monospace">{(1000 + i * 4).toString(16).toUpperCase()}</text>
        </g>
      ))}
      {/* Contiguous memory arrow */}
      <path d="M15 120 L407 120" stroke="#6c63ff" strokeWidth="1" strokeDasharray="4 3" />
      <text x="210" y="135" textAnchor="middle" fontSize="10" fill="#6c63ff">Contiguous Memory — O(1) Random Access</text>
      {/* HEAD pointer */}
      <path d="M39 30 L39 20" stroke="#43e97b" strokeWidth="1.5" markerEnd="url(#ha)" />
      <text x="39" y="16" textAnchor="middle" fontSize="9" fill="#43e97b">HEAD</text>
      <defs><marker id="ha" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><circle cx="5" cy="5" r="3" fill="#43e97b" /></marker></defs>
    </svg>
  );
}

function HeroStrings() {
  const chars = ["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d"];
  const colors = ["#ff6b6b", "#ffd166", "#43e97b", "#4ecdc4", "#6c63ff", "#9090a8", "#ff6b6b", "#ffd166", "#43e97b", "#4ecdc4", "#6c63ff"];
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      <text x="210" y="18" textAnchor="middle" fontSize="11" fill="#9090a8" fontFamily="monospace">String s = "Hello World"</text>
      {chars.map((c, i) => (
        <g key={i}>
          <rect x={10 + i * 36} y="28" width="32" height="40" rx="5" fill="#1a1a25" stroke={colors[i]} strokeWidth="1.5" />
          <text x={26 + i * 36} y="52" textAnchor="middle" fontSize="16" fontWeight="700" fill={colors[i]}>{c === " " ? "·" : c}</text>
          <text x={26 + i * 36} y="80" textAnchor="middle" fontSize="8" fill="#5c5c7a" fontFamily="monospace">{i}</text>
        </g>
      ))}
      {/* Immutable badge */}
      <rect x="120" y="100" width="180" height="28" rx="14" fill="rgba(108,99,255,0.15)" stroke="#6c63ff" strokeWidth="1" />
      <text x="210" y="119" textAnchor="middle" fontSize="11" fill="#6c63ff" fontWeight="600">🔒 Immutable — Stored in String Pool</text>
      {/* Pool visual */}
      <rect x="10" y="135" width="400" height="18" rx="4" fill="rgba(67,233,123,0.08)" stroke="#43e97b" strokeWidth="0.5" />
      <text x="210" y="148" textAnchor="middle" fontSize="9" fill="#43e97b" fontFamily="monospace">String Pool (Method Area / Heap)</text>
    </svg>
  );
}

function HeroRecursion() {
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      {/* Call stack frames */}
      {[
        { y: 10, label: "factorial(5)", val: "5 × ...", color: "#6c63ff", w: 200 },
        { y: 38, label: "factorial(4)", val: "4 × ...", color: "#4ecdc4", w: 170 },
        { y: 66, label: "factorial(3)", val: "3 × ...", color: "#43e97b", w: 140 },
        { y: 94, label: "factorial(2)", val: "2 × ...", color: "#ffd166", w: 110 },
        { y: 122, label: "factorial(1)", val: "→ 1", color: "#ff6b6b", w: 80 },
      ].map((f, i) => (
        <g key={i}>
          <rect x="10" y={f.y} width={f.w} height="24" rx="4" fill="#1a1a25" stroke={f.color} strokeWidth="1.5" />
          <text x="18" y={f.y + 15} fontSize="10" fill={f.color} fontFamily="monospace">{f.label}</text>
          <text x={f.w - 30} y={f.y + 15} fontSize="10" fill="#9090a8" fontFamily="monospace">{f.val}</text>
        </g>
      ))}
      <text x="20" y="152" fontSize="9" fill="#9090a8">← Call Stack (grows down)</text>
      {/* Return values */}
      <text x="240" y="25" fontSize="10" fill="#6c63ff" fontFamily="monospace">5! = 120</text>
      <text x="240" y="50" fontSize="10" fill="#4ecdc4" fontFamily="monospace">4! = 24</text>
      <text x="240" y="75" fontSize="10" fill="#43e97b" fontFamily="monospace">3! = 6</text>
      <text x="240" y="100" fontSize="10" fill="#ffd166" fontFamily="monospace">2! = 2</text>
      <text x="240" y="130" fontSize="10" fill="#ff6b6b" fontFamily="monospace">BASE CASE → 1</text>
      {/* Arrows */}
      {[25, 53, 81, 109].map((y, i) => (
        <path key={i} d={`M220 ${y} L238 ${y}`} stroke="#5c5c7a" strokeWidth="1" markerEnd="url(#ra)" />
      ))}
      <defs><marker id="ra" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#5c5c7a" strokeWidth="1.5" /></marker></defs>
    </svg>
  );
}

function HeroControlFlow() {
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      {/* Flowchart */}
      {/* Start */}
      <ellipse cx="210" cy="18" rx="40" ry="12" fill="#6c63ff" opacity="0.9" />
      <text x="210" y="22" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">START</text>
      <line x1="210" y1="30" x2="210" y2="44" stroke="#9090a8" strokeWidth="1.5" />
      {/* Decision diamond */}
      <polygon points="210,44 250,72 210,100 170,72" fill="#1a1a25" stroke="#ffd166" strokeWidth="1.5" />
      <text x="210" y="70" textAnchor="middle" fontSize="9" fill="#ffd166">score</text>
      <text x="210" y="82" textAnchor="middle" fontSize="9" fill="#ffd166">{">= 60?"}</text>
      {/* Yes branch */}
      <line x1="250" y1="72" x2="310" y2="72" stroke="#43e97b" strokeWidth="1.5" />
      <text x="278" y="68" fontSize="9" fill="#43e97b">YES</text>
      <rect x="310" y="58" width="70" height="28" rx="6" fill="#1a1a25" stroke="#43e97b" strokeWidth="1.5" />
      <text x="345" y="76" textAnchor="middle" fontSize="10" fill="#43e97b">PASS ✓</text>
      {/* No branch */}
      <line x1="210" y1="100" x2="210" y2="114" stroke="#ff6b6b" strokeWidth="1.5" />
      <text x="220" y="110" fontSize="9" fill="#ff6b6b">NO</text>
      <rect x="170" y="114" width="80" height="28" rx="6" fill="#1a1a25" stroke="#ff6b6b" strokeWidth="1.5" />
      <text x="210" y="132" textAnchor="middle" fontSize="10" fill="#ff6b6b">FAIL ✗</text>
      {/* Loop indicator */}
      <rect x="10" y="50" width="120" height="60" rx="8" fill="rgba(78,205,196,0.08)" stroke="#4ecdc4" strokeWidth="1" />
      <text x="70" y="68" textAnchor="middle" fontSize="9" fill="#4ecdc4" fontFamily="monospace">for(i=0;</text>
      <text x="70" y="82" textAnchor="middle" fontSize="9" fill="#4ecdc4" fontFamily="monospace">i &lt; n; i++)</text>
      <path d="M10 80 Q0 80 0 100 Q0 120 10 120 L130 120 Q140 120 140 100 Q140 80 130 80" fill="none" stroke="#4ecdc4" strokeWidth="1" strokeDasharray="3 2" />
      <text x="70" y="148" textAnchor="middle" fontSize="9" fill="#4ecdc4">Loop ↺</text>
    </svg>
  );
}

function HeroLinkedList() {
  const nodes = [10, 25, 40, 67];
  const colors = ["#6c63ff", "#4ecdc4", "#43e97b", "#ffd166"];
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      <defs>
        <marker id="lla" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 2L8 5L2 8" fill="none" stroke="#9090a8" strokeWidth="1.5" />
        </marker>
      </defs>
      {/* HEAD label */}
      <text x="30" y="30" textAnchor="middle" fontSize="10" fill="#43e97b" fontWeight="600">HEAD</text>
      <line x1="30" y1="33" x2="30" y2="48" stroke="#43e97b" strokeWidth="1.5" markerEnd="url(#lla)" />
      {nodes.map((v, i) => (
        <g key={i}>
          {/* Data cell */}
          <rect x={10 + i * 96} y="50" width="52" height="50" rx="6" fill="#1a1a25" stroke={colors[i]} strokeWidth="1.5" />
          <text x={36 + i * 96} y="72" textAnchor="middle" fontSize="16" fontWeight="700" fill={colors[i]}>{v}</text>
          <text x={36 + i * 96} y="88" textAnchor="middle" fontSize="8" fill="#5c5c7a" fontFamily="monospace">data</text>
          {/* Next pointer cell */}
          <rect x={62 + i * 96} y="50" width="34" height="50" rx="6" fill="#0d0d16" stroke={colors[i]} strokeWidth="1" strokeDasharray="3 2" />
          <text x={79 + i * 96} y="78" textAnchor="middle" fontSize="9" fill="#9090a8" fontFamily="monospace">{i < 3 ? "next" : "NULL"}</text>
          {/* Arrow to next */}
          {i < 3 && <line x1={97 + i * 96} y1="75" x2={106 + i * 96} y2="75" stroke="#9090a8" strokeWidth="1.5" markerEnd="url(#lla)" />}
        </g>
      ))}
      {/* NULL terminator */}
      <rect x="394" y="62" width="22" height="26" rx="4" fill="#1a1a25" stroke="#ff6b6b" strokeWidth="1" />
      <text x="405" y="79" textAnchor="middle" fontSize="8" fill="#ff6b6b" fontFamily="monospace">∅</text>
      {/* Memory addresses */}
      {nodes.map((_, i) => (
        <text key={i} x={36 + i * 96} y="115" textAnchor="middle" fontSize="8" fill="#3a3a5a" fontFamily="monospace">0x{(256 + i * 32).toString(16).toUpperCase()}</text>
      ))}
      <text x="210" y="140" textAnchor="middle" fontSize="10" fill="#9090a8">Non-contiguous memory — connected by pointers</text>
    </svg>
  );
}

function HeroStack() {
  const items = [30, 20, 10];
  const colors = ["#ff6b6b", "#ffd166", "#6c63ff"];
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      {/* Stack container */}
      <rect x="140" y="10" width="140" height="140" rx="8" fill="#0d0d16" stroke="#6c63ff" strokeWidth="1.5" />
      {/* Stack items */}
      {items.map((v, i) => (
        <g key={i}>
          <rect x="148" y={20 + i * 38} width="124" height="32" rx="5" fill="#1a1a25" stroke={colors[i]} strokeWidth={i === 0 ? 2 : 1.5} />
          <text x="210" y={41 + i * 38} textAnchor="middle" fontSize="15" fontWeight="700" fill={colors[i]}>{v}</text>
          {i === 0 && <text x="280" y={41 + i * 38} fontSize="9" fill={colors[i]} fontFamily="monospace">← TOP</text>}
        </g>
      ))}
      {/* LIFO label */}
      <text x="210" y="148" textAnchor="middle" fontSize="10" fill="#9090a8">LIFO — Last In, First Out</text>
      {/* Push arrow */}
      <path d="M80 36 L138 36" stroke="#43e97b" strokeWidth="2" markerEnd="url(#sa)" />
      <text x="60" y="32" fontSize="10" fill="#43e97b" fontWeight="600">PUSH</text>
      <rect x="30" y="40" width="44" height="24" rx="4" fill="rgba(67,233,123,0.1)" stroke="#43e97b" strokeWidth="1" />
      <text x="52" y="56" textAnchor="middle" fontSize="13" fontWeight="700" fill="#43e97b">40</text>
      {/* Pop arrow */}
      <path d="M138 52 L90 52" stroke="#ff6b6b" strokeWidth="2" markerEnd="url(#pa)" />
      <text x="60" y="70" fontSize="10" fill="#ff6b6b" fontWeight="600">POP</text>
      {/* Operations */}
      <text x="340" y="40" fontSize="10" fill="#43e97b" fontFamily="monospace">push(x)</text>
      <text x="340" y="58" fontSize="10" fill="#ff6b6b" fontFamily="monospace">pop()</text>
      <text x="340" y="76" fontSize="10" fill="#ffd166" fontFamily="monospace">peek()</text>
      <text x="340" y="94" fontSize="9" fill="#9090a8" fontFamily="monospace">O(1) each</text>
      <defs>
        <marker id="sa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#43e97b" strokeWidth="1.5" /></marker>
        <marker id="pa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#ff6b6b" strokeWidth="1.5" /></marker>
      </defs>
    </svg>
  );
}

function HeroQueue() {
  const items = [10, 20, 30, 40];
  const colors = ["#43e97b", "#4ecdc4", "#6c63ff", "#ffd166"];
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      {/* Enqueue arrow */}
      <path d="M10 80 L38 80" stroke="#43e97b" strokeWidth="2" markerEnd="url(#qa)" />
      <text x="5" y="70" fontSize="9" fill="#43e97b" fontWeight="600">EN</text>
      <text x="5" y="82" fontSize="9" fill="#43e97b" fontWeight="600">QUEUE</text>
      {/* Queue items */}
      {items.map((v, i) => (
        <g key={i}>
          <rect x={42 + i * 82} y="56" width="74" height="48" rx="6" fill="#1a1a25" stroke={colors[i]} strokeWidth={i === 0 || i === 3 ? 2 : 1.5} />
          <text x={79 + i * 82} y="84" textAnchor="middle" fontSize="18" fontWeight="700" fill={colors[i]}>{v}</text>
          {i === 0 && <text x={79 + i * 82} y="96" textAnchor="middle" fontSize="8" fill={colors[i]} fontFamily="monospace">FRONT</text>}
          {i === 3 && <text x={79 + i * 82} y="96" textAnchor="middle" fontSize="8" fill={colors[i]} fontFamily="monospace">REAR</text>}
        </g>
      ))}
      {/* Dequeue arrow */}
      <path d="M382 80 L410 80" stroke="#ff6b6b" strokeWidth="2" markerEnd="url(#da)" />
      <text x="385" y="70" fontSize="9" fill="#ff6b6b" fontWeight="600">DE</text>
      <text x="385" y="82" fontSize="9" fill="#ff6b6b" fontWeight="600">QUEUE</text>
      {/* FIFO label */}
      <text x="210" y="125" textAnchor="middle" fontSize="10" fill="#9090a8">FIFO — First In, First Out</text>
      {/* Circular queue hint */}
      <path d="M42 140 Q210 155 382 140" fill="none" stroke="#6c63ff" strokeWidth="1" strokeDasharray="4 3" />
      <text x="210" y="152" textAnchor="middle" fontSize="9" fill="#6c63ff">Circular Queue wraps around →</text>
      <defs>
        <marker id="qa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#43e97b" strokeWidth="1.5" /></marker>
        <marker id="da" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#ff6b6b" strokeWidth="1.5" /></marker>
      </defs>
    </svg>
  );
}

function HeroTrees() {
  const nodes = [{ cx: 200, cy: 25, v: 1 }, { cx: 120, cy: 80, v: 2 }, { cx: 280, cy: 80, v: 3 }, { cx: 80, cy: 135, v: 4 }, { cx: 160, cy: 135, v: 5 }, { cx: 240, cy: 135, v: 6 }, { cx: 320, cy: 135, v: 7 }];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  return (
    <svg viewBox="0 0 400 165" style={{ width: "100%", maxWidth: 420 }}>
      {edges.map(([a, b]) => <line key={`${a}-${b}`} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy} stroke="#2a3a2a" strokeWidth="2" />)}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.cx} cy={n.cy} r="18" fill="#00b894" opacity="0.9" />
          <text x={n.cx} y={n.cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">{n.v}</text>
        </g>
      ))}
      <text x="200" y="158" textAnchor="middle" fontSize="10" fill="#9090a8">Binary Tree — 3 traversal orders</text>
    </svg>
  );
}

function HeroBST() {
  const nodes = [{ cx: 200, cy: 25, v: 50 }, { cx: 120, cy: 80, v: 30 }, { cx: 280, cy: 80, v: 70 }, { cx: 80, cy: 135, v: 20 }, { cx: 160, cy: 135, v: 40 }, { cx: 240, cy: 135, v: 60 }, { cx: 320, cy: 135, v: 80 }];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  return (
    <svg viewBox="0 0 400 165" style={{ width: "100%", maxWidth: 420 }}>
      {edges.map(([a, b]) => <line key={`${a}-${b}`} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy} stroke="#1a2a3a" strokeWidth="2" />)}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.cx} cy={n.cy} r="18" fill="#0984e3" opacity="0.9" />
          <text x={n.cx} y={n.cy + 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{n.v}</text>
        </g>
      ))}
      <text x="120" y="158" textAnchor="middle" fontSize="9" fill="#74b9ff">{"< root"}</text>
      <text x="280" y="158" textAnchor="middle" fontSize="9" fill="#74b9ff">{"> root"}</text>
    </svg>
  );
}

function HeroHeap() {
  const arr = [90, 70, 80, 50, 60, 30, 40];
  const pos = [{ cx: 200, cy: 30 }, { cx: 120, cy: 85 }, { cx: 280, cy: 85 }, { cx: 80, cy: 140 }, { cx: 160, cy: 140 }, { cx: 240, cy: 140 }, { cx: 320, cy: 140 }];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  return (
    <svg viewBox="0 0 400 165" style={{ width: "100%", maxWidth: 420 }}>
      <text x="200" y="12" textAnchor="middle" fontSize="9" fill="#9090a8" fontFamily="monospace">[90, 70, 80, 50, 60, 30, 40]</text>
      {edges.map(([a, b]) => <line key={`${a}-${b}`} x1={pos[a].cx} y1={pos[a].cy} x2={pos[b].cx} y2={pos[b].cy} stroke="#2a2a1a" strokeWidth="2" />)}
      {pos.map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r="18" fill="#e17055" opacity="0.9" />
          <text x={p.cx} y={p.cy + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">{arr[i]}</text>
        </g>
      ))}
    </svg>
  );
}

function HeroHashing() {
  const buckets = [42, null, null, 17, null, 31, null];
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      <defs><marker id="hha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M2 2L8 5L2 8" fill="none" stroke="#fdcb6e" strokeWidth="1.5" /></marker></defs>
      <text x="50" y="30" textAnchor="middle" fontSize="11" fill="#fdcb6e" fontWeight="600">key=42</text>
      <text x="50" y="44" textAnchor="middle" fontSize="9" fill="#9090a8">42 % 7 = 0</text>
      <path d="M80 35 L130 35" stroke="#fdcb6e" strokeWidth="1.5" markerEnd="url(#hha)" />
      {buckets.map((v, i) => (
        <g key={i}>
          <rect x="132" y={10 + i * 20} width="80" height="18" rx="3"
            fill={v !== null ? "rgba(253,203,110,0.15)" : "#1a1a25"}
            stroke={v !== null ? "#fdcb6e" : "#3a3a5a"} strokeWidth="1" />
          <text x="136" y={23 + i * 20} fontSize="9" fill="#5c5c7a" fontFamily="monospace">[{i}]</text>
          {v !== null && <text x="190" y={23 + i * 20} textAnchor="middle" fontSize="10" fontWeight="600" fill="#fdcb6e">{v}</text>}
        </g>
      ))}
      <text x="260" y="50" fontSize="10" fill="#9090a8">O(1) avg</text>
      <text x="260" y="65" fontSize="10" fill="#9090a8">lookup</text>
    </svg>
  );
}

function HeroGraphs() {
  const nodes = [{ id: "A", cx: 200, cy: 20 }, { id: "B", cx: 330, cy: 100 }, { id: "C", cx: 280, cy: 145 }, { id: "D", cx: 120, cy: 145 }, { id: "E", cx: 70, cy: 100 }];
  const edges = [["A", "B"], ["A", "E"], ["B", "C"], ["C", "D"], ["D", "E"], ["B", "D"]];
  const nm = {}; nodes.forEach(n => { nm[n.id] = n; });
  return (
    <svg viewBox="0 0 400 165" style={{ width: "100%", maxWidth: 420 }}>
      {edges.map(([a, b]) => <line key={`${a}-${b}`} x1={nm[a].cx} y1={nm[a].cy} x2={nm[b].cx} y2={nm[b].cy} stroke="#74b9ff" strokeWidth="1.5" opacity="0.6" />)}
      {nodes.map(n => (
        <g key={n.id}>
          <circle cx={n.cx} cy={n.cy} r="18" fill="#74b9ff" opacity="0.9" />
          <text x={n.cx} y={n.cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">{n.id}</text>
        </g>
      ))}
      <text x="200" y="162" textAnchor="middle" fontSize="9" fill="#9090a8">V=5, E=6 — undirected graph</text>
    </svg>
  );
}

function HeroBFS() {
  const nodes = [{ id: "A", cx: 200, cy: 20, lvl: 0 }, { id: "B", cx: 330, cy: 100, lvl: 1 }, { id: "C", cx: 280, cy: 145, lvl: 2 }, { id: "D", cx: 120, cy: 145, lvl: 2 }, { id: "E", cx: 70, cy: 100, lvl: 1 }];
  const edges = [["A", "B"], ["A", "E"], ["B", "C"], ["C", "D"], ["D", "E"], ["B", "D"]];
  const nm = {}; nodes.forEach(n => { nm[n.id] = n; });
  const lvlColors = ["#e17055", "#0984e3", "#00b894"];
  return (
    <svg viewBox="0 0 400 165" style={{ width: "100%", maxWidth: 420 }}>
      {edges.map(([a, b]) => <line key={`${a}-${b}`} x1={nm[a].cx} y1={nm[a].cy} x2={nm[b].cx} y2={nm[b].cy} stroke="#2a2a3a" strokeWidth="1.5" />)}
      {nodes.map(n => (
        <g key={n.id}>
          <circle cx={n.cx} cy={n.cy} r="18" fill={lvlColors[n.lvl]} opacity="0.9" />
          <text x={n.cx} y={n.cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">{n.id}</text>
        </g>
      ))}
      <text x="200" y="162" textAnchor="middle" fontSize="9" fill="#9090a8">Level 0=orange, 1=blue, 2=green</text>
    </svg>
  );
}

function HeroDFS() {
  const nodes = [{ id: "A", cx: 200, cy: 20 }, { id: "B", cx: 330, cy: 100 }, { id: "C", cx: 280, cy: 145 }, { id: "D", cx: 120, cy: 145 }, { id: "E", cx: 70, cy: 100 }];
  const edges = [["A", "B"], ["A", "E"], ["B", "C"], ["C", "D"], ["D", "E"], ["B", "D"]];
  const path = ["A", "B", "C", "D", "E"];
  const nm = {}; nodes.forEach(n => { nm[n.id] = n; });
  const colors = ["#6c5ce7", "#a29bfe", "#74b9ff", "#00cec9", "#55efc4"];
  return (
    <svg viewBox="0 0 400 165" style={{ width: "100%", maxWidth: 420 }}>
      {edges.map(([a, b]) => <line key={`${a}-${b}`} x1={nm[a].cx} y1={nm[a].cy} x2={nm[b].cx} y2={nm[b].cy} stroke="#2a2a3a" strokeWidth="1.5" />)}
      {nodes.map(n => {
        const idx = path.indexOf(n.id);
        return (
          <g key={n.id}>
            <circle cx={n.cx} cy={n.cy} r="18" fill={colors[idx]} opacity="0.9" />
            <text x={n.cx} y={n.cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">{n.id}</text>
          </g>
        );
      })}
      <text x="200" y="162" textAnchor="middle" fontSize="9" fill="#9090a8">DFS path: A→B→C→D→E</text>
    </svg>
  );
}

function HeroBacktracking() {
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      <circle cx="210" cy="20" r="14" fill="#e84393" opacity="0.9" />
      <text x="210" y="25" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">S</text>
      <line x1="210" y1="34" x2="130" y2="60" stroke="#9090a8" strokeWidth="1.5" />
      <line x1="210" y1="34" x2="290" y2="60" stroke="#9090a8" strokeWidth="1.5" />
      <circle cx="130" cy="70" r="12" fill="#e84393" opacity="0.8" />
      <text x="130" y="75" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">A</text>
      <circle cx="290" cy="70" r="12" fill="#e84393" opacity="0.8" />
      <text x="290" y="75" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">B</text>
      <line x1="130" y1="82" x2="90" y2="108" stroke="#9090a8" strokeWidth="1.5" />
      <line x1="130" y1="82" x2="170" y2="108" stroke="#ff6b6b" strokeWidth="1.5" strokeDasharray="4 2" />
      <line x1="290" y1="82" x2="250" y2="108" stroke="#9090a8" strokeWidth="1.5" />
      <line x1="290" y1="82" x2="330" y2="108" stroke="#9090a8" strokeWidth="1.5" />
      <circle cx="90" cy="118" r="12" fill="#00b894" opacity="0.9" />
      <text x="90" y="123" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">✓</text>
      <circle cx="170" cy="118" r="12" fill="#ff6b6b" opacity="0.9" />
      <text x="170" y="123" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">✗</text>
      <circle cx="250" cy="118" r="12" fill="#00b894" opacity="0.9" />
      <text x="250" y="123" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">✓</text>
      <circle cx="330" cy="118" r="12" fill="#ff6b6b" opacity="0.9" />
      <text x="330" y="123" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">✗</text>
      <text x="210" y="150" textAnchor="middle" fontSize="9" fill="#9090a8">Prune invalid branches early</text>
    </svg>
  );
}

function HeroGreedy() {
  const acts = [{ s: 1, e: 4, sel: true }, { s: 3, e: 5, sel: false }, { s: 0, e: 6, sel: false }, { s: 5, e: 7, sel: true }, { s: 8, e: 11, sel: true }];
  const maxT = 12;
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      <text x="10" y="14" fontSize="10" fill="#9090a8">Activity Selection — greedy by earliest finish</text>
      {acts.map((a, i) => {
        const x = 10 + (a.s / maxT) * 380, w = ((a.e - a.s) / maxT) * 380;
        return (
          <g key={i}>
            <rect x={x} y={22 + i * 26} width={w} height="20" rx="4"
              fill={a.sel ? "#f9ca24" : "#2a2a3a"}
              stroke={a.sel ? "#f9ca24" : "#5c5c7a"} strokeWidth="1.5" opacity={a.sel ? 1 : 0.5} />
            <text x={x + w / 2} y={36 + i * 26} textAnchor="middle" fontSize="9" fontWeight="600"
              fill={a.sel ? "#333" : "#9090a8"}>{a.s}-{a.e}</text>
            {a.sel && <text x={x + w + 4} y={36 + i * 26} fontSize="9" fill="#f9ca24">✓</text>}
          </g>
        );
      })}
      <text x="210" y="158" textAnchor="middle" fontSize="9" fill="#9090a8">Yellow = selected activities</text>
    </svg>
  );
}

function HeroDP() {
  const fib = [0, 1, 1, 2, 3, 5, 8, 13];
  return (
    <svg viewBox="0 0 420 160" style={{ width: "100%", maxWidth: 420 }}>
      <text x="210" y="16" textAnchor="middle" fontSize="10" fill="#9090a8">Fibonacci DP Table</text>
      {fib.map((v, i) => (
        <g key={i}>
          <rect x={10 + i * 50} y="24" width="44" height="40" rx="6"
            fill={i < 2 ? "rgba(186,220,88,0.3)" : "rgba(186,220,88,0.15)"}
            stroke="#badc58" strokeWidth="1.5" />
          <text x={32 + i * 50} y="48" textAnchor="middle" fontSize="16" fontWeight="700" fill="#badc58">{v}</text>
          <text x={32 + i * 50} y="76" textAnchor="middle" fontSize="9" fill="#9090a8" fontFamily="monospace">dp[{i}]</text>
        </g>
      ))}
      <text x="210" y="100" textAnchor="middle" fontSize="10" fill="#9090a8">dp[i] = dp[i-1] + dp[i-2]</text>
      <text x="210" y="115" textAnchor="middle" fontSize="9" fill="#badc58">O(n) time — no recomputation!</text>
      <rect x="10" y="125" width="390" height="28" rx="6" fill="rgba(186,220,88,0.08)" stroke="#badc58" strokeWidth="0.5" />
      <text x="210" y="143" textAnchor="middle" fontSize="10" fill="#badc58" fontFamily="monospace">Memoization | Tabulation | Space Opt.</text>
    </svg>
  );
}

const HERO_GRAPHICS = {
  basics: HeroBasics,
  complex: HeroComplexity,
  arrays: HeroArrays,
  strings: HeroStrings,
  recursion: HeroRecursion,
  control: HeroControlFlow,
  ll: HeroLinkedList,
  stack: HeroStack,
  queue: HeroQueue,
  trees: HeroTrees,
  bst: HeroBST,
  heap: HeroHeap,
  hashing: HeroHashing,
  graphs: HeroGraphs,
  bfs: HeroBFS,
  dfs: HeroDFS,
  backtrack: HeroBacktracking,
  greedy: HeroGreedy,
  dp: HeroDP,
};

const TOPICS = [
  { id: "basics", label: "Programming Basics", icon: "💻", color: "#6c63ff" },
  { id: "complex", label: "Complexity Analysis", icon: "📐", color: "#4ecdc4" },
  { id: "arrays", label: "Arrays", icon: "🗂️", color: "#43e97b" },
  { id: "strings", label: "Strings", icon: "🔤", color: "#ffd166" },
  { id: "recursion", label: "Recursion", icon: "🔄", color: "#ff9f43" },
  { id: "control", label: "Control Flow", icon: "🔁", color: "#ff6b6b" },
  { id: "ll", label: "Linked Lists", icon: "🔗", color: "#a29bfe" },
  { id: "stack", label: "Stack", icon: "📦", color: "#fd79a8" },
  { id: "queue", label: "Queue", icon: "🚶", color: "#55efc4" },
  { id: "trees", label: "Trees", icon: "🌳", color: "#00b894" },
  { id: "bst", label: "Binary Search Tree", icon: "🔍", color: "#0984e3" },
  { id: "heap", label: "Heap", icon: "⛰️", color: "#e17055" },
  { id: "hashing", label: "Hashing", icon: "#️⃣", color: "#fdcb6e" },
  { id: "graphs", label: "Graphs", icon: "🕸️", color: "#74b9ff" },
  { id: "bfs", label: "BFS", icon: "🌊", color: "#00cec9" },
  { id: "dfs", label: "DFS", icon: "🏔️", color: "#6c5ce7" },
  { id: "backtrack", label: "Backtracking", icon: "↩️", color: "#e84393" },
  { id: "greedy", label: "Greedy", icon: "💰", color: "#f9ca24" },
  { id: "dp", label: "Dynamic Programming", icon: "🧩", color: "#badc58" },
];

const hubCss = `
@keyframes hubFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes hubGlow   { 0%,100%{opacity:.6} 50%{opacity:1} }
@keyframes hubSlide  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

.hub-root { font-family: var(--font-sans, sans-serif); }

/* ── Topic selector grid ── */
.hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
  padding: 16px 0 0;
}
.hub-pill {
  position: relative;
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 8px 12px; border-radius: 12px; cursor: pointer;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  text-align: center; transition: all .2s;
  overflow: hidden;
}
.hub-pill::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--pill-color, #6c63ff);
  border-radius: 12px 12px 0 0;
}
.hub-pill:hover {
  border-color: var(--pill-color, #6c63ff);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.hub-pill.on {
  border-color: var(--pill-color, #6c63ff);
  background: var(--color-background-secondary);
  box-shadow: 0 0 0 2px var(--pill-color, #6c63ff), 0 4px 20px rgba(0,0,0,0.2);
}
.hub-pill.done {
  border-color: rgba(67,233,123,.5);
  background: rgba(67,233,123,.07);
}
.hub-pill.done::before { background: #43e97b; }
.hub-pill.done.on {
  box-shadow: 0 0 0 2px #43e97b, 0 4px 20px rgba(67,233,123,.25);
}
.hub-pill .p-done {
  position: absolute; top: 5px; right: 5px;
  width: 16px; height: 16px; border-radius: 50%;
  background: #43e97b; display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 900; color: #0a0e27;
  box-shadow: 0 0 6px rgba(67,233,123,.6);
}
.hub-pill .p-label {
  font-size: 11px; font-weight: 700;
  color: #ffffff !important; line-height: 1.3;
  word-break: break-word;
}
.hub-pill .p-num {
  font-size: 9px; font-weight: 700; font-family: var(--font-mono, monospace);
  color: var(--pill-color, #6c63ff); margin-bottom: 6px; opacity: .9;
}
.hub-pill .p-icon { font-size: 22px; margin-bottom: 8px; }
.hub-pill .p-desc { display: none; }

/* ── Hero banner ── */
.hub-hero {
  margin: 16px 0 0;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  animation: hubFadeUp .4s ease;
  border: 1px solid transparent;
  background:
    linear-gradient(var(--color-background-secondary), var(--color-background-secondary)) padding-box,
    linear-gradient(135deg, var(--hero-color, #6c63ff), var(--hero-color2, #4ecdc4)) border-box;
  box-shadow: 0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04);
}
/* Animated glow orbs */
.hub-hero::before {
  content:'';
  position:absolute; top:-60px; left:-60px;
  width:220px; height:220px; border-radius:50%;
  background: radial-gradient(circle, var(--hero-color, #6c63ff) 0%, transparent 70%);
  opacity:.18; pointer-events:none;
  animation: hubGlow 3s ease-in-out infinite;
}
.hub-hero::after {
  content:'';
  position:absolute; bottom:-40px; right:80px;
  width:180px; height:180px; border-radius:50%;
  background: radial-gradient(circle, var(--hero-color2, #4ecdc4) 0%, transparent 70%);
  opacity:.14; pointer-events:none;
  animation: hubGlow 3s ease-in-out infinite reverse;
}
.hub-hero-inner {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 0;
  min-height: 220px;
  position: relative; z-index: 1;
}
@media(max-width:700px){
  .hub-hero-inner{ grid-template-columns:1fr; }
  .hub-hero-graphic{ display:none; }
}
.hub-hero-left {
  padding: 32px 36px;
  display: flex; flex-direction: column; justify-content: center;
}
.hub-hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono, monospace);
  font-size: 10px; font-weight: 700; letter-spacing: 3px;
  text-transform: uppercase; color: var(--hero-color, #6c63ff);
  background: rgba(108,99,255,.1); border: 1px solid var(--hero-color, #6c63ff);
  padding: 4px 12px; border-radius: 20px;
  margin-bottom: 14px; width: fit-content;
}
.hub-hero-badge .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--hero-color, #6c63ff);
  animation: hubGlow 1.5s ease-in-out infinite;
}
.hub-hero-title {
  font-size: 30px; font-weight: 800;
  color: var(--color-text-primary); margin-bottom: 10px; line-height: 1.15;
  letter-spacing: -0.5px;
}
.hub-hero-title span {
  background: linear-gradient(135deg, var(--hero-color, #6c63ff), var(--hero-color2, #4ecdc4));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hub-hero-desc {
  font-size: 14px; color: var(--color-text-secondary);
  line-height: 1.7; max-width: 400px; margin-bottom: 20px;
}
.hub-hero-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
.hub-hero-tag {
  font-size: 11px; font-weight: 600; padding: 4px 12px;
  border-radius: 20px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.1);
  color: var(--color-text-secondary);
  font-family: var(--font-mono, monospace);
  transition: all .15s;
}
.hub-hero-tag:hover {
  border-color: var(--hero-color, #6c63ff);
  color: var(--hero-color, #6c63ff);
  background: rgba(108,99,255,.08);
}
/* Stats row */
.hub-hero-stats {
  display: flex; gap: 20px; flex-wrap: wrap;
}
.hub-hero-stat {
  display: flex; flex-direction: column; gap: 2px;
}
.hub-hero-stat .sv {
  font-size: 18px; font-weight: 800;
  background: linear-gradient(135deg, var(--hero-color, #6c63ff), var(--hero-color2, #4ecdc4));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--font-mono, monospace);
}
.hub-hero-stat .sl {
  font-size: 10px; color: var(--color-text-tertiary);
  text-transform: uppercase; letter-spacing: 1px;
}
/* Graphic panel */
.hub-hero-graphic {
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(0,0,0,.2), rgba(0,0,0,.08));
  border-left: 1px solid rgba(255,255,255,.06);
  position: relative;
}
.hub-hero-graphic::before {
  content:'';
  position:absolute; inset:0;
  background: radial-gradient(ellipse at center, var(--hero-color, #6c63ff)10 0%, transparent 70%);
  opacity:.08; pointer-events:none;
}

/* ── Progress ── */
.hub-progress-row {
  display: flex; align-items: center; gap: 10px;
  margin: 12px 0 20px;
}
.hub-progress-bar {
  flex: 1; height: 4px; background: var(--color-border-tertiary);
  border-radius: 2px; overflow: hidden;
}
.hub-progress-fill {
  height: 100%; border-radius: 2px;
  background: linear-gradient(90deg, var(--hero-color, #6c63ff), var(--hero-color2, #4ecdc4));
  transition: width .5s ease;
}
.hub-progress-label {
  font-size: 11px; color: var(--color-text-tertiary);
  font-family: var(--font-mono, monospace); white-space: nowrap;
}
`;

const TOPIC_META = {
  basics: { tags: ["Java Syntax", "Data Types", "Operators", "JVM", "main()"], color: "#6c63ff", color2: "#a29bfe", stats: [{ v: "17", l: "Sections" }, { v: "O(1)", l: "Access" }, { v: "JVM", l: "Runtime" }], desc: "Master the fundamentals of Java programming — from writing your first class to understanding how the JVM executes your code." },
  complex: { tags: ["Big-O", "Θ Theta", "Ω Omega", "Master Theorem", "Recurrences"], color: "#4ecdc4", color2: "#43e97b", stats: [{ v: "5", l: "Notations" }, { v: "O(n²)", l: "Worst" }, { v: "log n", l: "Best" }], desc: "Learn to measure algorithm efficiency mathematically. Understand why O(n log n) beats O(n²) and how to solve divide-and-conquer recurrences." },
  arrays: { tags: ["1D Arrays", "2D Arrays", "Memory Layout", "Insert", "Delete"], color: "#43e97b", color2: "#4ecdc4", stats: [{ v: "O(1)", l: "Access" }, { v: "O(n)", l: "Insert" }, { v: "4B", l: "int size" }], desc: "Arrays are the foundation of all data structures. Understand contiguous memory, O(1) access, and how insertion/deletion works under the hood." },
  strings: { tags: ["Immutability", "String Pool", "Methods", "StringBuilder", "Tokenizer"], color: "#ffd166", color2: "#ff9f43", stats: [{ v: "60+", l: "Methods" }, { v: "O(n)", l: "Concat" }, { v: "Pool", l: "Memory" }], desc: "Strings are everywhere. Learn why they're immutable, how the String Pool saves memory, and master 60+ built-in methods with live examples." },
  recursion: { tags: ["Base Case", "Call Stack", "Fibonacci", "Tower of Hanoi", "Memoization"], color: "#ff9f43", color2: "#ff6b6b", stats: [{ v: "O(2ⁿ)", l: "Naive Fib" }, { v: "O(n)", l: "Memoized" }, { v: "∞", l: "Without Base" }], desc: "Recursion is thinking in smaller problems. Visualize the call stack, understand base cases, and see how memoization turns O(2ⁿ) into O(n)." },
  control: { tags: ["if/else", "switch", "for", "while", "Patterns", "Playground"], color: "#ff6b6b", color2: "#fd79a8", stats: [{ v: "4", l: "Loop Types" }, { v: "8+", l: "Patterns" }, { v: "Live", l: "Playground" }], desc: "Control flow is the skeleton of every program. Master decision constructs, all loop types, jump statements, and build star patterns from scratch." },
  ll: { tags: ["Singly LL", "Doubly LL", "Circular LL", "Traversal", "Pointers"], color: "#a29bfe", color2: "#6c63ff", stats: [{ v: "O(1)", l: "Insert Head" }, { v: "O(n)", l: "Search" }, { v: "3", l: "LL Types" }], desc: "Linked lists store data in non-contiguous memory connected by pointers. Learn insertion, deletion, and the three types with interactive visualizers." },
  stack: { tags: ["LIFO", "push/pop", "Balanced Brackets", "Infix→Postfix", "Call Stack"], color: "#fd79a8", color2: "#ff6b6b", stats: [{ v: "O(1)", l: "Push/Pop" }, { v: "LIFO", l: "Order" }, { v: "∞", l: "Without Limit" }], desc: "Stacks follow Last In First Out. See how your function calls work, check balanced brackets, and convert infix expressions to postfix." },
  queue: { tags: ["FIFO", "Circular Queue", "Deque", "Priority Queue", "BFS"], color: "#55efc4", color2: "#4ecdc4", stats: [{ v: "O(1)", l: "Enqueue" }, { v: "FIFO", l: "Order" }, { v: "360°", l: "Circular" }], desc: "Queues follow First In First Out. Explore circular queues that eliminate wasted space, double-ended deques, and priority-based ordering." },
  trees: { tags: ["Root", "Leaf", "Height", "Inorder", "Preorder", "Postorder"], color: "#00b894", color2: "#55efc4", stats: [{ v: "O(n)", l: "Traversal" }, { v: "O(h)", l: "Search" }, { v: "3", l: "Traversals" }], desc: "Trees are hierarchical structures. Master binary trees, traversal algorithms, and understand how height affects performance." },
  bst: { tags: ["BST Property", "Search", "Insert", "Delete", "O(log n)"], color: "#0984e3", color2: "#74b9ff", stats: [{ v: "O(log n)", l: "Search" }, { v: "O(h)", l: "Insert" }, { v: "3", l: "Delete Cases" }], desc: "Binary Search Trees maintain sorted order. Every left child is smaller, every right child is larger — enabling O(log n) search." },
  heap: { tags: ["Min-Heap", "Max-Heap", "Heapify", "Heap Sort", "Priority"], color: "#e17055", color2: "#fdcb6e", stats: [{ v: "O(log n)", l: "Insert" }, { v: "O(n)", l: "Build Heap" }, { v: "O(1)", l: "Get Max" }], desc: "Heaps are complete binary trees with the heap property. The root is always the max (or min), enabling O(1) access to the extreme value." },
  hashing: { tags: ["Hash Function", "Collision", "Chaining", "Open Addressing", "HashMap"], color: "#fdcb6e", color2: "#f9ca24", stats: [{ v: "O(1)", l: "Avg Lookup" }, { v: "O(n)", l: "Worst Case" }, { v: "0.75", l: "Load Factor" }], desc: "Hash tables achieve O(1) average lookup by mapping keys to array indices. Learn collision resolution and Java's HashMap internals." },
  graphs: { tags: ["Vertices", "Edges", "Directed", "Undirected", "Adjacency"], color: "#74b9ff", color2: "#0984e3", stats: [{ v: "V+E", l: "Space" }, { v: "O(V²)", l: "Matrix" }, { v: "O(V+E)", l: "List" }], desc: "Graphs model relationships between objects. Master adjacency representations, directed vs undirected, and weighted graphs." },
  bfs: { tags: ["Level Order", "Queue", "Shortest Path", "O(V+E)", "Web Crawl"], color: "#00cec9", color2: "#55efc4", stats: [{ v: "O(V+E)", l: "Time" }, { v: "O(V)", l: "Space" }, { v: "Queue", l: "Uses" }], desc: "BFS explores level by level using a queue. It guarantees the shortest path in unweighted graphs and is used in web crawlers." },
  dfs: { tags: ["Stack", "Recursion", "Backtrack", "Topological", "Cycle"], color: "#6c5ce7", color2: "#a29bfe", stats: [{ v: "O(V+E)", l: "Time" }, { v: "O(V)", l: "Space" }, { v: "Stack", l: "Uses" }], desc: "DFS dives as deep as possible before backtracking. Essential for topological sorting, cycle detection, and maze solving." },
  backtrack: { tags: ["Pruning", "N-Queens", "Permutations", "Subsets", "State"], color: "#e84393", color2: "#fd79a8", stats: [{ v: "O(n!)", l: "Permutations" }, { v: "O(2ⁿ)", l: "Subsets" }, { v: "Prune", l: "Key Idea" }], desc: "Backtracking builds solutions incrementally and abandons paths that can't lead to a valid answer — pruning the search tree." },
  greedy: { tags: ["Greedy Choice", "Activity Selection", "Knapsack", "Huffman", "Local Optimal"], color: "#f9ca24", color2: "#fdcb6e", stats: [{ v: "O(n log n)", l: "Activity Sel." }, { v: "O(n)", l: "Fractional" }, { v: "Local", l: "Choice" }], desc: "Greedy algorithms make the locally optimal choice at each step. Fast and simple — but only correct when the greedy property holds." },
  dp: { tags: ["Memoization", "Tabulation", "Fibonacci", "Knapsack", "LCS"], color: "#badc58", color2: "#55efc4", stats: [{ v: "O(n)", l: "Fib DP" }, { v: "O(nW)", l: "Knapsack" }, { v: "2", l: "Approaches" }], desc: "Dynamic Programming solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation." },
};

export default function DSAHub({ onMarkComplete, completedTopics = [] }) {
  const [topicIdx, setTopicIdx] = useState(0);
  const [isOnLastChapter, setIsOnLastChapter] = useState(false);
  const topic = TOPICS[topicIdx];
  const meta = TOPIC_META[topic.id];
  const HeroGraphic = HERO_GRAPHICS[topic.id];
  const isDone = completedTopics.includes(topic.id);

  function goTo(idx) {
    setTopicIdx(idx);
    setIsOnLastChapter(false); // reset when switching topics
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pct = Math.round(((topicIdx + 1) / TOPICS.length) * 100);
  const prev = topicIdx > 0 ? () => goTo(topicIdx - 1) : undefined;
  const next = topicIdx < TOPICS.length - 1 ? () => goTo(topicIdx + 1) : undefined;

  // Called by each tutorial when chapter changes
  const onChapterChange = (curIdx, totalChapters) => {
    setIsOnLastChapter(curIdx === totalChapters - 1);
  };

  function renderTopic() {
    // Only show mark-complete bar when on the last chapter of the topic
    const markBar = (onMarkComplete && isOnLastChapter) ? (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 0 8px", borderTop: "0.5px solid var(--color-border-tertiary)",
        marginTop: 8
      }}>
        {isDone ? (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 24px", borderRadius: 12,
            background: "rgba(67,233,123,.1)", border: "1px solid rgba(67,233,123,.3)",
            color: "#43e97b", fontWeight: 700, fontSize: 14
          }}>
            ✅ {topic.label} Completed! +{TOPIC_META[topic.id]?.stats?.[0]?.v || ""} XP earned
          </div>
        ) : (
          <button onClick={() => onMarkComplete(topic.id)} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "13px 32px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#43e97b,#00b894)",
            color: "#0a0e27", fontWeight: 800, fontSize: 15,
            boxShadow: "0 4px 20px rgba(67,233,123,.35)",
            transition: "all .2s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            🎯 Mark "{topic.label}" as Completed
          </button>
        )}
      </div>
    ) : null;

    const wrap = (el) => <>{el}{markBar}</>;

    switch (topic.id) {
      case "basics": return wrap(<DSATutorial mode="basics" onNext={next} onChapterChange={onChapterChange} />);
      case "complex": return wrap(<DSATutorial mode="complexity" onNext={next} onChapterChange={onChapterChange} />);
      case "arrays": return wrap(<ArraysTopic onPrev={prev} onNext={next} onChapterChange={onChapterChange} />);
      case "strings": return wrap(<StringsTutorial onPrev={prev} onNext={next} onChapterChange={onChapterChange} />);
      case "recursion": return wrap(<RecursionTopic onPrev={prev} onNext={next} onChapterChange={onChapterChange} />);
      case "control": return wrap(<ControlFlow onPrev={prev} onNext={next} onChapterChange={onChapterChange} />);
      case "ll": return wrap(<LinkedList onPrev={prev} onNext={next} onChapterChange={onChapterChange} />);
      case "stack": return wrap(<StackTopic onPrev={prev} onNext={next} onChapterChange={onChapterChange} />);
      case "queue": return wrap(<QueueTopic onPrev={prev} onNext={next} onChapterChange={onChapterChange} />);
      case "backtrack": return wrap(<Backtracking onPrev={prev} onNext={next} onChapterChange={onChapterChange} />);
      case "trees":
      case "bst":
      case "heap":
      case "hashing":
      case "graphs":
      case "bfs":
      case "dfs":
      case "greedy":
      case "dp":
        return wrap(
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9090a8" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#e0e0f0" }}>Coming Soon</div>
            <div style={{ fontSize: 14 }}>This tutorial is under construction. Check back soon!</div>
          </div>
        );
      default: return null;
    }
  }

  return (
    <div className="hub-root" style={{ "--hero-color": meta.color, "--hero-color-a": meta.color + "22", "--hero-color2": meta.color2 }}>
      <style>{hubCss}</style>

      {/* ── Topic selector grid ── */}
      <div className="hub-grid">
        {TOPICS.map((t, i) => {
          const done = completedTopics.includes(t.id);
          return (
            <button key={t.id}
              className={`hub-pill${topicIdx === i ? " on" : ""}${done ? " done" : ""}`}
              style={{ "--pill-color": t.color }}
              onClick={() => goTo(i)}>
              {done && <span className="p-done">✓</span>}
              <span className="p-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="p-icon">{done ? "✅" : t.icon}</span>
              <span className="p-label">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Progress bar ── */}
      <div className="hub-progress-row">
        <div className="hub-progress-bar">
          <div className="hub-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="hub-progress-label">{topicIdx + 1}/{TOPICS.length} — {pct}%</span>
      </div>

      {/* ── Hero banner ── */}
      <div className="hub-hero">
        <div className="hub-hero-inner">
          <div className="hub-hero-left">
            <div className="hub-hero-badge">
              <span className="dot" />
              Topic {String(topicIdx + 1).padStart(2, "0")} of {TOPICS.length}
            </div>
            <div className="hub-hero-title">
              {topic.icon} <span>{topic.label}</span>
            </div>
            <div className="hub-hero-desc">{meta.desc}</div>
            <div className="hub-hero-tags">
              {meta.tags.map(tag => <span key={tag} className="hub-hero-tag">{tag}</span>)}
            </div>
            <div className="hub-hero-stats">
              {meta.stats.map(s => (
                <div key={s.l} className="hub-hero-stat">
                  <span className="sv">{s.v}</span>
                  <span className="sl">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hub-hero-graphic">
            {HeroGraphic && <HeroGraphic />}
          </div>
        </div>
      </div>

      {/* ── Active tutorial content ── */}
      <div style={{ marginTop: 24 }}>
        {renderTopic()}
      </div>
    </div>
  );
}
