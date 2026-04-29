import { useState } from "react";
import WorldMap from "./WorldMap";
import MissionEngine from "./MissionEngine";

/**
 * StoryMode — top-level entry point
 * Manages: WorldMap → MissionEngine flow
 */
export default function StoryMode({ user, onExit }) {
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [liveProgress, setLiveProgress] = useState(null);

  // Use a stable userId — fall back to "guest" for demo
  const userId = user?.id || "guest";

  function handleSelectWorld(world) {
    setSelectedWorld(world);
  }

  function handleExitMission() {
    setSelectedWorld(null);
  }

  function handleXpUpdate(progress) {
    setLiveProgress(progress);
  }

  if (selectedWorld) {
    return (
      <MissionEngine
        world={selectedWorld}
        userId={userId}
        onExit={handleExitMission}
        onXpUpdate={handleXpUpdate}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e27" }}>
      {/* Inject keyframe animations needed by child components */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>

      <WorldMap
        userId={userId}
        onSelectWorld={handleSelectWorld}
        onBack={onExit}
      />
    </div>
  );
}
