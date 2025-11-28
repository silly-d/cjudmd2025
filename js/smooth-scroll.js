// js/smooth-scroll.js

// 1. autoResize를 true로 변경하여 페이지 높이 변화를 실시간으로 감지하게 합니다.
window.lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  autoResize: true, // ★ 중요: false -> true로 변경
});

function raf(time) {
  window.lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

if (typeof ScrollTrigger !== "undefined") {
  window.lenis.on("scroll", ScrollTrigger.update);

  // GSAP ScrollTrigger가 Lenis 스크롤을 사용하도록 설정
  gsap.ticker.add((time) => {
    window.lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// 2. 페이지의 모든 리소스(이미지 등)가 로드된 후 강제로 높이 재계산
window.addEventListener("load", () => {
  window.lenis.resize();
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
});

// 3. ResizeObserver를 사용하여 DOM(body)의 크기가 변할 때마다 Lenis 업데이트
// (이미지가 늦게 뜨거나, 아코디언 메뉴 등으로 높이가 변할 때 필수)
const resizeObserver = new ResizeObserver(() => {
  window.lenis.resize();
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
});
resizeObserver.observe(document.body);

// --- 아래는 기존 헤더 및 모바일 메뉴 로직 (유지) ---

const header = document.querySelector("header");
const headerHeight = header ? header.offsetHeight : 0; // header가 없을 경우 대비 안전장치 추가
let lastScrollTop = 0;

window.addEventListener("scroll", function () {
  let currentScrollTop = window.scrollY || document.documentElement.scrollTop;

  if (header) {
    // header가 존재할 때만 실행
    if (currentScrollTop > headerHeight) {
      if (currentScrollTop > lastScrollTop) {
        header.classList.add("header-hidden");
      } else {
        header.classList.remove("header-hidden");
      }
    } else {
      header.classList.remove("header-hidden");
    }
  }
  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});

const menuToggle = document.getElementById("menu-toggle");

if (menuToggle) {
  menuToggle.addEventListener("change", function () {
    if (this.checked) {
      // 모바일 메뉴 열림: 스크롤 잠금 (의도된 기능)
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      window.lenis.stop(); // Lenis 정지
    } else {
      // 모바일 메뉴 닫힘: 스크롤 해제
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      window.lenis.start(); // Lenis 재개
      window.lenis.resize(); // 혹시 모를 위치 어긋남 방지
    }
  });
}

// 화면 크기 계산 (VH)
const setScreenSize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

setScreenSize();

// 윈도우 리사이즈 이벤트
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth !== document.documentElement.clientWidth) {
      setScreenSize();
      window.lenis.resize();
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }
  }, 100);
});
