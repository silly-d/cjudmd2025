const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

lenis.on('scroll', ScrollTrigger.update); // 하나만 남깁니다.

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

ScrollTrigger.defaults({
    scroller: lenis.wrapper,
})

function getPositions() {
  const w = window.innerWidth;

  if (w > 1400) {
    return [
    { top: "0%", left: "15%"},
    { top: "0%", left: "30%"},
    { top: "0%", left: "45%"},
    { top: "0%", left: "60%"},
    { top: "0%", left: "75%"},
    
    { top: "40%", left: "15%"},
    { top: "40%", left: "30%"},
    { top: "40%", left: "45%"},
    { top: "40%", left: "60%"},
    { top: "40%", left: "75%"},

    { top: "80%", left: "15%"},
    { top: "80%", left: "30%"},
    { top: "80%", left: "45%"},
    { top: "80%", left: "60%"},
    { top: "80%", left: "75%"},

    { top: "120%", left: "15%"},
    { top: "120%", left: "30%"},
    { top: "120%", left: "45%"},
    { top: "120%", left: "60%"},
    { top: "120%", left: "75%"},
    
    { top: "160%", left: "15%"},
    { top: "160%", left: "30%"},
    { top: "160%", left: "45%"},
    { top: "160%", left: "60%"},
    { top: "160%", left: "75%"},

    { top: "200%", left: "15%"},
    { top: "200%", left: "30%"},
    { top: "200%", left: "45%"},
    { top: "200%", left: "60%"},
    { top: "200%", left: "75%"},

    { top: "240%", left: "15%"},
    { top: "240%", left: "30%"},
    { top: "240%", left: "45%"},
    { top: "240%", left: "60%"},
    { top: "240%", left: "75%"},

    { top: "280%", left: "15%"},
    { top: "280%", left: "30%"},
    { top: "280%", left: "45%"},
    { top: "280%", left: "60%"},
    { top: "280%", left: "75%"},
    
    { top: "320%", left: "15%"},
    { top: "320%", left: "30%"},
    { top: "320%", left: "45%"},
    { top: "320%", left: "60%"},
    { top: "320%", left: "75%"},

    { top: "360%", left: "30%"},
    { top: "360%", left: "45%"},
    { top: "360%", left: "60%"},
    ]
  }
}

positions = getPositions();

// ----------------------------
// 기본 DOM 설정
// ----------------------------
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

// ----------------------------
// GSAP 초기 설정
// ----------------------------
gsap.set(".profile", {
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%) scale(0)"
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
  width: () => window.innerWidth > 900 ? "200px" : "120px",
  height: () => window.innerWidth > 900 ? "350px" : "200px",
  stagger: 0,
  duration: 0.45,
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

  const maxTopPercent = Math.max(...positions.map(p => parseFloat(p.top) || 0));
  const extraVhPadding = 15;
  wrapper.style.minHeight = `${maxTopPercent + extraVhPadding}vh`;
}

function scatterAndShrink() {
  gsap.to(".profile", {
    top: (i) => positions[i].top,
    left: (i) => positions[i].left,
    transform: "none",
    width: "200px",
    height: "350px",
    stagger: 0.05,
    duration: 1.2,
    ease: "power2.out",
    onComplete: () => {
      adjustSectionHeightFromPositions();
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }
  });
}

overlay.addEventListener("click", () => {
  const enlarged = document.querySelector('.profile[data-enlarged="true"]');
  if (enlarged) enlarged.click();
});

imgs.forEach((img, i) => {
  if (positions[i]) {
    img.setAttribute('data-original-position', JSON.stringify(positions[i]));
    img.setAttribute('data-enlarged', 'false');
  }
});

window.addEventListener("load", adjustSectionHeightFromPositions);

window.addEventListener("resize", () => {
  positions = getPositions();
  scatterAndShrink();
  adjustSectionHeightFromPositions();
  ScrollTrigger.refresh();
});