import { useState } from "react";

const G = {
  card: "#1a2347", border: "#2d3a5f", accent: "#ff6b9d",
  text: "#f0f4ff", muted: "#94a3b8", surface: "#141b3a",
};

export default function FilterBar({ search, onSearch, difficulty, onDifficulty, topic, onTopic }) {
  const [searchFocus, setSearchFocus] = useState(false);

  const selectStyle = {
    background: G.card,
    border: `1px solid ${G.border}`,
    borderRadius: 10,
    padding: "10px 14px",
    color: G.text,
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 32,
    minWidth: 140,
  };

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
      {/* Search */}
      <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
        <span style={{
          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
          fontSize: 14, color: G.muted, pointerEvents: "none",
        }}>🔍</span>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          placeholder="Search problems..."
          style={{
            width: "100%",
            background: G.card,
            border: `1px solid ${searchFocus ? G.accent : G.border}`,
            borderRadius: 10,
            padding: "10px 14px 10px 36px",
            color: G.text,
            fontSize: 13,
            outline: "none",
            fontFamily: "'Inter', sans-serif",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: searchFocus ? `0 0 0 3px rgba(255,107,157,0.1)` : "none",
          }}
        />
      </div>

      {/* Difficulty */}
      <select value={difficulty} onChange={e => onDifficulty(e.target.value)} style={selectStyle}>
        <option value="all">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Topic */}
      <select value={topic} onChange={e => onTopic(e.target.value)} style={selectStyle}>
        <option value="all">All Topics</option>
        <option value="array">Arrays</option>
        <option value="string">Strings</option>
        <option value="tree">Trees</option>
        <option value="graph">Graphs</option>
        <option value="dp">Dynamic Programming</option>
        <option value="stack">Stack / Queue</option>
        <option value="design">Design</option>
      </select>
    </div>
  );
}
