window.lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  autoResize: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

if (typeof ScrollTrigger !== "undefined") {
  lenis.on("scroll", ScrollTrigger.update);
}

const header = document.querySelector("header");
const headerHeight = header.offsetHeight;
let lastScrollTop = 0;

window.addEventListener("scroll", function () {
  let currentScrollTop = window.scrollY || document.documentElement.scrollTop;

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
});

const menuToggle = document.getElementById("menu-toggle");

if (menuToggle) {
  menuToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      window.lenis.stop();
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      window.lenis.start();
    }
  });
}

const setScreenSize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

setScreenSize();

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth !== document.documentElement.clientWidth) {
      setScreenSize();
      window.lenis.resize();
    }
  }, 100);
});
