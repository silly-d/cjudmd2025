// js/smooth-scroll.js

// 1. 모바일 감지
const isMobile =
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// PC일 때만 Lenis 초기화
if (!isMobile) {
  window.lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    autoResize: true,
  });

  // GSAP <-> Lenis 연동 (PC에서만 실행)
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });
  }
}

// RAF 루프 (안전장치 추가)
function raf(time) {
  if (!isMobile && window.lenis) {
    window.lenis.raf(time);
  }
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. 페이지 로드 시 높이 재계산 (안전장치 추가)
window.addEventListener("load", () => {
  // window.lenis가 있을 때만 실행 (?.)
  window.lenis?.resize();
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
});

// 3. ResizeObserver 개선: '너비'가 변할 때만 리프레시 (중요!)
// 모바일 주소창 때문에 높이만 바뀌는 경우를 무시하여 덜컥거림 방지
let lastWidth = window.innerWidth;

const resizeObserver = new ResizeObserver(() => {
  const width = window.innerWidth;

  // 너비가 달라졌을 때만 실행 (모바일 가로모드 전환, PC 창 크기 조절 등)
  if (width !== lastWidth) {
    window.lenis?.resize(); // 안전장치 추가
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    lastWidth = width;
  }
});
resizeObserver.observe(document.body);

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
