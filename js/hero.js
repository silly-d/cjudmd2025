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
    markers: true,
  });
});

const textAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: ".content01",
    start: "top top",
    end: "+=500",
    scrub: 1,
  },
});

textAnimation
  .to(
    ".text-left",
    {
      xPercent: -50,
      opacity: 0,
    },
    0
  )
  .to(
    ".text-right",
    {
      xPercent: 50,
      opacity: 0,
    },
    0
  )
  .to(
    ".field",
    {
      yPercent: -100,
      opacity: 0,
    },
    0
  );

//content02 section
gsap.utils.toArray(".ct02-item").forEach((item) => {
  gsap.from(item, {
    yPercent: 50, // 요소를 높이만큼 아래로 이동
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

//content03 section
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

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

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
      {
        x: "50vw",
        rotate: 0,
      },
      {
        x: card.endTranslateX,
        rotate: card.rotate * 2,
        ease: "power2.in",
      }
    );
  });
});

//content04 section
const heroReveal = gsap.utils.toArray(".content04");
heroReveal.forEach((element) => {
  const heroBox = element.querySelector(".hero-reveal__header");
  const heroHeadings = element.querySelectorAll(".hero-reveal_split_item");

  const heroBoxHeight = heroBox.offsetHeight;

  // Content scroll up
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: "center center",
      end: `+=1500`,
      scrub: true,
      pin: true,
    },
  });

  // Main clipPath animation
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

  // Split animations for child items
  if (heroHeadings.length < 2) return;

  tl.fromTo(heroHeadings[0], { y: "0%" }, { y: "-30%", ease: "power3.inOut" }, 0);

  tl.fromTo(heroHeadings[1], { y: "0%" }, { y: "30%", ease: "power3.inOut" }, 0);

  tl.to("body", {
    backgroundColor: "#121212",
    color: "#ffffff",
  });
});

let isTransitioning = false;

//content05 section
/*
ScrollTrigger.create({
  trigger: ".empty",
  start: "bottom 80%",
  onEnter: () => {
    if (!isTransitioning) {
      isTransitioning = true;

      // 페이드 아웃 후 about.html로 이동
      gsap.to("body", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // sessionStorage에 플래그 저장
          sessionStorage.setItem("fromIndex", "true");
          window.location.href = "./about/about.html";
        },
      });
    }
  },
});
*/

const menuToggle = document.getElementById("menu-toggle");

menuToggle.addEventListener("change", function () {
  if (this.checked) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
