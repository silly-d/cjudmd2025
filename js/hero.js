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

  gsap.from(items, {
    duration: 2.5,
    scale: 0,
    opacity: 0,
    ease: "expo.out",
    stagger: 0.1
  });
});

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".item").forEach(item => {
  const randomX = gsap.utils.random(-window.innerWidth, window.innerWidth);
  const randomY = gsap.utils.random(-window.innerHeight, window.innerHeight);

  gsap.to(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 35%",
      scrub: true,
      
      onToggle: self => {
        if (self.isActive) {
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

  const textAnimation = gsap.timeline({
    scrollTrigger: {
        trigger: ".content01",
        start: "top top",
        end: "+=500",
        scrub: 1,
    }
});

textAnimation
    .to(".text-left", { 
        xPercent: -50,
        opacity: 0
    }, 0)
    .to(".text-right", {
        xPercent: 50,
        opacity: 0
    }, 0)
    .to(".field", {
        yPercent: 50,
        opacity: 0
    }, 0);

});

