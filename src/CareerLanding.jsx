import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import Lenis from "lenis";

/* ============================================================
   RejexIQ — animated single-file career landing page
   Inspired by the Solais reel: 3D shards, splash portals,
   reddish gradient ΓåÆ "stairs" transitions, filling dashboards.
   ============================================================ */

/* ---------- smooth scroll ---------- */
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    // Cleanup: destroy lenis when component unmounts (e.g. user navigates away)
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      // Restore native scroll on body
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);
}

/* ---------- reusable: word-by-word reveal ---------- */
function Reveal({ text, className = "", as: Tag = "h2", delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.22em" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ---------- particle field (canvas, lightweight) ---------- */
function Particles({ density = 80, color = "rgba(255,90,70,0.6)" }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, parts, raf;
    const resize = () => {
      w = c.width = c.offsetWidth * devicePixelRatio;
      h = c.height = c.offsetHeight * devicePixelRatio;
      parts = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 1 + 0.2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = p.z;
        ctx.arc(p.x, p.y, p.r * p.z * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density, color]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ---------- 3D Career Orb — rocket-trophy that bursts on hover ---------- */
function CareerOrb({ mouse }) {
  const [burst, setBurst] = useState(0);
  const rx = useTransform(mouse.y, [-1, 1], [20, -20]);
  const ry = useTransform(mouse.x, [-1, 1], [-30, 30]);
  const sx = useSpring(rx, { stiffness: 60, damping: 14 });
  const sy = useSpring(ry, { stiffness: 60, damping: 14 });

  // particle ring (8 floating dots orbiting)
  const orbit = [...Array(10)].map((_, i) => ({
    a: (i / 10) * Math.PI * 2,
    r: 150 + (i % 3) * 14,
    d: i * 0.08,
  }));

  // burst particles (white) — generated on hover
  const burstParts = [...Array(36)].map((_, i) => {
    const a = (i / 36) * Math.PI * 2;
    const d = 140 + Math.random() * 120;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, s: 2 + Math.random() * 3 };
  });

  return (
    <div
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
      style={{ perspective: 1400 }}
      onMouseEnter={() => setBurst((n) => n + 1)}
    >
      {/* orbiting halo dots */}
      {orbit.map((o, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-rose-200/70"
          style={{
            width: 4,
            height: 4,
            boxShadow: "0 0 8px rgba(255,200,180,0.9)",
          }}
          animate={{
            x: [Math.cos(o.a) * o.r, Math.cos(o.a + Math.PI * 2) * o.r],
            y: [Math.sin(o.a) * o.r, Math.sin(o.a + Math.PI * 2) * o.r],
          }}
          transition={{ duration: 14 + i, repeat: Infinity, ease: "linear", delay: o.d }}
        />
      ))}

      <motion.div
        className="relative"
        style={{ rotateX: sx, rotateY: sy, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* glowing aura behind */}
        <div
          className="absolute -inset-20 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,90,70,0.55), rgba(120,10,30,0.2) 50%, transparent 70%)",
          }}
        />

        {/* the shape: stylised 3D rocket-trophy (career launch) */}
        <motion.svg
          width="240"
          height="300"
          viewBox="0 0 240 300"
          style={{ filter: "drop-shadow(0 30px 40px rgba(255,60,40,0.5))" }}
          initial={{ opacity: 0, scale: 0.6, rotateX: 60 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06 }}
        >
          <defs>
            <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffd0c0" />
              <stop offset="40%" stopColor="#ff7a5a" />
              <stop offset="100%" stopColor="#7a0a1a" />
            </linearGradient>
            <linearGradient id="rocketWindow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff7ee" />
              <stop offset="100%" stopColor="#ff9a78" />
            </linearGradient>
            <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff0d8" />
              <stop offset="50%" stopColor="#ff9a4a" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <radialGradient id="star" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#ffb89a" />
            </radialGradient>
          </defs>

          {/* flame trail */}
          <motion.path
            d="M100 230 Q120 290 140 230 Q130 270 120 280 Q110 270 100 230 Z"
            fill="url(#flame)"
            animate={{ scaleY: [1, 1.25, 1], opacity: [0.9, 1, 0.85] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "120px 230px" }}
          />

          {/* fins */}
          <path d="M70 200 L100 180 L100 230 Z" fill="#5a0a14" />
          <path d="M170 200 L140 180 L140 230 Z" fill="#5a0a14" />

          {/* body */}
          <path
            d="M120 30 Q160 90 160 180 L160 220 L80 220 L80 180 Q80 90 120 30 Z"
            fill="url(#rocketBody)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />

          {/* highlight stripe */}
          <path
            d="M120 40 Q140 100 140 180 L140 215 L132 215 L132 180 Q132 100 120 50 Z"
            fill="rgba(255,255,255,0.18)"
          />

          {/* window — "the eye on your career" */}
          <circle cx="120" cy="120" r="22" fill="url(#rocketWindow)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <circle cx="113" cy="113" r="6" fill="#fff" opacity="0.85" />

          {/* trophy star above (career milestone) */}
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "120px 30px" }}
          >
            <polygon
              points="120,8 124,22 138,22 127,30 131,44 120,36 109,44 113,30 102,22 116,22"
              fill="url(#star)"
              style={{ filter: "drop-shadow(0 0 8px rgba(255,220,180,0.9))" }}
            />
          </motion.g>
        </motion.svg>
      </motion.div>

      {/* WHITE PARTICLE BURST on hover */}
      <AnimatePresence>
        {[...Array(burst)].map((_, k) => (
          <motion.div key={k} className="absolute inset-0 pointer-events-none">
            {burstParts.map((p, i) => (
              <motion.span
                key={i}
                className="absolute top-1/2 left-1/2 rounded-full bg-white"
                style={{ width: p.s, height: p.s, boxShadow: "0 0 10px rgba(255,255,255,0.9)" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                transition={{ duration: 1.1 + Math.random() * 0.4, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => i === 0 && setBurst((n) => Math.max(0, n - 1))}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------- top nav ---------- */
function Nav({ onNav }) {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "18px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(8,4,5,0.55)", backdropFilter: "blur(14px)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "white" }}>
        <div style={{ width: 22, height: 22, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
          {[...Array(9)].map((_, i) => (
            <span key={i} style={{ background: "white", borderRadius: 1, opacity: 0.3 + (i % 3) * 0.25 }} />
          ))}
        </div>
        <span style={{ letterSpacing: "0.25em", fontSize: 11, fontWeight: 600 }}>REJEXIQ</span>
      </div>

      {/* Center links */}
      <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 11, letterSpacing: "0.18em", color: "rgba(255,255,255,0.75)" }}>
        <a href="#about" style={{ color: "inherit", textDecoration: "none" }}>ABOUT</a>
        <span style={{ opacity: 0.4 }}>/</span>
        <a href="#how" style={{ color: "inherit", textDecoration: "none" }}>HOW IT WORKS</a>
        <span style={{ opacity: 0.4 }}>/</span>
        <a href="#adv" style={{ color: "inherit", textDecoration: "none" }}>ADVANTAGE</a>
        <span style={{ opacity: 0.4 }}>/</span>
        <a href="#ind" style={{ color: "inherit", textDecoration: "none" }}>INDUSTRIES</a>
      </div>

      {/* Sign in button */}
      <button
        onClick={() => onNav && onNav("login")}
        style={{
          fontSize: 11, letterSpacing: "0.18em", color: "white",
          border: "1px solid rgba(255,255,255,0.35)", borderRadius: 999,
          padding: "8px 20px", background: "transparent", cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "white"; }}
      >
        SIGN IN
      </button>
    </motion.nav>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      className="relative h-screen w-full overflow-hidden bg-[#0a0506] text-white"
    >
      {/* reddish radial gradient */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0" style={{
          background:
            "radial-gradient(ellipse at 60% 50%, #6a0d1a 0%, #2a0407 35%, #0a0506 70%)",
        }} />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </motion.div>

      <Particles density={60} color="rgba(255,140,120,0.5)" />

      <motion.div
        style={{
          opacity,
          position: "relative", zIndex: 10, height: "100%",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          paddingLeft: 60, paddingRight: 40,
        }}
      >
        {/* left text */}
        <div style={{ paddingTop: 20 }}>
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.18)", borderRadius: 2,
              padding: "5px 12px", marginBottom: 28,
            }}
          >
            ANALYTICS FOR <span style={{ color: "#fb7185" }}>||</span>
          </motion.div>

          {/* headline */}
          <Reveal
            as="h1"
            text="CLARITY IN"
            className=""
            style={{
              fontSize: "clamp(3.8rem, 7.5vw, 7.5rem)",
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "white",
              margin: 0,
            }}
          />
          <Reveal
            as="h1"
            text="— YOUR CAREER"
            delay={0.3}
            className=""
            style={{
              fontSize: "clamp(3.8rem, 7.5vw, 7.5rem)",
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "rgba(251,182,206,0.88)",
              margin: 0,
            }}
          />

          {/* paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            style={{
              marginTop: 36, maxWidth: 340,
              fontSize: 13, color: "rgba(255,255,255,0.55)",
              lineHeight: 1.75,
            }}
          >
            People don't search for jobs the way they used to. They ask
            questions, run trade-offs, and read between the lines. RejexIQ
            decodes how AI engines and recruiters see you — it's clarity for a
            new kind of discovery.
          </motion.p>
        </div>

        {/* right 3D orb */}
        <div style={{ height: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CareerOrb mouse={{ x: mx, y: my }} />
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-white/50"
      >
        SCROLL Γåô
      </motion.div>
    </section>
  );
}

/* ---------- Section title block (UNDERSTANDING / WHAT IS ΓÇª) ---------- */
function SectionTitle({ kicker, title, accent, light = false }) {
  return (
    <div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        fontSize: 10, letterSpacing: "0.3em",
        color: light ? "rgba(90,20,30,0.65)" : "rgba(255,255,255,0.65)",
        border: light ? "1px solid rgba(90,20,30,0.2)" : "1px solid rgba(255,255,255,0.2)",
        borderRadius: 2, padding: "5px 12px", marginBottom: 24,
      }}>
        {kicker} <span style={{ color: light ? "#be123c" : "#fb7185" }}>||</span>
      </div>
      <Reveal
        as="h2"
        text={title}
        style={{
          fontSize: "clamp(3rem,6.5vw,6.5rem)",
          fontWeight: 300, lineHeight: 1.0,
          letterSpacing: "-0.02em", margin: 0,
          color: light ? "#1a0a0c" : "white",
        }}
      />
      {accent && (
        <Reveal
          as="h2"
          text={accent}
          delay={0.25}
          style={{
            fontSize: "clamp(3rem,6.5vw,6.5rem)",
            fontWeight: 300, lineHeight: 1.0,
            letterSpacing: "-0.02em", margin: 0,
            color: light ? "#be123c" : "rgba(251,182,206,0.88)",
          }}
        />
      )}
    </div>
  );
}

/* ---------- rising stair bars (reusable cream background) ---------- */
function StairBars() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <div ref={ref} className="absolute inset-0 flex items-end pointer-events-none">
      {[...Array(12)].map((_, i) => {
        const h = useTransform(scrollYProgress, [0, 0.6], ["0%", `${30 + i * 6}%`]);
        return (
          <motion.div key={i} style={{ height: h }} className="flex-1 border-l border-rose-900/10">
            <div className="w-full h-full bg-gradient-to-t from-rose-900/15 to-transparent" />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------- floating point card ---------- */
function PointCard({ index, title, body, x, y, light = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: 0.2 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute", left: x, top: y,
        maxWidth: 240,
        backdropFilter: "blur(8px)",
        borderRadius: 8, padding: "16px 18px",
        background: light ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.04)",
        border: light ? "1px solid rgba(120,10,30,0.12)" : "1px solid rgba(255,255,255,0.1)",
        boxShadow: light ? "0 10px 30px -12px rgba(120,10,30,0.2)" : "none",
      }}
    >
      <div style={{
        fontSize: 9, letterSpacing: "0.25em", marginBottom: 8,
        display: "flex", alignItems: "center", gap: 6,
        color: light ? "#be123c" : "#fda4af",
      }}>
        <span style={{ width: 7, height: 7, background: light ? "#be123c" : "#fda4af", display: "inline-block" }} />
        {title}
      </div>
      <p style={{ fontSize: 12, lineHeight: 1.65, color: light ? "rgba(26,10,12,0.65)" : "rgba(255,255,255,0.65)", margin: 0 }}>
        {body}
      </p>
    </motion.div>
  );
}

/* ---------- WHAT IS section with floating shards + 3 point cards ---------- */
function WhatIsSection() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  return (
    <section
      id="about"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      style={{ position: "relative", minHeight: "100vh", width: "100%", background: "#f4f1ea", color: "#1a0a0c", overflow: "hidden" }}
    >
      <StairBars />
      <div style={{
        position: "relative", zIndex: 10,
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 40, padding: "120px 60px", alignItems: "center",
      }}>
        <div style={{ position: "relative" }}>
          <SectionTitle light kicker="UNDERSTANDING" title="WHAT IS" accent="— REJEXIQ?" />
        </div>
        <div style={{ position: "relative", height: 520 }}>
          <CareerOrb mouse={{ x: mx, y: my }} />
          <PointCard light index={0}
            title="Γùç VISIBILITY ANALYSIS"
            body="See where your profile surfaces across recruiter searches, AI assistants, and job boards — and which competitors appear alongside you."
            x="-40px" y="20px"
          />
          <PointCard light index={1}
            title="Γùç SENTIMENT INSIGHT"
            body="Understand how hiring AI describes your skills — the language it uses, the confidence of its references, and the trust signals it relies on."
            x="60%" y="35%"
          />
          <PointCard light index={2}
            title="Γùç ACTIONABLE DIRECTION"
            body="Identify where visibility is strong, where it drops away, and where opportunity exists. We highlight the moves that influence how engines surface your story."
            x="-20px" y="75%"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- SPLASH PORTAL transition ---------- */
function SplashPortal({ label, title, body }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 1.6]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, 1, 1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  return (
    <section ref={ref} style={{
      position: "relative", height: "100vh", width: "100%",
      background: "#000", color: "white", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Particles density={120} color="rgba(255,200,180,0.7)" />
      {/* radial glow */}
      <motion.div style={{ scale, opacity, position: "absolute", width: "80vmin", height: "80vmin", borderRadius: "50%" }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,90,60,0.7) 0%, rgba(120,10,30,0.4) 40%, transparent 70%)",
          filter: "blur(20px)",
        }} />
      </motion.div>
      {/* spinning ring */}
      <motion.div style={{
        rotate, position: "absolute",
        width: "60vmin", height: "60vmin",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%",
      }}>
        <div style={{
          position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)",
          width: 8, height: 8, background: "#fb7185", borderRadius: "50%",
        }} />
      </motion.div>
      {/* center content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 700 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.65)",
          border: "1px solid rgba(255,255,255,0.2)", borderRadius: 2,
          padding: "5px 12px", marginBottom: 28,
        }}>
          {label} <span style={{ color: "#fb7185" }}>||</span>
        </div>
        <Reveal
          as="h2"
          text={title}
          style={{
            fontSize: "clamp(2.5rem,5.5vw,5rem)",
            fontWeight: 300, lineHeight: 1.05,
            letterSpacing: "-0.02em", color: "white", margin: 0,
          }}
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            marginTop: 32, fontSize: 13,
            color: "rgba(255,255,255,0.55)", lineHeight: 1.75,
            maxWidth: 520, margin: "32px auto 0",
          }}
        >
          {body}
        </motion.p>
      </div>
    </section>
  );
}

/* ---------- "Stairs" reveal background section ---------- */
function StairsSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <section ref={ref} style={{
      position: "relative", height: "100vh", width: "100%",
      overflow: "hidden", background: "#f4f1ea", color: "#1a0a0c",
    }}>
      {/* rising stair bars */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end" }}>
        {[...Array(12)].map((_, i) => {
          const h = useTransform(scrollYProgress, [0, 0.6], ["0%", `${30 + i * 6}%`]);
          return (
            <motion.div key={i} style={{ height: h, flex: 1, borderLeft: "1px solid rgba(120,10,30,0.08)" }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(to top, rgba(120,10,30,0.12), transparent)" }} />
            </motion.div>
          );
        })}
      </div>
      <div style={{
        position: "relative", zIndex: 10, height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 24px",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 10, letterSpacing: "0.3em", color: "rgba(90,20,30,0.65)",
            border: "1px solid rgba(90,20,30,0.18)", borderRadius: 2,
            padding: "5px 12px", marginBottom: 28,
          }}>
            HOW IT WORKS <span style={{ color: "#be123c" }}>||</span>
          </div>
          <Reveal as="h2" text="DISCOVERING"
            style={{ fontSize: "clamp(3rem,7.5vw,7.5rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", color: "#1a0a0c", margin: 0 }}
          />
          <Reveal as="h2" text="— YOUR VOICE" delay={0.25}
            style={{ fontSize: "clamp(3rem,7.5vw,7.5rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", color: "#be123c", margin: 0 }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            style={{ marginTop: 32, maxWidth: 480, margin: "32px auto 0", fontSize: 13, color: "rgba(90,20,30,0.65)", lineHeight: 1.75 }}
          >
            Rather than guessing at what influences discovery, you get a
            structured approach: define what matters, track how it changes, and
            act on what the data reveals.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* ---------- DASHBOARD with filling graphs ---------- */
function DashboardSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const bars = [62, 88, 45, 92, 70, 55, 78];
  return (
    <section id="how" ref={ref} style={{
      position: "relative", minHeight: "100vh", width: "100%",
      background: "#f4f1ea", color: "#1a0a0c",
      padding: "100px 60px", overflow: "hidden",
    }}>
      <StairBars />
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle light kicker="REAL-TIME" title="YOUR CAREER" accent="— DASHBOARD" />

        <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          {/* big chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            style={{
              borderRadius: 16, border: "1px solid rgba(120,10,30,0.12)",
              background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)",
              padding: 28, position: "relative", overflow: "hidden",
              boxShadow: "0 30px 80px -30px rgba(120,10,30,0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(120,10,30,0.55)", marginBottom: 6 }}>VISIBILITY INDEX</div>
                <div style={{ fontSize: 28, fontWeight: 300, color: "#1a0a0c" }}>
                  84.6 <span style={{ fontSize: 13, color: "#be123c" }}>+12.4%</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, fontSize: 9, color: "rgba(120,10,30,0.55)" }}>
                {["7D", "30D", "90D"].map((t, i) => (
                  <span key={t} style={{
                    padding: "4px 8px", borderRadius: 4,
                    border: i === 1 ? "1px solid rgba(190,18,60,0.5)" : "1px solid rgba(120,10,30,0.18)",
                    color: i === 1 ? "#be123c" : "inherit",
                  }}>{t}</span>
                ))}
              </div>
            </div>
            {/* bars */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 200 }}>
              {bars.map((v, i) => (
                <motion.div key={i}
                  initial={{ height: 0 }}
                  animate={inView ? { height: `${v}%` } : {}}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    flex: 1, borderRadius: "4px 4px 0 0", position: "relative",
                    background: "linear-gradient(180deg, #ff6a4d 0%, #c8253c 70%, rgba(120,10,30,0.05) 100%)",
                    boxShadow: "0 0 20px rgba(255,90,70,0.3)",
                  }}
                >
                  <motion.div style={{
                    position: "absolute", inset: "0 0 auto 0", height: 3,
                    background: "rgba(255,255,255,0.85)", borderRadius: "4px 4px 0 0",
                  }}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.5 + i * 0.1 }}
                  />
                </motion.div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 9, color: "rgba(120,10,30,0.45)", letterSpacing: "0.15em" }}>
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(d => <span key={d}>{d}</span>)}
            </div>
          </motion.div>

          {/* radial gauge */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              borderRadius: 16, border: "1px solid rgba(120,10,30,0.12)",
              background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)",
              padding: 28, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(120,10,30,0.55)", marginBottom: 16 }}>JOB READINESS</div>
            <div style={{ position: "relative", width: 160, height: 160 }}>
              <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(120,10,30,0.08)" strokeWidth="10" />
                <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#g1)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 50}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={inView ? { strokeDashoffset: 2 * Math.PI * 50 * (1 - 0.78) } : {}}
                  transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                />
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#ff8a5c" />
                    <stop offset="100%" stopColor="#c8253c" />
                  </linearGradient>
                </defs>
              </svg>
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1.5 }}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, fontWeight: 300, color: "#1a0a0c",
                }}
              >78%</motion.div>
            </div>
            <div style={{ fontSize: 11, color: "rgba(120,10,30,0.55)", marginTop: 16 }}>Strong — keep momentum</div>
          </motion.div>
        </div>

        {/* metric cards row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 20 }}>
          {[
            { l: "INTERVIEWS", v: "12", d: "+3 this week" },
            { l: "PROFILE VIEWS", v: "1,284", d: "Recruiter-led" },
            { l: "SKILL COVERAGE", v: "92%", d: "Across 14 roles" },
          ].map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
              style={{
                borderRadius: 16, border: "1px solid rgba(120,10,30,0.12)",
                background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)",
                padding: "20px 24px",
              }}
            >
              <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(120,10,30,0.55)" }}>{m.l}</div>
              <div style={{ fontSize: 30, fontWeight: 300, marginTop: 8, color: "#1a0a0c" }}>{m.v}</div>
              <div style={{ fontSize: 11, color: "#be123c", marginTop: 4 }}>{m.d}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- INDUSTRY cards ---------- */
function IndustrySection({ onNav }) {
  const cards = [
    { tag: "AI / ML", title: "TECHNOLOGISTS", body: "Track how AI assistants and hiring tools talk about your skill stack across roles, and surface where you stand vs peers." },
    { tag: "PRODUCT", title: "BUILDERS", body: "Get a clearer view of how product and design roles map to your portfolio — and what evidence moves the needle." },
    { tag: "LEADERSHIP", title: "OPERATORS", body: "Understand how decision-makers and exec search firms perceive your trajectory, and where to invest your story." },
  ];
  return (
    <section id="ind" style={{
      position: "relative", minHeight: "100vh", width: "100%",
      background: "linear-gradient(180deg, #4a0c14 0%, #2a0608 50%, #0a0506 100%)",
      color: "white", padding: "100px 60px", overflow: "hidden",
    }}>
      <Particles density={40} color="rgba(255,140,120,0.4)" />
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "center" }}>
        <div>
          <SectionTitle kicker="FOR EVERYONE" title="FIND YOUR" accent="— INDUSTRY" />
          <p style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.55)", maxWidth: 300, lineHeight: 1.75 }}>
            RejexIQ is built for anyone responsible for how their work is seen, understood, and chosen.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => onNav && onNav("signup")}
            style={{
              marginTop: 32, fontSize: 10, letterSpacing: "0.3em",
              border: "1px solid rgba(255,255,255,0.35)", borderRadius: 999,
              padding: "12px 24px", background: "transparent", color: "white", cursor: "pointer",
            }}
          >
            GET STARTED ΓåÆ
          </motion.button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {cards.map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 60, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              style={{
                background: "#f5f1e8", color: "#1a0a0c",
                borderRadius: 8, padding: 20, height: 280,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
              }}
            >
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "#be123c", marginBottom: 12 }}>Γùç {c.tag}</div>
                <div style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.2 }}>{c.title}</div>
              </div>
              <p style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", lineHeight: 1.65, margin: 0 }}>{c.body}</p>
              <div style={{ display: "flex", gap: 4 }}>
                {[...Array(6)].map((_, k) => (
                  <span key={k} style={{ width: 4, height: 12, background: "rgba(120,10,30,0.35)", borderRadius: 2 }} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FINAL marquee CTA ---------- */
function MarqueeCTA({ onNav }) {
  return (
    <section style={{
      position: "relative", height: "60vh", width: "100%",
      background: "linear-gradient(180deg, #0a0506 0%, #1a0408 100%)",
      color: "white", overflow: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <Particles density={50} color="rgba(255,120,100,0.4)" />
      <motion.div
        initial={{ x: "20%" }}
        whileInView={{ x: "-20%" }}
        viewport={{ once: false }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          fontSize: "clamp(5rem,15vw,15rem)", fontWeight: 300,
          letterSpacing: "-0.02em", whiteSpace: "nowrap",
          color: "rgba(251,182,206,0.88)",
        }}
      >
        — REJEXIQ — REJEXIQ
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
        onClick={() => onNav && onNav("signup")}
        style={{
          position: "relative", zIndex: 10, marginTop: 32,
          fontSize: 11, letterSpacing: "0.3em",
          background: "white", color: "black",
          borderRadius: 999, padding: "14px 36px",
          border: "none", cursor: "pointer",
        }}
      >
        CREATE FREE ACCOUNT ΓåÆ
      </motion.button>
      <div style={{ position: "relative", zIndex: 10, marginTop: 40, display: "flex", gap: 32, fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)" }}>
        <a href="#" style={{ color: "inherit", textDecoration: "none" }}>ABOUT</a>
        <a href="#" style={{ color: "inherit", textDecoration: "none" }}>PRIVACY</a>
        <a href="#" style={{ color: "inherit", textDecoration: "none" }}>CONTACT</a>
      </div>
    </section>
  );
}

/* ---------- scroll progress bar ---------- */
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX: sx, transformOrigin: "0% 50%", position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "#fb7185", zIndex: 60 }}
    />
  );
}

/* ---------- FOOTER ---------- */
function Footer({ onNav }) {
  const cols = [
    {
      heading: "PLATFORM",
      links: [
        { label: "Skill Assessment", page: "assessment" },
        { label: "Career Match", page: "career" },
        { label: "Market Demand", page: "market" },
        { label: "Resume Builder", page: "resume" },
      ],
    },
    {
      heading: "COMPANY",
      links: [
        { label: "About", page: null },
        { label: "How It Works", page: null },
        { label: "Industries", page: null },
        { label: "GitHub", href: "https://github.com/pragtijasrai/RejexIQ" },
      ],
    },
    {
      heading: "ACCOUNT",
      links: [
        { label: "Sign In", page: "login" },
        { label: "Create Account", page: "signup" },
        { label: "Dashboard", page: "dashboard" },
        { label: "Try Demo", page: "demo" },
      ],
    },
  ];

  return (
    <footer style={{
      background: "#0a0506",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      color: "white",
      padding: "72px 60px 40px",
    }}>
      {/* top row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
        {/* brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 20, height: 20, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
              {[...Array(9)].map((_, i) => (
                <span key={i} style={{ background: "white", borderRadius: 1, opacity: 0.3 + (i % 3) * 0.25 }} />
              ))}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.25em" }}>REJEXIQ</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: 260, margin: "0 0 28px" }}>
            Predictive hire-readiness analytics for modern careers — visibility, sentiment and signal in one platform.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNav && onNav("signup")}
            style={{
              fontSize: 10, letterSpacing: "0.25em",
              background: "transparent", color: "white",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999,
              padding: "10px 22px", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "white"; }}
          >
            GET STARTED ΓåÆ
          </motion.button>
        </div>

        {/* link columns */}
        {cols.map((col) => (
          <div key={col.heading}>
            <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
              {col.heading}
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "white"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => l.page === "demo" ? onNav && onNav("demo") : l.page && onNav && onNav(l.page)}
                      style={{
                        fontSize: 13, color: "rgba(255,255,255,0.55)",
                        background: "none", border: "none", padding: 0,
                        cursor: l.page ? "pointer" : "default", transition: "color 0.2s",
                        textAlign: "left",
                      }}
                      onMouseEnter={e => { if (l.page) e.currentTarget.style.color = "white"; }}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                    >
                      {l.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 32 }} />

      {/* bottom row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0, letterSpacing: "0.05em" }}>
          ┬⌐ 2025 RejexIQ — Skill Evaluation &amp; Career Readiness Platform
        </p>
        <div style={{ display: "flex", gap: 28, fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)" }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>PRIVACY</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>TERMS</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>CONTACT</a>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function CareerLanding({ onNav, onDemo }) {
  useLenis();
  return (
    <div className="bg-black">
      <ScrollBar />
      <Nav onNav={onNav} />
      <Hero onNav={onNav} />
      <WhatIsSection />
      <SplashPortal
        label="STRATEGISING"
        title="SET YOUR PROMPTS"
        body="Define the questions people ask when they're trying to learn, compare or decide. These might include role research, brand comparisons, or product recommendations relevant to your market."
      />
      <SplashPortal
        label="VERIFIED DATA"
        title="REMOVE THE GUESSWORK"
        body="Every result is captured from real prompt simulations — an exact record of how a question was answered at that moment in time, so you can strategise around complete certainty."
      />
      <StairsSection />
      <SplashPortal
        label="YOUR ADVANTAGE"
        title="WHY PROS CHOOSE US"
        body="A unified picture of how AI engines, recruiters, and hiring tools talk about you — with every signal traceable to a verified source."
      />
      <DashboardSection />
      <IndustrySection onNav={onNav} />
      <MarqueeCTA onNav={onNav} />
      <Footer onNav={onNav} />
    </div>
  );
}
