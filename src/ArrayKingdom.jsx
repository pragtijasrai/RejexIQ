import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// ── CAMERA FLY-IN ─────────────────────────────────────────────────────────────
function CameraFlyIn() {
  const { camera } = useThree();
  const t = useRef(0);
  const done = useRef(false);
  useFrame((_, delta) => {
    if (done.current) return;
    t.current = Math.min(t.current + delta * 0.6, 1);
    const ease = 1 - Math.pow(1 - t.current, 3);
    camera.position.set(
      THREE.MathUtils.lerp(0, 0, ease),
      THREE.MathUtils.lerp(18, 4, ease),
      THREE.MathUtils.lerp(28, 12, ease)
    );
    camera.lookAt(0, 0, 0);
    if (t.current >= 1) done.current = true;
  });
  return null;
}

// ── PULSE WAVE FLOOR ──────────────────────────────────────────────────────────
function PulseFloor({ color = "#00e5ff" }) {
  const rings = useRef([]);
  useFrame((state) => {
    rings.current.forEach((r, i) => {
      if (!r) return;
      const t = (state.clock.elapsedTime * 0.4 + i * 0.33) % 1;
      r.scale.setScalar(1 + t * 12);
      r.material.opacity = (1 - t) * 0.12;
    });
  });
  return (
    <>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={el => rings.current[i] = el} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.98, 0]}>
          <ringGeometry args={[1, 1.06, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

// ── ARRAY BLOCK ───────────────────────────────────────────────────────────────
function ArrayBlock({ position, index, value, color }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 0.8 + index * 0.5) * 0.15;
  });
  return (
    <group position={position}>
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} metalness={0.7} roughness={0.2} />
      </mesh>
      <Text position={[0, 0, 0.5]} fontSize={0.3} color="#fff" anchorX="center" anchorY="middle">{value}</Text>
      <Text position={[0, -0.7, 0]} fontSize={0.18} color="#64748b" anchorX="center" anchorY="middle">[{index}]</Text>
    </group>
  );
}

// ── ANSWER CUBE ───────────────────────────────────────────────────────────────
function AnswerCube({ position, label, text, state, onClick }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const [hov, setHov] = useState(false);

  const COLORS = { idle: "#0d1a33", correct: "#064e3b", wrong: "#450a0a" };
  const EMISSIVE = { idle: "#000", correct: "#10b981", wrong: "#ef4444" };

  useFrame((s) => {
    if (!meshRef.current) return;
    // Float
    meshRef.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 1.1 + position[0]) * 0.12;
    // Shake on wrong
    meshRef.current.position.x = state === "wrong"
      ? position[0] + Math.sin(s.clock.elapsedTime * 22) * 0.09
      : position[0];
    // Scale
    const ts = hov ? 1.14 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(ts, ts, ts), 0.12);
    // Spin ring on hover
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.03;
      ringRef.current.rotation.x = Math.sin(s.clock.elapsedTime) * 0.3;
    }
  });

  const isActive = state !== "idle";

  return (
    <group>
      <mesh ref={meshRef} position={position} castShadow
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerEnter={() => setHov(true)}
        onPointerLeave={() => setHov(false)}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial
          color={COLORS[state] || COLORS.idle}
          emissive={EMISSIVE[state] || EMISSIVE.idle}
          emissiveIntensity={isActive ? 0.5 : hov ? 0.35 : 0.04}
          metalness={0.6} roughness={0.3} transparent opacity={0.93}
        />
      </mesh>

      {/* Spinning holographic ring on hover */}
      {(hov || isActive) && (
        <mesh ref={ringRef} position={position}>
          <torusGeometry args={[1.18, 0.025, 8, 48]} />
          <meshBasicMaterial color={state === "correct" ? "#10b981" : state === "wrong" ? "#ef4444" : "#00e5ff"} transparent opacity={0.8} />
        </mesh>
      )}
      {/* Second ring perpendicular */}
      {hov && (
        <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.015, 8, 48]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Edge glow on correct/wrong */}
      {isActive && (
        <pointLight position={position} color={state === "correct" ? "#10b981" : "#ef4444"} intensity={2} distance={4} />
      )}

      <Text position={[position[0], position[1] + 1.12, position[2]]} fontSize={0.28} color="#64748b" anchorX="center">{label}</Text>
      <Text position={[position[0], position[1], position[2] + 0.85]} fontSize={0.21} color="#f0f4ff" anchorX="center" anchorY="middle" maxWidth={1.4}>{text}</Text>
    </group>
  );
}

// ── XP BURST ─────────────────────────────────────────────────────────────────
function XPBurst({ active }) {
  const grp = useRef();
  const pts = useRef([...Array(28)].map(() => ({
    vel: new THREE.Vector3((Math.random() - 0.5) * 5, Math.random() * 5 + 1, (Math.random() - 0.5) * 5),
    pos: new THREE.Vector3()
  })));
  const elapsed = useRef(0);
  useFrame((_, dt) => {
    if (!active || !grp.current) return;
    elapsed.current += dt;
    grp.current.children.forEach((c, i) => {
      const p = pts.current[i];
      p.pos.addScaledVector(p.vel, dt);
      p.vel.y -= 5 * dt;
      c.position.copy(p.pos);
      c.material.opacity = Math.max(0, 1 - elapsed.current * 1.4);
    });
  });
  if (!active) return null;
  return (
    <group ref={grp} position={[0, 1, 0]}>
      {pts.current.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#fbbf24" : "#00e5ff"} transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

// ── SCREEN FLASH ──────────────────────────────────────────────────────────────
function ScreenFlash({ color, active }) {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.material.opacity = Math.max(0, ref.current.material.opacity - 0.04);
  });
  useEffect(() => {
    if (active && ref.current) ref.current.material.opacity = 0.35;
  }, [active]);
  return (
    <mesh ref={ref} position={[0, 0, 8]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0} depthTest={false} />
    </mesh>
  );
}

// ── SCENE ─────────────────────────────────────────────────────────────────────
function Scene({ mission, onAnswer, answerStates }) {
  const vals = [12, 7, 3, 9, 1, 5];
  const labels = ["A", "B", "C", "D"];
  const cubePos = [[-4.5, 0, 0], [-1.5, 0, 0], [1.5, 0, 0], [4.5, 0, 0]];
  const correct = answerStates.some(s => s === "correct");
  const wrong   = answerStates.some(s => s === "wrong");

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[10, 20, 10]} intensity={1.0} castShadow />
      <pointLight position={[0, 8, 0]} intensity={0.9} color="#00e5ff" />
      <pointLight position={[-8, 2, -4]} intensity={0.4} color="#c084fc" />
      <pointLight position={[8, 2, -4]} intensity={0.4} color="#00e5ff" />

      <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade speed={0.4} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#060e1c" metalness={0.1} roughness={0.9} />
      </mesh>
      <gridHelper args={[50, 50, "#0d1f3a", "#0d1f3a"]} position={[0, -2.99, 0]} />
      <PulseFloor color="#00e5ff" />

      {/* Array visualization */}
      <Float speed={1} rotationIntensity={0} floatIntensity={0.3}>
        <group position={[0, 3.5, -3]}>
          {vals.map((v, i) => (
            <ArrayBlock key={i} position={[(i - vals.length / 2 + 0.5) * 1.2, 0, 0]} index={i} value={v} color={i % 2 === 0 ? "#00e5ff" : "#c084fc"} />
          ))}
          {vals.slice(0, -1).map((_, i) => {
            const x1 = (i - vals.length / 2 + 0.5) * 1.2 + 0.45;
            const x2 = (i + 1 - vals.length / 2 + 0.5) * 1.2 - 0.45;
            return (
              <mesh key={i} position={[(x1 + x2) / 2, 0, 0]}>
                <boxGeometry args={[x2 - x1, 0.04, 0.04]} />
                <meshBasicMaterial color="#00e5ff" transparent opacity={0.35} />
              </mesh>
            );
          })}
        </group>
      </Float>

      {/* Answer cubes */}
      {mission?.options.map((opt, i) => (
        <AnswerCube key={i} position={cubePos[i]} label={labels[i]} text={opt} state={answerStates[i]} onClick={() => onAnswer(opt, i)} />
      ))}

      <XPBurst active={correct} />
      <ScreenFlash color="#10b981" active={correct} />
      <ScreenFlash color="#ef4444" active={wrong} />

      {/* Decorative wireframes */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <mesh position={[-10, 2, -6]}>
          <octahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.4} wireframe />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.4}>
        <mesh position={[10, 1, -5]}>
          <icosahedronGeometry args={[0.6]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.4} wireframe />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={1.2} floatIntensity={0.6}>
        <mesh position={[0, -1, -8]}>
          <dodecahedronGeometry args={[0.8]} />
          <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.3} wireframe />
        </mesh>
      </Float>

      <CameraFlyIn />
      <OrbitControls enablePan={false} minDistance={6} maxDistance={18} maxPolarAngle={Math.PI / 2} />
    </>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function ArrayKingdom({ mission, onAnswer, answerStates, feedback }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas shadows camera={{ position: [0, 18, 28], fov: 60 }} style={{ background: "linear-gradient(180deg,#020818 0%,#060e1c 100%)" }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <Scene mission={mission} onAnswer={onAnswer} answerStates={answerStates} />
        </Suspense>
      </Canvas>

      {/* Feedback card */}
      {feedback && (
        <div style={{
          position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)",
          background: feedback.correct ? "rgba(6,78,59,0.85)" : "rgba(69,10,10,0.85)",
          border: `1px solid ${feedback.correct ? "#10b981" : "#ef4444"}`,
          borderRadius: 16, padding: "16px 28px", maxWidth: 520, textAlign: "center",
          backdropFilter: "blur(16px)", animation: "feedbackSlide 0.35s cubic-bezier(0.34,1.2,0.64,1)",
          boxShadow: `0 8px 40px ${feedback.correct ? "#10b98140" : "#ef444440"}`
        }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>{feedback.correct ? "✅ Correct!" : "❌ Wrong!"}</div>
          {feedback.correct && (
            <div style={{ color: "#fbbf24", fontWeight: 800, marginBottom: 6, fontSize: 16 }}>
              +{feedback.xpGained} XP {feedback.bonusXp > 0 && <span style={{ color: "#f59e0b" }}>+{feedback.bonusXp} bonus!</span>}
            </div>
          )}
          {!feedback.correct && !feedback.timedOut && (
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>
              Correct: <span style={{ color: "#10b981", fontWeight: 700 }}>{feedback.correctAnswer}</span>
            </div>
          )}
          <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>{feedback.explanation}</div>
        </div>
      )}

      <style>{`
        @keyframes feedbackSlide{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      `}</style>
    </div>
  );
}
