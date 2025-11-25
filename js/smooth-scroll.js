let lenis = null;

function initSmoothScroll() {
  const isMobile = window.innerWidth < 768; // 기준 너비 (원하는대로 수정)

  // 1. 모바일 환경이면
  if (isMobile) {
    if (lenis) {
      // 이미 실행 중이라면 파괴(Kill)
      lenis.destroy();
      lenis = null;

      // GSAP Ticker에서 Lenis 제거 (중요: 에러 방지)
      gsap.ticker.remove(lenisRaf);
    }
  }
  // 2. 데스크탑 환경이고, Lenis가 아직 없다면
  else if (!lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(lenisRaf); // 함수 분리
    gsap.ticker.lagSmoothing(0);
  }
}

// GSAP Ticker용 함수 분리 (remove를 위해)
function lenisRaf(time) {
  if (lenis) lenis.raf(time * 1000);
}

// 초기 실행 및 리사이즈 감지
initSmoothScroll();
window.addEventListener("resize", () => {
  initSmoothScroll();
  ScrollTrigger.refresh(); // 리사이즈 후 좌표 재계산
});
