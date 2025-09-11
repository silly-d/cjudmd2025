const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// --- 페이지 로드 시 애니메이션 ---
window.addEventListener("load", () => {
  const items = gsap.utils.toArray(".item");

  gsap.from(items, {
    duration: 2.5,
    scale: 0,
    opacity: 0,
    ease: "expo.out",
    stagger: 0.1
  });
});

// --- 이미지 흩어지는 효과 ---
gsap.utils.toArray(".item").forEach(item => {
  const randomX = gsap.utils.random(-window.innerWidth, window.innerWidth);
  const randomY = gsap.utils.random(-window.innerHeight, window.innerHeight);

  gsap.to(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 25%",
      scrub: true,
      onToggle: self => {
        if (self.isActive) {
          gsap.set(item, { position: "fixed", zIndex: -100 });
        } else {
          gsap.set(item, { clearProps: "all", delay: 0.1 });
        }
      }
    },
    x: randomX,
    y: randomY,
    scale: gsap.utils.random(1, 5),
    opacity: 0,
    ease: "power2.out",
    markers: true
  });
});
