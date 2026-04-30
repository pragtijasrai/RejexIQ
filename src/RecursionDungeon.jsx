import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Stars, Float } from "@react-three/drei";
import * as THREE from "three";

function RecursiveSpiral({ depth = 0, maxDepth = 5, position = [0, 0, 0] }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * (0.3 + depth * 0.1);
  });
  if (depth > maxDepth) return null;
  const scale = 1 - depth * 0.15;
  const color = `hsl(${270 + depth * 20}, 80%, ${50 + depth * 5}%)`;
  return (
    <group position={position} ref={ref}>
      <mesh scale={[scale, scale, scale]}>
        <torusGeometry args={[1.2 - depth * 0.15, 0.06, 8, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <RecursiveSpiral depth={depth + 1} maxDepth={maxDepth} position={[0, 0.6, 0]} />
    </group>
  );
}

function AnswerCube({ position, label, text, state, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const colorMap = { idle: "#1a0a2e", correct: "#10b981", wrong: "#ef4444" };

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
      {hovered && <mesh position={position}><torusGeometry args={[1.05, 0.04, 8, 32]} /><meshBasicMaterial color="#c084fc" transparent opacity={0.7} /></mesh>}
      <Text position={[position[0], position[1] + 1.0, position[2]]} fontSize={0.25} color="#94a3b8" anchorX="center">{label}</Text>
      <Text position={[position[0], position[1], position[2] + 0.8]} fontSize={0.2} color="#f0f4ff" anchorX="center" anchorY="middle" maxWidth={1.3}>{text}</Text>
    </group>
  );
}

function DungeonScene({ mission, onAnswer, answerStates }) {
  const cubePositions = [[-4.5, 0, 0], [-1.5, 0, 0], [1.5, 0, 0], [4.5, 0, 0]];
  const labels = ["A", "B", "C", "D"];
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 8, 0]} intensity={1.2} color="#c084fc" />
      <pointLight position={[-6, 2, -4]} intensity={0.6} color="#7c3aed" />
      <pointLight position={[6, 2, -4]} intensity={0.6} color="#c084fc" />
      <Stars radius={60} depth={40} count={2000} factor={3} fade speed={0.3} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0d0520" />
      </mesh>
      <gridHelper args={[40, 40, "#2d1b4e", "#2d1b4e"]} position={[0, -2.99, 0]} />
      <Float speed={0.8} floatIntensity={0.2}>
        <group position={[0, 3.5, -4]}>
          <RecursiveSpiral depth={0} maxDepth={4} />
        </group>
      </Float>
      {mission?.options.map((opt, i) => (
        <AnswerCube key={i} position={cubePositions[i]} label={labels[i]} text={opt} state={answerStates[i]} onClick={() => onAnswer(opt, i)} />
      ))}
      <OrbitControls enablePan={false} minDistance={6} maxDistance={18} maxPolarAngle={Math.PI / 2} />
    </>
  );
}

export default function RecursionDungeon({ mission, onAnswer, answerStates, feedback }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas shadows camera={{ position: [0, 4, 12], fov: 60 }} style={{ background: "linear-gradient(180deg, #0d0520 0%, #1a0a2e 100%)" }}>
        <Suspense fallback={null}>
          <DungeonScene mission={mission} onAnswer={onAnswer} answerStates={answerStates} />
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
