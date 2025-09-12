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
      start: "top 35%",
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
        yPercent: -100,
        opacity: 0
    }, 0
  );

  gsap.utils.toArray(".ct02-item").forEach(item => {
    gsap.from(item, {
        yPercent: 50, // 요소를 높이만큼 아래로 이동
        opacity: 0,
        ease: "power3.out",
        scrollTrigger: {
            trigger: item,
            start: "top 90%",
            end: "bottom 90%",
            scrub: 1,
        }
    });
});

const maskTimeline = gsap.timeline();


maskTimeline.to('.mask-container img', {
    scale: 30,
    ease: "power1.in"
})
.to('.mask-container img', {
    opacity: 0,
    ease: "power1.in"
})
.to('body', {
    backgroundColor: '#ffffff',
    color: '#000',
    ease: "none"
}, "-=1");

ScrollTrigger.create({
    animation: maskTimeline,
    trigger: ".mask-container",
    start: "center center", 
    end: "+=1500",
    scrub: 1,
    pin: true,
    onLeave: () => {
        gsap.set(".mask-container", { display: "none" });
    }
});