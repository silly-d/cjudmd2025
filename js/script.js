// js/script.js

// 1. 중복 코드 삭제 (Lenis, Header, Menu, Resize 등은 smooth-scroll.js에서 처리됨)
// 2. GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

// 로드 시 애니메이션
window.addEventListener("load", () => {
  const items = gsap.utils.toArray(".item");

  gsap.from(items, {
    duration: 1.5,
    scale: 0,
    opacity: 0,
    ease: "expo.Out",
    stagger: 0.1,
  });
});

// PC 버전 애니메이션 (min-width: 769px)
mm.add("(min-width: 769px)", () => {
  // 아이템 분산 효과
  gsap.utils.toArray(".item").forEach((item) => {
    const randomX = gsap.utils.random(-window.innerWidth, window.innerWidth);
    const randomY = gsap.utils.random(-window.innerHeight, window.innerHeight);

    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 30%",
        scrub: true,
        onToggle: (self) => {
          if (self.isActive) {
            gsap.set(item, { position: "fixed", zIndex: -100 });
          } else {
            gsap.set(item, { clearProps: "all", delay: 0.1 });
          }
        },
      },
      x: randomX,
      y: randomY,
      scale: gsap.utils.random(1, 5),
      opacity: 0,
      ease: "power2.out",
    });
  });

  // 메인 텍스트 애니메이션
  const textAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".content01",
      start: "top top",
      end: "+=500",
      scrub: 1,
    },
  });

  textAnimation
    .to(".text-left", { xPercent: -50, opacity: 0 }, 0)
    .to(".text-right", { xPercent: 50, opacity: 0 }, 0)
    .to(".field", { yPercent: -100, opacity: 0 }, 0);

  // Content 02 아이템 등장
  gsap.utils.toArray(".ct02-item").forEach((item) => {
    gsap.from(item, {
      yPercent: 50,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        end: "bottom 90%",
        scrub: 1,
      },
    });
  });

  // 마스크 애니메이션
  const maskTimeline = gsap.timeline();

  maskTimeline
    .to(".mask-container img", {
      scale: 30,
      ease: "power1.in",
    })
    .to(".mask-container img", {
      duration: 1,
      ease: "power0.in",
    })
    .to(
      "body",
      {
        backgroundColor: "#ffffff",
        color: "#121212",
        ease: "none",
      },
      "-=1"
    );

  ScrollTrigger.create({
    animation: maskTimeline,
    trigger: ".mask-container",
    start: "center center",
    end: "+=800",
    scrub: 1,
    pin: true,
    onLeave: () => {
      gsap.set(".mask-container", { display: "none" });
    },
  });

  // 가로 스크롤 섹션
  const horizontalScroll = gsap.timeline({
    scrollTrigger: {
      trigger: ".ct03-wrapper",
      start: "top top",
      end: "+=1500",
      scrub: 2.4,
      pin: true,
    },
  });

  horizontalScroll.from(
    ".slogun",
    {
      x: "160vw",
      duration: 0.4,
      ease: "power0.in",
    },
    "<"
  );

  horizontalScroll.to(
    ".ct03-wrapper",
    {
      x: "-460vw",
      ease: "none",
    },
    "<"
  );

  const cards = [
    { id: "#ct03-card-1", endTranslateX: -2000, rotate: 45 },
    { id: "#ct03-card-2", endTranslateX: -1000, rotate: -30 },
    { id: "#ct03-card-3", endTranslateX: -2000, rotate: 25 },
    { id: "#ct03-card-4", endTranslateX: -1500, rotate: -45 },
    { id: "#ct03-card-5", endTranslateX: -2000, rotate: 25 },
    { id: "#ct03-card-6", endTranslateX: -1500, rotate: -45 },
  ];

  cards.forEach((card) => {
    const cardTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".content03",
        start: "top top",
        end: "+=1200vh",
        scrub: 1,
      },
    });

    cardTimeline.fromTo(
      card.id,
      { x: "50vw", rotate: 0 },
      { x: card.endTranslateX, rotate: card.rotate * 2, ease: "power2.in" }
    );
  });

  // 텍스트 리빌 (PC)
  const heroReveal = gsap.utils.toArray(".content04");
  heroReveal.forEach((element) => {
    const heroBox = element.querySelector(".hero-reveal__header");
    const heroHeadings = element.querySelectorAll(".hero-reveal_split_item");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "center center",
        end: `+=1500`,
        scrub: true,
        pin: true,
      },
    });

    tl.fromTo(
      heroBox,
      {
        "clip-path": "polygon(0 0, 100% 0, 100% 50%, 0 50%, 0 50%, 100% 50%, 100% 100%, 0 100%)",
      },
      {
        "clip-path": "polygon(0 0, 100% 0, 100% 0%, 0 0%, 0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: 0.4,
        ease: "power4.inOut",
      }
    );

    if (heroHeadings.length >= 2) {
      tl.fromTo(heroHeadings[0], { y: "0%" }, { y: "-30%", ease: "power3.inOut" }, 0);
      tl.fromTo(heroHeadings[1], { y: "0%" }, { y: "30%", ease: "power3.inOut" }, 0);
    }

    tl.to("body", {
      backgroundColor: "#121212",
      color: "#ffffff",
    });
  });

  return () => {};
});

// 모바일 버전 애니메이션 (max-width: 768px)
mm.add("(max-width: 768px)", () => {
  gsap.utils.toArray(".item").forEach((item) => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 30%",
        scrub: true,
      },
      opacity: 0,
      ease: "power2.out",
    });
  });

  const textAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".content01",
      start: "top top",
      end: "+=300",
      scrub: 1,
    },
  });

  textAnimation
    .to(".text-left", { xPercent: -30, opacity: 0 }, 0)
    .to(".text-right", { xPercent: 30, opacity: 0 }, 0)
    .to(".field", { yPercent: -50, opacity: 0 }, 0);

  gsap.utils.toArray(".ct02-item").forEach((item) => {
    gsap.from(item, {
      yPercent: 30,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        end: "bottom 85%",
        scrub: 1,
      },
    });
  });

  const maskTimeline = gsap.timeline();

  maskTimeline
    .to(".mask-container img", {
      scale: 15,
      ease: "power1.in",
    })
    .to(".mask-container img", {
      duration: 1,
      ease: "power0.in",
    })
    .to(
      "body",
      {
        backgroundColor: "#ffffff",
        color: "#121212",
        ease: "none",
      },
      "-=1"
    );

  ScrollTrigger.create({
    animation: maskTimeline,
    trigger: ".mask-container",
    start: "center center",
    end: "+=500",
    scrub: 1,
    pin: true,
    onEnterBack: () => {
      gsap.set(".mask-container", { display: "flex" });
    },
    toggleActions: "play none none reverse",
  });

  ScrollTrigger.create({
    trigger: ".mask-container",
    start: "bottom center",
    end: "+=500",
    onEnter: () => {
      gsap.to("body", {
        backgroundColor: "#ffffff",
        color: "#121212",
        duration: 0.3,
      });
    },
    onLeaveBack: () => {
      gsap.to("body", {
        backgroundColor: "#121212",
        color: "#ffffff",
        duration: 0.3,
      });
    },
  });

  const cardSettings = [
    { id: "#ct03-card-1", rotate: -10, ySpeed: 100 },
    { id: "#ct03-card-2", rotate: 20, ySpeed: 80 },
    { id: "#ct03-card-3", rotate: -5, ySpeed: 120 },
    { id: "#ct03-card-4", rotate: -25, ySpeed: 90 },
    { id: "#ct03-card-5", rotate: -5, ySpeed: 110 },
    { id: "#ct03-card-6", rotate: 10, ySpeed: 50 },
  ];

  cardSettings.forEach((setting) => {
    const card = document.querySelector(setting.id);
    if (!card) return;

    // 1. 초기 상태 설정 (JS로 강제 적용)
    gsap.set(card, {
      rotation: setting.rotate,
      scale: 0.9,
      opacity: 0.5,
      y: setting.ySpeed, // 아래(또는 위)에서 시작
    });

    // 2. 애니메이션 실행
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 99%", // 화면 하단에 걸치면 시작
        end: "bottom 20%", // 화면 상단 쯤에서 끝
        scrub: 1.5, // 부드럽게 따라오도록
      },
      scale: 1.5, // 확대
      y: -setting.ySpeed, // 반대 방향으로 이동 (패럴랙스)
      opacity: 1, // 선명해짐
      rotation: setting.rotate, // 회전값 유지 (중요)
      ease: "none",
      zIndex: -100,
    });
  });

  const heroReveal = gsap.utils.toArray(".content04");
  heroReveal.forEach((element) => {
    const heroBox = element.querySelector(".hero-reveal__header");
    const heroHeadings = element.querySelectorAll(".hero-reveal_split_item");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "center center",
        end: `+=1800`,
        scrub: true,
        pin: true,
      },
    });

    tl.fromTo(
      heroBox,
      {
        "clip-path": "polygon(0 0, 100% 0, 100% 50%, 0 50%, 0 50%, 100% 50%, 100% 100%, 0 100%)",
      },
      {
        "clip-path": "polygon(0 0, 100% 0, 100% 0%, 0 0%, 0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: 0.4,
        ease: "power4.inOut",
      }
    );

    if (heroHeadings.length >= 2) {
      tl.fromTo(heroHeadings[0], { y: "0%" }, { y: "-20%", ease: "power3.inOut" }, 0);
      tl.fromTo(heroHeadings[1], { y: "0%" }, { y: "20%", ease: "power3.inOut" }, 0);
    }

    tl.to("body", {
      backgroundColor: "#121212",
      color: "#ffffff",
    });
  });

  return () => {};
});

// 마지막 섹션 페이지 전환 효과
let isTransitioning = false;

ScrollTrigger.create({
  trigger: ".content05",
  start: "bottom 80%",
  onEnter: () => {
    if (!isTransitioning) {
      isTransitioning = true;

      gsap.to("body", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          sessionStorage.setItem("fromIndex", "true");
          window.location.href = "./about/about.html";
        },
      });
    }
  },
});
