/**
 * ZipperHeroHorizontal.jsx
 * React + GSAP ScrollTrigger
 * FIXED: Stats/CTA removed from closed fabric state.
 * Only headline shows on load. Stats reveal during scroll.
 */

import { useEffect, useRef, forwardRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SVG_W = 1920, SVG_H = 1080, CY = SVG_H / 2;
const TEETH = 130, TW = 6, TH = 13, TGAP = 3.5, TUNIT = TW + TGAP;

export default function ZipperHeroHorizontal() {
  const scrollerRef  = useRef(null);
  const trackRef     = useRef(null);
  const sliderRef    = useRef(null);
  const hintRef      = useRef(null);
  const brandRef     = useRef(null);  // headline only — no stats

  const cb1Ref       = useRef(null);
  const cb2Ref       = useRef(null);
  const cb3Ref       = useRef(null);
  const openTextRef  = useRef(null);

  const tpRef  = useRef(null); const tsRef = useRef(null);
  const bpRef  = useRef(null); const bsRef = useRef(null);
  const ttgRef = useRef(null); const btgRef = useRef(null);
  const rrRef  = useRef(null);
  const tT = useRef([]); const bT = useRef([]);

  const d0Ref = useRef(null); const d1Ref = useRef(null);
  const d2Ref = useRef(null); const d3Ref = useRef(null);

  useEffect(() => {
    document.body.style.background = "#0d0d0d";
    document.documentElement.style.background = "#0d0d0d";
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";
    document.documentElement.style.overflow = "hidden";

    const W = window.innerWidth, H = window.innerHeight;
    const ns = "http://www.w3.org/2000/svg";

    // Build teeth
    tT.current = []; bT.current = [];
    function mkT(gRef, arr, ry) {
      const g = gRef.current;
      while (g.firstChild) g.removeChild(g.firstChild);
      for (let i = 0; i < TEETH; i++) {
        const r = document.createElementNS(ns, "rect");
        r.setAttribute("width", TW); r.setAttribute("height", TH);
        r.setAttribute("ry", ry); r.setAttribute("fill", "#c8c8c8");
        r.setAttribute("stroke", "#888"); r.setAttribute("stroke-width", "0.4");
        g.appendChild(r); arr.push(r);
      }
    }
    mkT(ttgRef, tT.current, "2 2 0 0");
    mkT(btgRef, bT.current, "0 0 2 2");

    function bez(t, p0, p1, p2, p3) {
      const m = 1 - t;
      return {
        x: m*m*m*p0.x + 3*m*m*t*p1.x + 3*m*t*t*p2.x + t*t*t*p3.x,
        y: m*m*m*p0.y + 3*m*m*t*p1.y + 3*m*t*t*p2.y + t*t*t*p3.y,
      };
    }

    function scene(sx, sp) {
      if (sp >= SVG_H) {
        [tpRef, tsRef, bpRef, bsRef].forEach(r => r.current.setAttribute("d", ""));
        rrRef.current.setAttribute("width", "0");
        tT.current.forEach(t => t.setAttribute("visibility", "hidden"));
        bT.current.forEach(t => t.setAttribute("visibility", "hidden"));
        return;
      }
      const c = sx * 0.48;
      const tP0={x:0,y:CY-sp}, tP1={x:c*0.15,y:CY-sp*0.1};
      const tP2={x:sx-c*0.2,y:CY}, tP3={x:sx,y:CY};
      const bP0={x:0,y:CY+sp}, bP1={x:c*0.15,y:CY+sp*0.1};
      const bP2={x:sx-c*0.2,y:CY}, bP3={x:sx,y:CY};
      const SW = 60;
      tpRef.current.setAttribute("d", [`M 0,0 L ${SVG_W},0 L ${SVG_W},${CY}`,`L ${sx},${CY}`,`C ${tP2.x},${tP2.y} ${tP1.x},${tP1.y} ${tP0.x},${tP0.y}`,`L 0,0 Z`].join(" "));
      tsRef.current.setAttribute("d", [`M ${tP0.x},${tP0.y}`,`C ${tP1.x},${tP1.y} ${tP2.x},${tP2.y} ${tP3.x},${tP3.y}`,`L ${tP3.x},${tP3.y+SW}`,`C ${tP2.x},${tP2.y+SW} ${tP1.x},${tP1.y+SW} ${tP0.x},${tP0.y+SW} Z`].join(" "));
      bpRef.current.setAttribute("d", [`M 0,${SVG_H} L ${SVG_W},${SVG_H} L ${SVG_W},${CY}`,`L ${sx},${CY}`,`C ${bP2.x},${bP2.y} ${bP1.x},${bP1.y} ${bP0.x},${bP0.y}`,`L 0,${SVG_H} Z`].join(" "));
      bsRef.current.setAttribute("d", [`M ${bP0.x},${bP0.y}`,`C ${bP1.x},${bP1.y} ${bP2.x},${bP2.y} ${bP3.x},${bP3.y}`,`L ${bP3.x},${bP3.y-SW}`,`C ${bP2.x},${bP2.y-SW} ${bP1.x},${bP1.y-SW} ${bP0.x},${bP0.y-SW} Z`].join(" "));
      for (let i = 0; i < TEETH; i++) {
        const tx = i * TUNIT + 2;
        if (sx <= 0 || tx >= sx) {
          tT.current[i].setAttribute("visibility", "hidden");
          bT.current[i].setAttribute("visibility", "hidden");
          continue;
        }
        tT.current[i].setAttribute("visibility", "visible");
        bT.current[i].setAttribute("visibility", "visible");
        const t = tx / sx;
        const tp = bez(t, tP0, tP1, tP2, tP3);
        const bp = bez(t, bP0, bP1, bP2, bP3);
        tT.current[i].setAttribute("x", tp.x - TW / 2);
        tT.current[i].setAttribute("y", tp.y - TH);
        bT.current[i].setAttribute("x", bp.x - TW / 2);
        bT.current[i].setAttribute("y", bp.y);
      }
      const rr = rrRef.current;
      if (sx >= SVG_W) { rr.setAttribute("width", "0"); }
      else { rr.setAttribute("x", Math.max(0, sx - 2)); rr.setAttribute("width", Math.max(0, SVG_W - sx + 2)); }
    }

    // Position slider + hint
    const sliderEl = sliderRef.current;
    sliderEl.style.top = H / 2 + "px";
    sliderEl.style.left = "0px";
    sliderEl.style.transform = "translateY(-50%)";
    const hintEl = hintRef.current;
    hintEl.style.left = W / 2 + "px";
    hintEl.style.transform = "translateX(-50%)";

    scene(0, 0);

    // Dots
    const dotRefs = [d0Ref, d1Ref, d2Ref, d3Ref];
    const isDark  = [false, true, false, true];
    function setDot(active) {
      dotRefs.forEach((r, i) => {
        if (!r.current) return;
        r.current.style.background = i === active
          ? (isDark[i] ? "#f0ede6" : "#111")
          : (isDark[i] ? "rgba(240,237,230,0.25)" : "rgba(0,0,0,0.18)");
        r.current.style.transform = i === active ? "scale(1.6)" : "scale(1)";
      });
    }

    const scroller = scrollerRef.current;
    ScrollTrigger.defaults({ scroller });

    /* ── ON-LOAD: only headline letters stagger in ── */
    const letters = scroller.querySelectorAll(".hz-letter");
    gsap.set(letters, { opacity: 0, y: 36, rotateX: -80 });
    gsap.set(brandRef.current, { opacity: 1 });
    gsap.set([cb1Ref.current, cb2Ref.current, cb3Ref.current, openTextRef.current], { opacity: 0 });

    const loadTL = gsap.timeline({ delay: 0.15 });
    loadTL.to(letters, {
      opacity: 1, y: 0, rotateX: 0,
      duration: 0.65, stagger: 0.032,
      ease: "power3.out",
    }, 0);

    /* ── ZIPPER TL (0 → 57% of 700vh) ── */
    const st = { sx: 0, sp: 0 };

    const ztl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hz-spacer",
        start: "top top",
        end: "57%",
        scrub: 2.5,
        onUpdate(s) {
          hintEl.style.opacity = s.progress < 0.02 ? "1" : "0";
          setDot(0);
        },
      },
    });

    // Only fade brand (headline) — no stats/cta to fade
    ztl.to(brandRef.current, { opacity: 0, y: -20, ease: "power1.in", duration: 0.1 }, 0);

    ztl.to(sliderEl, { x: W * 1.1, ease: "none" }, 0);
    ztl.to(st, { sx: SVG_W * 1.12, sp: SVG_H + 20, ease: "none", onUpdate() { scene(st.sx, st.sp); } }, 0);

    // Stat blocks reveal left→right as zipper opens
    ztl.fromTo(cb1Ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.09 }, 0.12);
    ztl.to(cb1Ref.current, { opacity: 0, y: -12, ease: "power2.in", duration: 0.07 }, 0.30);

    ztl.fromTo(cb2Ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.09 }, 0.37);
    ztl.to(cb2Ref.current, { opacity: 0, y: -12, ease: "power2.in", duration: 0.07 }, 0.55);

    ztl.fromTo(cb3Ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.09 }, 0.61);
    ztl.to(cb3Ref.current, { opacity: 0, y: -12, ease: "power2.in", duration: 0.07 }, 0.80);

    ztl.fromTo(openTextRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.09 }, 0.86);
    ztl.to(openTextRef.current, { opacity: 0, ease: "power2.in", duration: 0.07 }, 0.95);

    /* ── HORIZONTAL SLIDE (57% → 100%) ── */
    gsap.to(trackRef.current, {
      x: -(3 * W),
      ease: "none",
      scrollTrigger: {
        trigger: "#hz-spacer",
        start: "57%", end: "100%",
        scrub: 1.2,
        onUpdate(s) {
          const p = s.progress;
          if (p < 0.34) setDot(1);
          else if (p < 0.67) setDot(2);
          else setDot(3);
        },
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  // Headline letters
  const headline = "WELCOME ITZFIZZ";
  const headlineLetters = headline.split("").map((ch, i) => (
    <span key={i} className="hz-letter" style={{
      display: "inline-block",
      minWidth: ch === " " ? "0.4em" : undefined,
      color: ch === " " ? "transparent" : "#f0ede6",
      willChange: "transform,opacity",
    }}>
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));

  return (
    <>
      <div ref={scrollerRef} style={{ width:"100vw", height:"100vh", overflowY:"scroll", overflowX:"hidden", position:"relative" }}>
        <div id="hz-spacer" style={{ height:"700vh", width:1, position:"absolute", top:0, left:0, pointerEvents:"none" }} />

        <div style={{ position:"sticky", top:0, width:"100vw", height:"100vh", overflow:"hidden" }}>
          <div ref={trackRef} style={{ display:"flex", width:"400vw", height:"100vh", willChange:"transform" }}>

            {/* ── PANEL 1: ZIPPER ── */}
            <div style={{ width:"100vw", height:"100vh", flexShrink:0, position:"relative", overflow:"hidden", background:"#0d0d0d" }}>

              {/* Light bg revealed as zipper opens */}
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#f0ede6,#e8e4dc)", zIndex:0 }} />

              {/* Brand layer — HEADLINE ONLY on closed fabric */}
              <div ref={brandRef} style={{
                position:"absolute", inset:0, zIndex:15,
                display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center",
                pointerEvents:"none", gap:0,
              }}>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(8px,0.8vw,10px)", fontWeight:300, letterSpacing:"0.55em", color:"rgba(240,237,230,0.45)", textTransform:"uppercase", marginBottom:16, marginTop:0 }}>
                  Est. 2024 &nbsp;·&nbsp; Premium Clothing
                </p>

                {/* Headline — letter by letter stagger on load */}
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(22px,4vw,62px)", fontWeight:400, letterSpacing:"0.28em", textTransform:"uppercase", lineHeight:1, marginBottom:12, display:"flex", flexWrap:"wrap", justifyContent:"center", perspective:"500px" }}>
                  {headlineLetters}
                </div>

                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(9px,0.85vw,11px)", fontWeight:300, letterSpacing:"0.38em", color:"rgba(240,237,230,0.45)", textTransform:"uppercase", marginBottom:0, marginTop:0 }}>
                  Welcome to the Future of Clothing
                </p>
              </div>

              {/* Stat blocks — revealed L→R as zipper opens */}
              <StatBlock ref={cb1Ref} left="calc(16% - 130px)" label="Sustainability" num="100%" desc="Organic &amp; Recycled Materials" />
              <StatBlock ref={cb2Ref} left="calc(42% - 130px)" label="Our Community"  num="12K+"  desc="Happy Customers Worldwide" />
              <StatBlock ref={cb3Ref} left="calc(68% - 130px)" label="Satisfaction"   num="98%"   desc="Customer Satisfaction Rate" />

              {/* Fully open text */}
              <div ref={openTextRef} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", zIndex:2, pointerEvents:"none", opacity:0, display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,4vw,56px)", fontWeight:300, letterSpacing:"0.4em", color:"#111", textTransform:"uppercase", lineHeight:1.25 }}>
                  Fully Revealed
                </h2>
                <div style={{ width:48, height:1, background:"#bbb" }} />
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, fontWeight:300, letterSpacing:"0.35em", color:"#666", textTransform:"uppercase" }}>
                  The future of clothing, uncovered
                </p>
              </div>

              {/* SVG Fabric */}
              <svg style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", zIndex:10, pointerEvents:"none" }}
                viewBox="0 0 1920 1080" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="tEGhz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
                    <stop offset="70%"  stopColor="rgba(0,0,0,0.2)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
                  </linearGradient>
                  <linearGradient id="bEGhz" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
                    <stop offset="70%"  stopColor="rgba(0,0,0,0.2)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
                  </linearGradient>
                  <linearGradient id="rGhz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#555" />
                    <stop offset="50%"  stopColor="#e0e0e0" />
                    <stop offset="100%" stopColor="#555" />
                  </linearGradient>
                </defs>
                <path ref={tpRef} fill="#1e1e1e" />
                <path ref={tsRef} fill="url(#tEGhz)" opacity="0.85" />
                <path ref={bpRef} fill="#1e1e1e" />
                <path ref={bsRef} fill="url(#bEGhz)" opacity="0.85" />
                <g ref={ttgRef} /><g ref={btgRef} />
                <rect ref={rrRef} x="0" y="537.5" width="1920" height="5" fill="url(#rGhz)" rx="2.5" />
              </svg>

              {/* Slider */}
              <div ref={sliderRef} style={{ position:"absolute", zIndex:20, display:"flex", flexDirection:"row", alignItems:"center", willChange:"transform" }}>
                <div style={{ width:44, height:32, background:"linear-gradient(to bottom right,#e8e8e8,#a8a8a8 35%,#d0d0d0 55%,#606060)", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", boxShadow:"0 5px 20px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.35)" }}>
                  <div style={{ position:"absolute", left:6, top:6, bottom:6, width:2, background:"rgba(255,255,255,0.28)", borderRadius:1 }} />
                  <div style={{ width:10, height:10, borderRadius:"50%", background:"#1e1e1e", border:"2px solid #505050" }} />
                </div>
                <div style={{ width:18, height:11, background:"linear-gradient(to right,#bbb,#686868)", borderRadius:"0 4px 4px 0", boxShadow:"4px 0 6px rgba(0,0,0,0.4)" }} />
              </div>

              {/* Hint */}
              <div ref={hintRef} style={{ position:"absolute", bottom:30, zIndex:25, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:"0.4em", color:"rgba(240,237,230,0.5)", textTransform:"uppercase" }}>Scroll</span>
                <div style={{ width:1, height:32, background:"linear-gradient(to bottom,rgba(240,237,230,0.5),transparent)", animation:"hzp 1.8s ease-in-out infinite" }} />
              </div>

              <style>{`
                @keyframes hzp { 0%,100%{opacity:.3} 50%{opacity:1} }
                .hz-letter { will-change:transform,opacity; display:inline-block; }
              `}</style>
            </div>

            {/* PANEL 2: The Collection is Open */}
            <div style={{ width:"100vw", height:"100vh", flexShrink:0, background:"#1a1a1a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,5.5vw,76px)", fontWeight:300, letterSpacing:"0.4em", color:"#f0ede6", textTransform:"uppercase", textAlign:"center", lineHeight:1.25 }}>
                The Collection<br />is Open
              </h2>
              <div style={{ width:60, height:1, background:"rgba(240,237,230,0.3)" }} />
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, fontWeight:300, letterSpacing:"0.35em", color:"rgba(240,237,230,0.5)", textTransform:"uppercase", textAlign:"center" }}>
                Spring · Summer · 2026
              </p>
            </div>

            {/* PANEL 3: Explore */}
            <div style={{ width:"100vw", height:"100vh", flexShrink:0, background:"#f0ede6", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:28 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,5vw,68px)", fontWeight:300, letterSpacing:"0.4em", color:"#111", textTransform:"uppercase", textAlign:"center", lineHeight:1.25 }}>
                Explore<br />the Range
              </h2>
              <div style={{ width:60, height:1, background:"#ccc" }} />
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, fontWeight:300, letterSpacing:"0.35em", color:"#666", textTransform:"uppercase", textAlign:"center" }}>
                Sustainable · Engineered · Timeless
              </p>
              <button style={{ marginTop:8, padding:"14px 48px", border:"1px solid #111", fontFamily:"'Montserrat',sans-serif", fontSize:10, fontWeight:300, letterSpacing:"0.4em", color:"#111", textTransform:"uppercase", cursor:"pointer", background:"transparent", transition:"all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background="#111"; e.currentTarget.style.color="#f0ede6"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#111"; }}>
                Shop Now
              </button>
            </div>

            {/* PANEL 4: Final */}
            <div style={{ width:"100vw", height:"100vh", flexShrink:0, background:"#111", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,4.5vw,64px)", fontWeight:300, letterSpacing:"0.45em", color:"#f0ede6", textTransform:"uppercase", textAlign:"center", lineHeight:1.3 }}>
                FIZZFABRIC<br />2026
              </h2>
              <div style={{ width:60, height:1, background:"rgba(240,237,230,0.25)" }} />
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, fontWeight:300, letterSpacing:"0.35em", color:"rgba(240,237,230,0.5)", textTransform:"uppercase", textAlign:"center" }}>
                Where craft meets conscience
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Progress dots — static initial bg, GSAP updates via ref */}
      <div style={{ position:"fixed", right:20, top:"50%", transform:"translateY(-50%)", zIndex:200, display:"flex", flexDirection:"column", gap:10 }}>
        <div ref={d0Ref} style={{ width:5, height:5, borderRadius:"50%", transition:"all 0.3s", background:"#f0ede6" }} />
        <div ref={d1Ref} style={{ width:5, height:5, borderRadius:"50%", transition:"all 0.3s", background:"rgba(240,237,230,0.25)" }} />
        <div ref={d2Ref} style={{ width:5, height:5, borderRadius:"50%", transition:"all 0.3s", background:"rgba(0,0,0,0.18)" }} />
        <div ref={d3Ref} style={{ width:5, height:5, borderRadius:"50%", transition:"all 0.3s", background:"rgba(240,237,230,0.25)" }} />
      </div>
    </>
  );
}

/* Stat block — revealed during scroll */
const StatBlock = forwardRef(({ left, label, num, desc }, ref) => (
  <div ref={ref} style={{
    position:"absolute", top:"50%", left,
    transform:"translateY(-50%)",
    display:"flex", flexDirection:"column",
    alignItems:"center", textAlign:"center",
    gap:10, width:260, opacity:0, zIndex:2,
    pointerEvents:"none",
    filter:"drop-shadow(0 0 20px rgba(240,237,230,1)) drop-shadow(0 0 40px rgba(240,237,230,0.8))",
  }}>
    <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, fontWeight:300, letterSpacing:"0.5em", color:"#777", textTransform:"uppercase" }}>{label}</span>
    <div style={{ width:28, height:1, background:"#bbb" }} />
    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(48px,6.5vw,88px)", fontWeight:400, color:"#111", letterSpacing:"0.04em", lineHeight:1 }}>{num}</div>
    <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:10, fontWeight:300, letterSpacing:"0.22em", color:"#555", textTransform:"uppercase", lineHeight:1.8 }}
      dangerouslySetInnerHTML={{ __html: desc }} />
  </div>
));