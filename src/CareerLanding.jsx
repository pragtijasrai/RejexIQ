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
import LuxuryExperience from "./components/LuxuryExperience";

/* ============================================================
   RejexIQ — animated single-file career landing page
   Inspired by the Solais reel: 3D shards, splash portals,
   reddish gradient → "stairs" transitions, filling dashboards.
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

/* ---------- particle field (canvas, weight) ---------- */
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

          {/* high stripe */}
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
      className="relative h-screen w-full overflow-hidden bg-transparent text-white"
    >
      {/* reddish radial gradient */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0" style={{
          background: "transparent",
        }} />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </motion.div>



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
            ANALYTICS FOR YOUR CAREER
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
            text="YOUR CAREER"
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

        </div>
      </motion.div>
    </section>
  );
}

/* ---------- Section title block (UNDERSTANDING / WHAT IS …) ---------- */
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
          color: "white",
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
            color: "rgba(251,182,206,0.88)",
          }}
        />
      )}
    </div>
  );
}



/* ---------- WHAT IS section with floating shards + 3 point cards ---------- */
function WhatIsSection({ sectionRef }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  return (
    <section
      ref={sectionRef}
      id="about"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      style={{ position: "relative", minHeight: "100vh", width: "100%", background: "transparent", color: "white", overflow: "hidden" }}
    >
      <div style={{
        position: "relative", zIndex: 10,
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 40, padding: "120px 60px", alignItems: "center",
      }}>
        <div style={{ position: "relative" }}>
          <SectionTitle kicker="UNDERSTANDING" title="WHAT IS" accent="REJEXIQ?" />
        </div>
        <div style={{ position: "relative", height: 520, pointerEvents: "none" }}>
          {/* 3D Cinematic Annotations now handle this space */}
        </div>
      </div>
    </section>
  );
}

/* ---------- CREAM FEATURE BREAK ---------- */
function FeatureBreak() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const features = [
    {
      icon: "◈",
      kicker: "STRATEGISING",
      title: "Set Your Prompts",
      body: "Define the questions people ask when they're trying to learn, compare or decide — role research, brand comparisons, or product recommendations relevant to your market.",
      stat: "3×", statLabel: "more visibility",
    },
    {
      icon: "◉",
      kicker: "VERIFIED DATA",
      title: "Remove the Guesswork",
      body: "Every result is captured from real prompt simulations — an exact record of how a question was answered at that moment in time, so you can strategise around complete certainty.",
      stat: "98%", statLabel: "accuracy rate",
    },
    {
      icon: "◇",
      kicker: "YOUR ADVANTAGE",
      title: "Why Pros Choose Us",
      body: "A unified picture of how AI engines, recruiters, and hiring tools talk about you — with every signal traceable to a verified source.",
      stat: "10k+", statLabel: "careers tracked",
    },
  ];

  return (
    <>
      {/* Top diagonal separator: dark → cream */}
      <div style={{ position: "relative", height: 80, overflow: "hidden", background: "transparent" }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
          style={{ position: "absolute", bottom: 0, width: "100%", height: "100%" }}>
          <polygon points="0,80 1440,0 1440,80" fill="#f7f2ee" />
        </svg>
      </div>

      {/* Cream section body */}
      <section ref={sectionRef} style={{
        position: "relative",
        background: "#f7f2ee",
        color: "#1a0a0c",
        padding: "80px 60px 100px",
        overflow: "hidden",
      }}>
        {/* Radial glow — warm pinkish center-right like reference */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 65% 50%, rgba(220,140,130,0.22) 0%, rgba(200,100,100,0.08) 45%, transparent 75%)",
        }} />
        {/* Subtle vertical lines texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.06,
          backgroundImage: "repeating-linear-gradient(90deg, rgba(154,58,74,0.8) 0px, rgba(154,58,74,0.8) 1px, transparent 1px, transparent 80px)",
        }} />

        {/* Section header with parallax */}
        <motion.div
          style={{ y: headingY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: "center", marginBottom: 72, position: "relative", zIndex: 2 }}
          >
            {/* Animated kicker badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 9, letterSpacing: "0.35em", color: "#9a3a4a",
                border: "1px solid rgba(154,58,74,0.3)", borderRadius: 2,
                padding: "5px 14px", marginBottom: 20,
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 5, height: 5, borderRadius: "50%", background: "#9a3a4a", display: "inline-block" }}
              />
              HOW IT WORKS
            </motion.div>

            {/* Heading — word by word reveal */}
            <div style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300,
              letterSpacing: "-0.02em", color: "#1a0a0c", lineHeight: 1.1,
            }}>
              {["Intelligence", "that", "works"].map((word, wi) => (
                <motion.span
                  key={wi}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: wi * 0.1 }}
                  style={{ display: "inline-block", marginRight: "0.3em" }}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                style={{ color: "#9a3a4a", fontStyle: "italic", display: "inline-block" }}
              >
                for your career
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature cards grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32, maxWidth: 1100, margin: "0 auto",
          position: "relative", zIndex: 2,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -8, boxShadow: i === 1
                  ? "0 36px 80px -16px rgba(26,10,12,0.65)"
                  : "0 20px 50px -12px rgba(154,58,74,0.22)"
              }}
              style={{
                background: i === 1
                  ? "linear-gradient(145deg, #1a0a0c 0%, #3d0a14 100%)"
                  : "rgba(255,255,255,0.75)",
                borderRadius: 16,
                padding: "40px 36px",
                border: i === 1
                  ? "1px solid rgba(255,100,120,0.2)"
                  : "1px solid rgba(154,58,74,0.12)",
                boxShadow: i === 1
                  ? "0 24px 60px -16px rgba(26,10,12,0.5)"
                  : "0 8px 32px -8px rgba(154,58,74,0.12)",
                backdropFilter: "blur(8px)",
                cursor: "default",
                transformStyle: "preserve-3d",
                transition: "box-shadow 0.3s ease",
              }}
            >
              {/* Animated icon */}
              <motion.div
                animate={{ rotate: [0, 8, -4, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  fontSize: 24, color: i === 1 ? "#fb7185" : "#9a3a4a",
                  marginBottom: 20, display: "inline-block",
                }}
              >
                {f.icon}
              </motion.div>

              {/* Kicker */}
              <div style={{
                fontSize: 9, letterSpacing: "0.3em",
                color: i === 1 ? "rgba(255,255,255,0.45)" : "rgba(154,58,74,0.6)",
                marginBottom: 12,
              }}>
                {f.kicker}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: "1.25rem", fontWeight: 400,
                color: i === 1 ? "#ffffff" : "#1a0a0c",
                margin: "0 0 16px", lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}>
                {f.title}
              </h3>

              {/* Body */}
              <p style={{
                fontSize: 13, lineHeight: 1.75,
                color: i === 1 ? "rgba(255,255,255,0.6)" : "rgba(26,10,12,0.6)",
                margin: 0,
              }}>
                {f.body}
              </p>

              {/* Stat counter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                style={{
                  marginTop: 28, display: "flex", alignItems: "baseline", gap: 6,
                }}
              >
                <span style={{
                  fontSize: "1.6rem", fontWeight: 300,
                  color: i === 1 ? "#fb7185" : "#9a3a4a",
                  letterSpacing: "-0.02em",
                }}>
                  {f.stat}
                </span>
                <span style={{
                  fontSize: 10, letterSpacing: "0.15em",
                  color: i === 1 ? "rgba(255,255,255,0.35)" : "rgba(154,58,74,0.5)",
                }}>
                  {f.statLabel}
                </span>
              </motion.div>

              {/* Animated accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginTop: 16, height: 1, transformOrigin: "left",
                  background: i === 1
                    ? "linear-gradient(90deg, #fb7185, transparent)"
                    : "linear-gradient(90deg, rgba(154,58,74,0.4), transparent)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom diagonal separator: cream → dark */}
      <div style={{ position: "relative", height: 80, overflow: "hidden", background: "#f7f2ee" }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, width: "100%", height: "100%" }}>
          <polygon points="0,0 1440,80 0,80" fill="#050202" />
        </svg>
      </div>
    </>
  );
}


/* ---------- "Stairs" reveal background section ---------- */
function StairsSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <section ref={ref} style={{
      position: "relative", height: "100vh", width: "100%",
      overflow: "hidden", background: "transparent", color: "white",
    }}>
      <div style={{
        position: "relative", zIndex: 10, height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 24px",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          style={{
            position: "relative",
            padding: "60px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "8px",
          }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 10, letterSpacing: "0.3em", color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.4)", borderRadius: 2,
            padding: "5px 12px", marginBottom: 28,
            fontWeight: 500
          }}>
            HOW IT WORKS <span style={{ color: "#be123c" }}>||</span>
          </div>
          <Reveal as="h2" text="DISCOVERING"
            style={{ fontSize: "clamp(3rem,7.5vw,7.5rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", color: "white", margin: 0 }}
          />
          <Reveal as="h2" text="YOUR VOICE" delay={0.25}
            style={{ fontSize: "clamp(3rem,7.5vw,7.5rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", color: "#be123c", margin: 0 }}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{ marginTop: 32, maxWidth: 480, margin: "32px auto 0", fontSize: 14, color: "#ffffff", lineHeight: 1.8, fontWeight: 400 }}
          >
            Rather than guessing at what influences discovery, you get a
            structured approach: define what matters, track how it changes, and
            act on what the data reveals.
          </motion.p>
        </motion.div>
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
      background: "transparent", color: "white",
      padding: "100px 60px", overflow: "hidden",
    }}>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle kicker="REAL-TIME" title="YOUR CAREER" accent="DASHBOARD" />

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
                <div style={{ fontSize: 12, letterSpacing: "0.25em", color: "rgba(4, 4, 4, 0.55)", marginBottom: 6 }}>VISIBILITY INDEX</div>
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
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 10, color: "rgba(12, 12, 12, 0.45)", letterSpacing: "0.15em" }}>
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
            <div style={{ fontSize: 12, letterSpacing: "0.25em", color: "rgba(7, 7, 7, 0.55)", marginBottom: 16 }}>JOB READINESS</div>
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
            <div style={{ fontSize: 11, color: "rgba(120,10,30,0.7)", marginTop: 16 }}>Strong - keep momentum</div>
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
              <div style={{ fontSize: 12, letterSpacing: "0.25em", color: "rgba(8, 8, 8, 0.55)" }}>{m.l}</div>
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

function FlipCard({ c, i }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        perspective: 1200,
        height: 380,
        cursor: "pointer",
        width: "100%"
      }}
    >
      <motion.div
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 90, damping: 15 }}
        style={{
          width: "100%", height: "100%",
          position: "relative",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Front of Card */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          background: "#f5f1e8", color: "#111",
          borderRadius: 16, padding: "32px 24px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#be123c", marginBottom: 16 }}>◇ {c.tag}</div>
            <div style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.2, color: "#1a1a1a" }}>{c.title}</div>
          </div>
          <p style={{ fontSize: 14, color: "rgba(0,0,0,0.7)", lineHeight: 1.65, margin: 0 }}>{c.body}</p>
          <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
            {[...Array(6)].map((_, k) => (
              <span key={k} style={{ width: 6, height: 16, background: "rgba(120,10,30,0.35)", borderRadius: 3 }} />
            ))}
          </div>
        </div>

        {/* Back of Card */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          background: "linear-gradient(135deg, #be123c 0%, #4a040b 100%)", color: "white",
          borderRadius: 16, padding: "32px 24px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          transform: "rotateY(180deg)",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
        }}>
          <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 16, color: "#f5f1e8" }}>{c.backTitle}</div>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0 }}>{c.backBody}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function IndustrySection({ onNav }) {
  const cards = [
    {
      tag: "AI / ML", title: "TECHNOLOGISTS",
      body: "Track how AI assistants and hiring tools talk about your skill stack across roles, and surface where you stand vs peers.",
      backTitle: "DATA-DRIVEN INSIGHTS",
      backBody: "RejexIQ analyzes the specific algorithms HR systems use to evaluate engineers, ensuring your resume speaks both human and machine languages natively."
    },
    {
      tag: "PRODUCT", title: "BUILDERS",
      body: "Get a clearer view of how product and design roles map to your portfolio — and what evidence moves the needle.",
      backTitle: "PORTFOLIO OPTIMIZATION",
      backBody: "We highlight the exact product metrics and design thinking evidence that modern Applicant Tracking Systems prioritize for top-tier product roles."
    },
    {
      tag: "LEADERSHIP", title: "OPERATORS",
      body: "Understand how decision-makers and exec search firms perceive your trajectory, and where to invest your story.",
      backTitle: "EXECUTIVE PRESENCE",
      backBody: "Translate your operational leadership into the strategic keywords and impact statements that board members and executive recruiters are actively searching for."
    },
  ];

  return (
    <section id="ind" style={{
      position: "relative", minHeight: "100vh", width: "100%",
      background: "transparent",
      color: "white", padding: "100px 60px", overflow: "hidden",
    }}>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "0.65fr 2.35fr", gap: 60, alignItems: "center" }}>
        <div>
          <SectionTitle kicker="FOR EVERYONE" title="FIND YOUR" accent="INDUSTRY" />
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
            GET STARTED →
          </motion.button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {cards.map((c, i) => (
            <FlipCard key={i} c={c} i={i} />
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
      background: "transparent",
      color: "white", overflow: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>

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
        REJEXIQ - REJEXIQ
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
        CREATE FREE ACCOUNT →
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



/* ============================================================
   PAGE
   ============================================================ */
export default function CareerLanding({ onNav, onDemo }) {
  useLenis();
  const whatIsRef = useRef(null);
  const { scrollYProgress: whatIsScroll } = useScroll({ target: whatIsRef, offset: ["start center", "end center"] });

  return (
    <div className="bg-black">
      <ScrollBar />
      <LuxuryExperience whatIsScroll={whatIsScroll} />
      <Nav onNav={onNav} />
      <Hero onNav={onNav} />
      <WhatIsSection sectionRef={whatIsRef} />
      <FeatureBreak />
      <StairsSection />
      <DashboardSection />
      <IndustrySection onNav={onNav} />
      <MarqueeCTA onNav={onNav} />
    </div>
  );
}
