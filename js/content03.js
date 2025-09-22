// SECTION 03: 화면에 들어왔을 때만 01→48 카운트업 + 잔상
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("content03");
  const title   = document.querySelector(".c03-title");
  const numEl   = document.getElementById("c03-num");
  if (!section || !title || !numEl) return;

  // 헤더 높이 측정해서 CSS 변수 업데이트 (고정 헤더 대응)
  const header = document.querySelector("header");
  function setHeaderH(){
    if (header) document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }
  setHeaderH();
  window.addEventListener("resize", setHeaderH);

  let played = false; // 한 번만 실행

  function countUp() {
    if (played) return;
    played = true;

    let current = 1;
    const target = 48;
    const speed = 40; // ms (더 빠르게: 20~30)

    // 등장 애니메이션
    title.classList.add("is-in");

    const timer = setInterval(() => {
      numEl.textContent = String(current).padStart(2, "0");
      current++;
      if (current > target) {
        clearInterval(timer);

        // 최종 문자열을 잔상에 복제 후 울림
        title.setAttribute("data-final", title.textContent.trim());
        title.classList.add("ripple");
        title.addEventListener("animationend", () => {
          title.classList.remove("ripple");
        }, { once: true });
      }
    }, speed);
  }

  // 섹션이 "충분히" 보일 때만 시작 (최소 60% 노출)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.6) {
        countUp();
        io.disconnect();
      }
    });
  }, { threshold: [0.0, 0.6, 1.0] });

  io.observe(section);
});
