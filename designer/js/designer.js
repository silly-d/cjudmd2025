const lenis = new Lenis({
  duration: 1.2,

  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

lenis.on("scroll", ScrollTrigger.update); // 하나만 남깁니다.

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

ScrollTrigger.defaults({
  scroller: lenis.wrapper,
});

function getPositions() {
  const w = window.innerWidth;

  if (w > 1400) {
    return [
      { top: "0%", left: "0%" },
      { top: "0%", left: "21%" },
      { top: "0%", left: "42%" },
      { top: "0%", left: "63%" },
      { top: "0%", left: "84%" },

      { top: "40%", left: "0%" },
      { top: "40%", left: "21%" },
      { top: "40%", left: "42%" },
      { top: "40%", left: "63%" },
      { top: "40%", left: "84%" },

      { top: "80%", left: "0%" },
      { top: "80%", left: "21%" },
      { top: "80%", left: "42%" },
      { top: "80%", left: "63%" },
      { top: "80%", left: "84%" },

      { top: "120%", left: "0%" },
      { top: "120%", left: "21%" },
      { top: "120%", left: "42%" },
      { top: "120%", left: "63%" },
      { top: "120%", left: "84%" },

      { top: "160%", left: "0%" },
      { top: "160%", left: "21%" },
      { top: "160%", left: "42%" },
      { top: "160%", left: "63%" },
      { top: "160%", left: "84%" },

      { top: "200%", left: "0%" },
      { top: "200%", left: "21%" },
      { top: "200%", left: "42%" },
      { top: "200%", left: "63%" },
      { top: "200%", left: "84%" },

      { top: "240%", left: "0%" },
      { top: "240%", left: "21%" },
      { top: "240%", left: "42%" },
      { top: "240%", left: "63%" },
      { top: "240%", left: "84%" },

      { top: "280%", left: "0%" },
      { top: "280%", left: "21%" },
      { top: "280%", left: "42%" },
      { top: "280%", left: "63%" },
      { top: "280%", left: "84%" },

      { top: "320%", left: "0%" },
      { top: "320%", left: "21%" },
      { top: "320%", left: "42%" },
      { top: "320%", left: "63%" },
      { top: "320%", left: "84%" },

      { top: "360%", left: "21%" },
      { top: "360%", left: "42%" },
      { top: "360%", left: "63%" },
    ];
  }
}

positions = getPositions();

const imgs = document.querySelectorAll(".profile");
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.zIndex = "900";
overlay.style.display = "none";
overlay.style.cursor = "pointer";
overlay.style.background = "rgba(0,0,0,0)";
document.body.appendChild(overlay);

gsap.set(".profile", {
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%) scale(0)",
});

gsap.from(".text-left", {
  y: 40,
  ease: "power4.inOut",
  duration: 1,
  stagger: { amount: 0.15 },
  delay: 0.5,
});

gsap.to(".profile", {
  scale: 1,
  width: () => (window.innerWidth > 900 ? "250px" : "120px"),
  height: () => (window.innerWidth > 900 ? "350px" : "200px"),
  stagger: 0,
  duration: 0.6,
  ease: "power2.out",
  delay: 1,
  onComplete: scatterAndShrink,
});

gsap.to(".text-left", {
  top: "40px",
  ease: "power4.inOut",
  duration: 1,
  stagger: { amount: 0.15 },
  delay: 2,
  onComplete: () => document.querySelector(".landing-text").remove(),
});

function adjustSectionHeightFromPositions() {
  const wrapper = document.querySelector(".profile-gallery-wrapper");
  if (!wrapper || !positions.length) return;
  const maxTopPercent = Math.max(...positions.map((p) => parseFloat(p.top) || 0));
  const extraVhPadding = 15;
  wrapper.style.minHeight = `${maxTopPercent + extraVhPadding}vh`;
}

function scatterAndShrink() {
  gsap.to(".profile", {
    top: (i) => positions[i].top,
    left: (i) => positions[i].left,
    transform: "none",
    width: () => (window.innerWidth > 900 ? "220px" : "120px"),
    height: () => (window.innerWidth > 900 ? "350px" : "200px"),
    stagger: 0,
    duration: 1,
    ease: "power2.inOut",
    onComplete: () => {
      adjustSectionHeightFromPositions();
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    },
  });
}

overlay.addEventListener("click", () => {
  const enlarged = document.querySelector('.profile[data-enlarged="true"]');
  if (enlarged) enlarged.click();
});

imgs.forEach((img, i) => {
  if (positions[i]) {
    img.setAttribute("data-original-position", JSON.stringify(positions[i]));
    img.setAttribute("data-enlarged", "false");
  }
});

window.addEventListener("load", adjustSectionHeightFromPositions);

window.addEventListener("resize", () => {
  positions = getPositions();
  scatterAndShrink();
  adjustSectionHeightFromPositions();
  ScrollTrigger.refresh();
});
