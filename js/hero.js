const lenis = new Lenis({
  duration: 1.5,   // 값이 클수록 더 부드럽게
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

// 매 프레임마다 실행
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);


window.addEventListener("load", () => {
  const items = gsap.utils.toArray(".item");

  // 첫 진입: 중앙에서 퍼져나오기
  gsap.from(items, {
    duration: 2.5,
    scale: 0,
    opacity: 0,
    ease: "expo.out",
    stagger: 0.05
  });
});

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".item").forEach(item => {
  const randomX = gsap.utils.random(-window.innerWidth, window.innerWidth);
  const randomY = gsap.utils.random(-window.innerHeight, window.innerHeight);

  gsap.to(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 35%", // end 지점을 조금 수정하여 더 자연스럽게 만듭니다.
      scrub: true,
      
      onToggle: self => {
        if (self.isActive) {
          // 애니메이션이 활성화될 때
          // 1. 현재 위치/크기를 가져옵니다.
          const bounds = item.getBoundingClientRect();
          
          gsap.set(item, {
            position: 'fixed',
            zIndex: -100
          });
        } else {
          gsap.set(item, { clearProps: "all", dealy: 0.5 });
        }
      }
    },
    // 아래 애니메이션 속성은 기존과 동일합니다.
    x: randomX,
    y: randomY,
    scale: gsap.utils.random(1, 5),
    opacity: 0,
    ease: "power2.out",
    markers: true
  });
});

