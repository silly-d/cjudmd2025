document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("content03");
  const title = document.querySelector(".c03-title");
  const numEl = document.getElementById("c03-num");
  if (!section || !title || !numEl) return;

  const header = document.querySelector("header");
  function setHeaderH(){
    if (header) document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }
  setHeaderH();
  window.addEventListener("resize", setHeaderH);

  let played = false;

  function countUp() {
    if (played) return;
    played = true;

    let current = 1;
    const target = 48;
    const speed = 20;

    title.classList.add("is-in");

    const timer = setInterval(() => {
      numEl.textContent = String(current).padStart(2, "0");
      current++;
      if (current > target) {
        clearInterval(timer);
        title.setAttribute("data-final", title.textContent.trim());
        title.classList.add("ripple");
        title.addEventListener("animationend", () => {
          title.classList.remove("ripple");
        }, { once: true });
      }
    }, speed);
  }

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
