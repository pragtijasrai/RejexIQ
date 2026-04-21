import { useState } from "react";
import DSATutorial     from "./DSATutorial.jsx";
import ArraysRecursion from "./ArraysRecursion.jsx";
import ControlFlow     from "./ControlFlow.jsx";
import StringsTutorial from "./StringsTutorial.jsx";
import LinkedList      from "./LinkedList.jsx";
import StacksQueues    from "./StacksQueues.jsx";

// Recursion = ArraysRecursion starting at the recursion chapter
function RecursionTopic({ onPrev, onNext }) {
  return <ArraysRecursion onPrev={onPrev} onNext={onNext} _startAt="rec" />;
}
// Arrays = ArraysRecursion starting at arrays (default)
function ArraysTopic({ onPrev, onNext }) {
  return <ArraysRecursion onPrev={onPrev} onNext={onNext} _startAt="arr" />;
}
// Stack = StacksQueues starting at stack
function StackTopic({ onPrev, onNext }) {
  return <StacksQueues onPrev={onPrev} onNext={onNext} _startAt="stack" />;
}
// Queue = StacksQueues starting at queue
function QueueTopic({ onPrev, onNext }) {
  return <StacksQueues onPrev={onPrev} onNext={onNext} _startAt="queue" />;
}

const TOPICS = [
  { id:"basics",    label:"Programming Basics",  icon:"💻" },
  { id:"complex",   label:"Complexity Analysis", icon:"📐" },
  { id:"arrays",    label:"Arrays",              icon:"🗂️" },
  { id:"strings",   label:"Strings",             icon:"🔤" },
  { id:"recursion", label:"Recursion",           icon:"🔄" },
  { id:"control",   label:"Control Flow",        icon:"🔁" },
  { id:"ll",        label:"Linked Lists",        icon:"🔗" },
  { id:"stack",     label:"Stack",               icon:"📦" },
  { id:"queue",     label:"Queue",               icon:"🚶" },
];

const hubCss = `
.hub-root { font-family: var(--font-sans, sans-serif); }
.hub-steps {
  display: flex; gap: 6px; flex-wrap: wrap;
  padding: 16px 0 20px;
  border-bottom: 0.5px solid var(--color-border-tertiary);
  margin-bottom: 0;
}
.hub-step {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
  border: 0.5px solid var(--color-border-secondary);
  background: transparent; color: var(--color-text-secondary);
  cursor: pointer; transition: all .15s;
}
.hub-step:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
.hub-step.on {
  background: var(--color-text-primary);
  color: var(--color-background-primary);
  border-color: transparent;
}
.hub-step .num {
  width: 18px; height: 18px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
  background: rgba(255,255,255,0.2);
}
.hub-step.on .num { background: rgba(0,0,0,0.2); }
.hub-progress {
  height: 3px; background: var(--color-border-tertiary);
  border-radius: 2px; margin-bottom: 0; overflow: hidden;
}
.hub-progress-fill {
  height: 100%; border-radius: 2px;
  background: var(--color-text-primary);
  transition: width .4s ease;
}
`;

export default function DSAHub() {
  const [topicIdx, setTopicIdx] = useState(0);

  function goTo(idx) {
    setTopicIdx(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pct = Math.round(((topicIdx + 1) / TOPICS.length) * 100);
  const prev = topicIdx > 0 ? () => goTo(topicIdx - 1) : undefined;
  const next = topicIdx < TOPICS.length - 1 ? () => goTo(topicIdx + 1) : undefined;

  function renderTopic() {
    switch (TOPICS[topicIdx].id) {
      case "basics":    return <DSATutorial     onNext={next} />;
      case "complex":   return <DSATutorial     onNext={next} />;
      case "arrays":    return <ArraysTopic     onPrev={prev} onNext={next} />;
      case "strings":   return <StringsTutorial onPrev={prev} onNext={next} />;
      case "recursion": return <RecursionTopic  onPrev={prev} onNext={next} />;
      case "control":   return <ControlFlow     onPrev={prev} onNext={next} />;
      case "ll":        return <LinkedList      onPrev={prev} onNext={next} />;
      case "stack":     return <StackTopic      onPrev={prev} onNext={next} />;
      case "queue":     return <QueueTopic      onPrev={prev} onNext={next} />;
      default:          return null;
    }
  }

  return (
    <div className="hub-root">
      <style>{hubCss}</style>

      {/* Topic breadcrumb nav */}
      <div className="hub-steps">
        {TOPICS.map((t, i) => (
          <button
            key={t.id}
            className={`hub-step${topicIdx === i ? " on" : ""}`}
            onClick={() => goTo(i)}
          >
            <span className="num">{i + 1}</span>
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="hub-progress" style={{margin:"10px 0 0"}}>
        <div className="hub-progress-fill" style={{width:`${pct}%`}} />
      </div>
      <div style={{fontSize:11,color:"var(--color-text-tertiary)",textAlign:"right",marginBottom:8}}>
        Topic {topicIdx + 1} of {TOPICS.length} — {pct}% complete
      </div>

      {/* Active tutorial */}
      {renderTopic()}
    </div>
  );
}
