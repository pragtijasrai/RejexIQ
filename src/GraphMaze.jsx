import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Stars, Float } from "@react-three/drei";
import * as THREE from "three";

const NODE_POSITIONS = [
  [0, 3, -4], [-3, 1.5, -3], [3, 1.5, -3],
  [-4, -0.5, -2], [0, 0, -2], [4, -0.5, -2]
];
const EDGES = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,4],[4,5]];

function GraphNode({ position, index, active }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 0.8 + index) * 0.12;
  });
  const color = active ? "#34d399" : "#0d2e22";
  return (
    <group>
      <mesh ref={ref} position={position} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.5 : 0.1} metalness={0.5} roughness={0.3} />
      </mesh>
      <Text position={[position[0], position[1] + 0.55, position[2]]} fontSize={0.22} color="#94a3b8" anchorX="center">{index}</Text>
    </group>
  );
}

function GraphEdge({ from, to }) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const dir = end.clone().sub(start);
  const len = dir.length();
  const quat = new THREE.Quaternion();
  quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.03, 0.03, len, 6]} />
      <meshBasicMaterial color="#34d399" transparent opacity={0.3} />
    </mesh>
  );
}

function AnswerCube({ position, label, text, state, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const colorMap = { idle: "#0a1f1a", correct: "#10b981", wrong: "#ef4444" };
  useFrame((s) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(s.clock.elapsedTime + position[0]) * 0.1;
    if (state === "wrong") meshRef.current.position.x = position[0] + Math.sin(s.clock.elapsedTime * 20) * 0.07;
    else meshRef.current.position.x = position[0];
    const t = hovered ? 1.12 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.1);
  });
  return (
    <group>
      <mesh ref={meshRef} position={position} castShadow
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={colorMap[state] || colorMap.idle} emissive={colorMap[state] || "#000"} emissiveIntensity={state !== "idle" ? 0.4 : (hovered ? 0.3 : 0.05)} metalness={0.4} roughness={0.5} />
      </mesh>
      {hovered && <mesh position={position}><torusGeometry args={[1.05, 0.04, 8, 32]} /><meshBasicMaterial color="#34d399" transparent opacity={0.7} /></mesh>}
      <Text position={[position[0], position[1] + 1.0, position[2]]} fontSize={0.25} color="#94a3b8" anchorX="center">{label}</Text>
      <Text position={[position[0], position[1], position[2] + 0.8]} fontSize={0.2} color="#f0f4ff" anchorX="center" anchorY="middle" maxWidth={1.3}>{text}</Text>
    </group>
  );
}

function MazeScene({ mission, onAnswer, answerStates }) {
  const cubePositions = [[-4.5, 0, 0], [-1.5, 0, 0], [1.5, 0, 0], [4.5, 0, 0]];
  const labels = ["A", "B", "C", "D"];
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 8, 0]} intensity={1.0} color="#34d399" />
      <pointLight position={[-6, 2, -4]} intensity={0.5} color="#10b981" />
      <pointLight position={[6, 2, -4]} intensity={0.5} color="#34d399" />
      <Stars radius={70} depth={40} count={2500} factor={3} fade speed={0.4} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#050f0a" />
      </mesh>
      <gridHelper args={[40, 40, "#0d2e22", "#0d2e22"]} position={[0, -2.99, 0]} />
      {}
      {NODE_POSITIONS.map((pos, i) => <GraphNode key={i} position={pos} index={i} active={i % 3 === 0} />)}
      {EDGES.map(([a, b], i) => <GraphEdge key={i} from={NODE_POSITIONS[a]} to={NODE_POSITIONS[b]} />)}
      {}
      {mission?.options.map((opt, i) => (
        <AnswerCube key={i} position={cubePositions[i]} label={labels[i]} text={opt} state={answerStates[i]} onClick={() => onAnswer(opt, i)} />
      ))}
      <OrbitControls enablePan={false} minDistance={6} maxDistance={18} maxPolarAngle={Math.PI / 2} />
    </>
  );
}

export default function GraphMaze({ mission, onAnswer, answerStates, feedback }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas shadows camera={{ position: [0, 4, 12], fov: 60 }} style={{ background: "linear-gradient(180deg, #020a06 0%, #050f0a 100%)" }}>
        <Suspense fallback={null}>
          <MazeScene mission={mission} onAnswer={onAnswer} answerStates={answerStates} />
        </Suspense>
      </Canvas>
      {feedback && (
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: feedback.correct ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${feedback.correct ? "#10b981" : "#ef4444"}`, borderRadius: 12, padding: "16px 28px", maxWidth: 500, textAlign: "center", backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>{feedback.correct ? "✅ Correct!" : "❌ Wrong!"}</div>
          {feedback.correct && <div style={{ color: "#fbbf24", fontWeight: 700, marginBottom: 6 }}>+{feedback.xpGained} XP</div>}
          {!feedback.correct && <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>Correct: <span style={{ color: "#10b981", fontWeight: 600 }}>{feedback.correctAnswer}</span></div>}
          <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>{feedback.explanation}</div>
        </div>
      )}
    </div>
  );
}
