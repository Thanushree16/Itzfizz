# ITZFIZZ — Hero Section

Live: **[thanushree16.github.io/Itzfizz](https://thanushree16.github.io/Itzfizz/)**

---

For this assignment I wanted to do something more interesting than a standard parallax or image slide. The idea was — what if the hero section itself was a zipper? You scroll, it opens, content is revealed underneath. That became the whole thing.

The zipper uses SVG bezier curves to simulate how real cloth actually separates — not a straight line split, but an organic curve that starts narrow at the slider and widens as it opens. Each tooth is positioned dynamically along that curve. The whole animation is tied directly to scroll progress, so it feels tactile and controlled.

---

**On load:**
- Headline letters stagger in one by one
- Stats fade in with a delay between each

**While scrolling:**
- Zipper slider descends, cloth peels apart
- Stats reveal through the opening gap (100%, 12K+, 98%)
- When fully open, panels slide off screen left and right

---

**Stack:** React · GSAP ScrollTrigger · Tailwind CSS · Vite

---

*Thanushree · 2026*