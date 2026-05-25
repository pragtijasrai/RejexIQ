import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sparkles, Html } from '@react-three/drei';
import { useScroll, useSpring } from 'framer-motion';
import * as THREE from 'three';

const LETTERS = ["S", "U", "C", "C", "E", "S", "S"];
const TOTAL_STEPS = 120;

const getStepPosition = (i) => {
  const t = i / TOTAL_STEPS;
  const angle = i * 0.18; 
  const radius = 3.8 + Math.sin(t * Math.PI * 4) * 0.4; 
  return {
    x: Math.sin(angle) * radius,
    y: -i * 0.52, 
    z: Math.cos(angle) * radius,
    rotY: angle
  };
};

function CinematicAnnotation({ title, body, scrollVal, showRange = [0.2, 0.4], align = "left", lineLength = 100 }) {
  const [isVisible, setIsVisible] = useState(false);
  const isLeft = align === "left";

  useFrame(() => {
    const s = scrollVal.get();
    setIsVisible(s >= showRange[0] && s <= showRange[1]);
  });

  return (
    <Html center zIndexRange={[100, 0]}>
      <div style={{ position: 'relative', width: 0, height: 0, pointerEvents: 'none' }}>
        {}
        <div style={{
          position: 'absolute',
          left: 0, top: 0,
          transform: "translate(-50%, -50%)",
          width: 5, height: 5,
          background: "#fff",
          borderRadius: "50%",
          boxShadow: "0 0 12px 3px rgba(255,255,255,0.8), 0 0 25px 8px rgba(255,255,255,0.3)",
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }} />

        {}
        <div style={{
          position: 'absolute',
          top: 0,
          [isLeft ? "right" : "left"]: 0,
          width: isVisible ? lineLength : 0,
          height: 1,
          background: `linear-gradient(to ${isLeft ? "left" : "right"}, rgba(255,255,255,0.7), rgba(255,255,255,0.0))`,
          transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s',
        }} />

        {}
        <div style={{
          position: 'absolute',
          [isLeft ? "right" : "left"]: lineLength + 20,
          top: 0,
          transform: "translateY(-50%)",
          width: 260,
          textAlign: isLeft ? "right" : "left",
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.6s',
        }}>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#fff", fontWeight: 600, marginBottom: 8 }}>
            ◇ {title}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontWeight: 300 }}>
            {body}
          </div>
        </div>
      </div>
    </Html>
  );
}

function CinematicSpiral({ whatIsScroll }) {
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { damping: 20, mass: 1, stiffness: 80 });

  const masterGroup = useRef();
  const stepRefs = useRef([]);
  const stepMaterials = useRef([]);
  const starRef = useRef();

  
  const initialStarPos = useMemo(() => {
    const pos = getStepPosition(TOTAL_STEPS - 20);
    return [pos.x, pos.y, pos.z];
  }, []);

  
  const stepsData = useMemo(() => {
    const data = [];
    for (let i = 0; i < TOTAL_STEPS; i++) {
      const pos = getStepPosition(i);

      const isRed = i < LETTERS.length;
      const letter = isRed ? LETTERS[i] : null;

      
      const isMilestone = i >= LETTERS.length && i % 20 === 0;

      data.push({ x: pos.x, y: pos.y, z: pos.z, rotY: pos.rotY, isRed, letter, isMilestone });
    }
    return data;
  }, []);

  useFrame((state) => {
    const scroll = smoothScroll.get();
    const time = state.clock.elapsedTime;

    
    const progress = Math.max(0, (scroll - 0.01) / 0.99);
    const activeStep = progress * TOTAL_STEPS;

    
    stepRefs.current.forEach((step, i) => {
      if (!step) return;

      const data = stepsData[i];
      const mat = stepMaterials.current[i];

      
      const originalY = data.y;
      const waveOffset = Math.sin(time * 2.0 - i * 0.2) * 0.15;
      step.position.y = originalY + waveOffset;
      step.rotation.z = Math.sin(time * 1.0 + i * 0.1) * 0.03;

      
      let targetScale = 1.0;
      const distance = activeStep - i;

      if (progress > 0.85) {
        
        targetScale = 0.0;
      } else if (data.isMilestone && distance > 0) {
        
        targetScale = 1.6;
      }

      
      step.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

      
      if (mat) {
        let targetIntensity = 0;

        
        if (distance > 0 && distance < 15) {
          targetIntensity = 1.0 - (distance / 15);
        }

        if (data.isMilestone) {
          
          if (distance > 0) targetIntensity = Math.max(targetIntensity, 0.8);
          mat.emissive.setHex(0x00ffff);
        } else if (data.isRed) {
          
          mat.emissive.setHex(0xff0000);
          targetIntensity *= 0.5;
        } else {
          
          mat.emissive.setHex(0xffaa00);
        }

        
        mat.emissiveIntensity += (targetIntensity - mat.emissiveIntensity) * 0.1;
      }
    });

    
    
    const starProgress = progress > 0.85 ? Math.min((progress - 0.85) / 0.15, 1.0) : 0;
    const starIndex = (TOTAL_STEPS - 20) + starProgress * 20;

    const pos = getStepPosition(starIndex);

    if (starRef.current) {
      if (progress > 0.85) {
        
        starRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2);
      } else {
        
        starRef.current.scale.set(0, 0, 0);
      }
      starRef.current.position.set(pos.x, pos.y, pos.z);
    }

    if (!masterGroup.current) return;

    
    const heroX = 2; 
    const heroY = 2;
    const heroZ = -4;
    const heroRotY = -0.5;
    const heroRotX = 0.05;

    let targetX = heroX;
    let targetY = heroY;
    let targetZ = heroZ;
    let targetRotY = heroRotY;
    let targetRotX = heroRotX;

    if (scroll >= 0.01) {
      
      targetY = heroY + progress * 45; 
      
      targetRotY = heroRotY + progress * Math.PI * 1.5;
      
      targetRotX = heroRotX + progress * 0.2;
    }

    masterGroup.current.position.x += (targetX - masterGroup.current.position.x) * 0.08;
    masterGroup.current.position.y += (targetY - masterGroup.current.position.y) * 0.08;
    masterGroup.current.position.z += (targetZ - masterGroup.current.position.z) * 0.08;
    masterGroup.current.rotation.y += (targetRotY - masterGroup.current.rotation.y) * 0.08;
    masterGroup.current.rotation.x += (targetRotX - masterGroup.current.rotation.x) * 0.08;
  });

  return (
    <group ref={masterGroup}>
      {}
      {stepsData.map((data, i) => (
        <group
          key={`step-${i}`}
          ref={(el) => (stepRefs.current[i] = el)}
          position={[data.x, data.y, data.z]}
          rotation={[0, data.rotY, 0]}
        >
          {}
          {i >= LETTERS.length - 1 && (
            <mesh position={[0, -0.7, 0]} castShadow receiveShadow>
              <boxGeometry args={[3.2, 0.2, 1.3]} />
              <meshStandardMaterial
                ref={(el) => (stepMaterials.current[i] = el)}
                color="#fdf8ec"
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
          )}

          {}
          {i === 12 && (
            <CinematicAnnotation
              title="VISIBILITY ANALYSIS"
              body="See where your profile surfaces across recruiter searches, AI assistants, and job boards — and which competitors appear alongside you."
              scrollVal={whatIsScroll} showRange={[0.05, 0.95]} align="left" lineLength={280}
            />
          )}
          {i === 18 && (
            <CinematicAnnotation
              title="SENTIMENT INSIGHT"
              body="Understand how hiring AI describes your skills — the language it uses, the confidence of its references, and the trust signals it relies on."
              scrollVal={whatIsScroll} showRange={[0.05, 0.95]} align="right" lineLength={280}
            />
          )}
          {i === 24 && (
            <CinematicAnnotation
              title="ACTIONABLE DIRECTION"
              body="Identify where visibility is strong, where it drops away, and where opportunity exists. We highlight the moves that influence how engines surface your story."
              scrollVal={whatIsScroll} showRange={[0.05, 0.95]} align="right" lineLength={180}
            />
          )}
          {}
          {data.isRed && (
            <group position={[0, 0, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.85, 0.85, 0.85]} />
                <meshStandardMaterial
                  ref={(el) => { if (i < LETTERS.length - 1) stepMaterials.current[i] = el }}
                  color="#991118"
                  roughness={0.15}
                  metalness={0.2}
                />
              </mesh>
              <Text
                position={[0, 0, 0.43]}
                fontSize={0.5}
                color="white"
                fontWeight="bold"
                anchorX="center"
                anchorY="middle"
              >
                {data.letter}
              </Text>
            </group>
          )}
        </group>
      ))}

      {}
      <group ref={starRef} position={initialStarPos}>
        <pointLight intensity={10} color="#00ffff" distance={30} />
        <Sparkles count={60} scale={35} size={8} speed={1.5} color="#00ffff" opacity={0.5} />
      </group>
    </group>
  );
}
export default function LuxuryExperience({ whatIsScroll }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0,
      background: `
        radial-gradient(ellipse at 80% 20%, #6a0d1a 0%, transparent 45%),
        radial-gradient(ellipse at 20% 80%, #4a040b 0%, transparent 55%),
        radial-gradient(ellipse at 50% 50%, #1c0205 0%, #0a0506 100%)
      `
    }}>
      <Canvas shadows camera={{ position: [0, 1, 8], fov: 45 }}>
        <fog attach="fog" args={['#2a0407', 10, 50]} />

        {}
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight
          position={[15, 30, 15]}
          intensity={1.8}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={100}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <directionalLight position={[-15, 15, -15]} intensity={0.6} color="#fdf8ec" />

        <CinematicSpiral whatIsScroll={whatIsScroll} />
      </Canvas>
    </div>
  );
}
