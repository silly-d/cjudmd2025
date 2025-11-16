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

const header = document.querySelector("header");
const headerHeight = header.offsetHeight;

let lastScrollTop = 0;

window.addEventListener(
  "scroll",
  function () {
    let currentScrollTop = window.scrollY || this.document.documentElement.scrollTop;

    if (currentScrollTop > headerHeight) {
      if (currentScrollTop > lastScrollTop) {
        header.classList.add("header-hidden");
      } else {
        header.classList.remove("header-hidden");
      }
    } else {
      header.classList.remove("header-hidden");
    }
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  },
  false
);
