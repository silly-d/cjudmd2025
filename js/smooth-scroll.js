// js/smooth-scroll.js

// 1. GSAP 플러그인 등록 (가장 먼저 실행)
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 2. 모바일 감지 (기존 로직 유지)
const isMobile =
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
  window.innerWidth <= 768; // CSS 미디어쿼리와 맞추기 위해 너비 체크도 추가 권장

// =================================================
// 분기 처리: 모바일 vs PC
// =================================================

if (isMobile) {
  // ■■■ 모바일 환경 설정 ■■■

  if (typeof ScrollTrigger !== "undefined") {
    // 1. 주소창 등락으로 인한 리사이즈 무시 (모바일 필수)
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });
  }
} else {
  window.lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    autoResize: true,
  });

  // Lenis RAF 루프 (PC에서만 실행하여 모바일 성능 저하 방지)
  function raf(time) {
    window.lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // GSAP <-> Lenis 연동
  if (typeof ScrollTrigger !== "undefined") {
    // Lenis 스크롤을 ScrollTrigger에 업데이트
    window.lenis.on("scroll", ScrollTrigger.update);

    // GSAP ticker에 Lenis 연결 (동기화)
    gsap.ticker.add((time) => {
      window.lenis.raf(time * 1000);
    });

    // GSAP ticker의 lagSmoothing 비활성화 (Lenis와 충돌 방지)
    gsap.ticker.lagSmoothing(0);
  }
}

// =================================================
// 3. 공통 리사이즈 감지 (너비 변화만 체크)
// =================================================

let lastWidth = window.innerWidth;

const resizeObserver = new ResizeObserver(() => {
  const width = window.innerWidth;

  // 너비가 실제로 변했을 때만(가로모드 전환, PC 창 조절) 리프레시 수행
  if (width !== lastWidth) {
    if (!isMobile && window.lenis) window.lenis.resize();
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();

    lastWidth = width;
  }
});

resizeObserver.observe(document.body);

// 4. 페이지 로드 완료 시 강제 리프레시 (이미지 로딩 후 밀림 방지)
window.addEventListener("load", () => {
  if (!isMobile && window.lenis) window.lenis.resize();
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
});

// --- 아래는 기존 헤더 및 모바일 메뉴 로직 ---

const header = document.querySelector("header");
const headerHeight = header ? header.offsetHeight : 0;
let lastScrollTop = 0;

window.addEventListener("scroll", function () {
  let currentScrollTop = window.scrollY || document.documentElement.scrollTop;

  if (header) {
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
      // 모바일 메뉴 열림
      document.body.style.overflow = "hidden";
      // 모바일에서는 position: fixed 하면 스크롤 위치가 날아갈 수 있으니 주의 필요
      // 일단 기존 로직 유지하되 Lenis 에러 방지
      document.body.style.position = "fixed";
      document.body.style.width = "100%";

      window.lenis?.stop(); // Lenis가 있을 때만 정지
    } else {
      // 모바일 메뉴 닫힘
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";

      window.lenis?.start(); // Lenis가 있을 때만 재개
      window.lenis?.resize();
    }
  });
}

// 윈도우 리사이즈 이벤트 (디바운싱 적용)

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // 너비가 실제로 변했을 때만 실행
    if (window.innerWidth !== lastWidth) {
      // setScreenSize(); <--- 삭제 (정의되지 않은 함수 호출 에러 방지)

      window.lenis?.resize();
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      lastWidth = window.innerWidth;
    }
  }, 100);
});
