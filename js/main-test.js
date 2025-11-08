//lenis smooth
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on("scroll", ScrollTrigger.update);

//gsap 설정
gsap.registerPlugin(ScrollTrigger);

// matchMedia 설정
const mm = gsap.matchMedia();

//hero section
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

// 데스크탑 애니메이션
mm.add("(min-width: 769px)", () => {
  // item 애니메이션
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

  // text animation
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

  //content02 section
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

  //content03 section - mask
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

  // horizontal scroll
  const horizontalScroll = gsap.timeline({
    scrollTrigger: {
      trigger: ".ct03-wrapper",
      start: "top top",
      end: "+=1500",
      scrub: 1,
      pin: true,
    },
  });

  horizontalScroll.from(
    ".slogun",
    {
      x: "160vw",
      duration: 0.8,
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

  // cards animation
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

  //content04 section
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

  return () => {
    // cleanup function
  };
});

// 모바일 애니메이션
mm.add("(max-width: 768px)", () => {
  // 모바일에서는 item 애니메이션 단순화

  gsap.utils.toArray(".item").forEach((item) => {
    const randomX = gsap.utils.random(-window.innerWidth, window.innerWidth);
    const randomY = gsap.utils.random(-window.innerHeight, window.innerHeight);

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

  // 모바일 text animation (더 짧은 거리)
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

  //content02 section - 모바일
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

  // 모바일 content03 section 수정
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
    // 또는 toggleActions 사용
    toggleActions: "play none none reverse",
  });

  // 배경색 변화를 별도로 관리 (더 나은 방법)
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
        backgroundColor: "#121212", // 원래 색으로
        color: "#ffffff",
        duration: 0.3,
      });
    },
  });

  //content04 section - 모바일
  const heroReveal = gsap.utils.toArray(".content04");
  heroReveal.forEach((element) => {
    const heroBox = element.querySelector(".hero-reveal__header");
    const heroHeadings = element.querySelectorAll(".hero-reveal_split_item");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "center center",
        end: `+=1800`, // 모바일에서는 짧게
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

  return () => {
    // cleanup function
  };
});

// 메뉴 토글 (공통)
const menuToggle = document.getElementById("menu-toggle");

if (menuToggle) {
  menuToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.style.overflow = "hidden";
      lenis.stop(); // Lenis 스크롤 멈춤
    } else {
      document.body.style.overflow = "";
      lenis.start(); // Lenis 스크롤 재개
    }
  });
}

// 리사이즈 시 ScrollTrigger 새로고침
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});
