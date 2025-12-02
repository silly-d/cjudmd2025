const checkIsMobileLayout = () => window.innerWidth <= 768;

function getPositions() {
  const w = window.innerWidth;

  if (w > 1400) {
    return [
      { top: "0%", left: "0%" },
      { top: "0%", left: "21%" },
      { top: "0%", left: "42%" },
      { top: "0%", left: "63%" },
      { top: "0%", left: "84%" },
      { top: "40%", left: "0%" },
      { top: "40%", left: "21%" },
      { top: "40%", left: "42%" },
      { top: "40%", left: "63%" },
      { top: "40%", left: "84%" },
      { top: "80%", left: "0%" },
      { top: "80%", left: "21%" },
      { top: "80%", left: "42%" },
      { top: "80%", left: "63%" },
      { top: "80%", left: "84%" },
      { top: "120%", left: "0%" },
      { top: "120%", left: "21%" },
      { top: "120%", left: "42%" },
      { top: "120%", left: "63%" },
      { top: "120%", left: "84%" },
      { top: "160%", left: "0%" },
      { top: "160%", left: "21%" },
      { top: "160%", left: "42%" },
      { top: "160%", left: "63%" },
      { top: "160%", left: "84%" },
      { top: "200%", left: "0%" },
      { top: "200%", left: "21%" },
      { top: "200%", left: "42%" },
      { top: "200%", left: "63%" },
      { top: "200%", left: "84%" },
      { top: "240%", left: "0%" },
      { top: "240%", left: "21%" },
      { top: "240%", left: "42%" },
      { top: "240%", left: "63%" },
      { top: "240%", left: "84%" },
      { top: "280%", left: "0%" },
      { top: "280%", left: "21%" },
      { top: "280%", left: "42%" },
      { top: "280%", left: "63%" },
      { top: "280%", left: "84%" },
      { top: "320%", left: "0%" },
      { top: "320%", left: "21%" },
      { top: "320%", left: "42%" },
      { top: "320%", left: "63%" },
      { top: "320%", left: "84%" },
      { top: "360%", left: "21%" },
      { top: "360%", left: "42%" },
      { top: "360%", left: "63%" },
    ];
  } else if (w > 768) {
    return [
      { top: "0%", left: "0%" },
      { top: "0%", left: "21%" },
      { top: "0%", left: "42%" },
      { top: "0%", left: "63%" },
      { top: "0%", left: "84%" },
      { top: "40%", left: "0%" },
      { top: "40%", left: "21%" },
      { top: "40%", left: "42%" },
      { top: "40%", left: "63%" },
      { top: "40%", left: "84%" },
      { top: "80%", left: "0%" },
      { top: "80%", left: "21%" },
      { top: "80%", left: "42%" },
      { top: "80%", left: "63%" },
      { top: "80%", left: "84%" },
      { top: "120%", left: "0%" },
      { top: "120%", left: "21%" },
      { top: "120%", left: "42%" },
      { top: "120%", left: "63%" },
      { top: "120%", left: "84%" },
      { top: "160%", left: "0%" },
      { top: "160%", left: "21%" },
      { top: "160%", left: "42%" },
      { top: "160%", left: "63%" },
      { top: "160%", left: "84%" },
      { top: "200%", left: "0%" },
      { top: "200%", left: "21%" },
      { top: "200%", left: "42%" },
      { top: "200%", left: "63%" },
      { top: "200%", left: "84%" },
      { top: "240%", left: "0%" },
      { top: "240%", left: "21%" },
      { top: "240%", left: "42%" },
      { top: "240%", left: "63%" },
      { top: "240%", left: "84%" },
      { top: "280%", left: "0%" },
      { top: "280%", left: "21%" },
      { top: "280%", left: "42%" },
      { top: "280%", left: "63%" },
      { top: "280%", left: "84%" },
      { top: "320%", left: "0%" },
      { top: "320%", left: "21%" },
      { top: "320%", left: "42%" },
      { top: "320%", left: "63%" },
      { top: "320%", left: "84%" },
      { top: "360%", left: "21%" },
      { top: "360%", left: "42%" },
      { top: "360%", left: "63%" },
    ];
  } else {
    return [];
  }
}

let positions = getPositions();

const imgs = document.querySelectorAll(".profile");
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.zIndex = "900";
overlay.style.display = "none";
overlay.style.cursor = "pointer";
overlay.style.background = "rgba(0,0,0,0)";
document.body.appendChild(overlay);

if (!checkIsMobileLayout()) {
  gsap.set(".profile", {
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0)",
  });

  gsap.from(".text-left", {
    y: 40,
    ease: "power4.inOut",
    duration: 1,
    stagger: { amount: 0.15 },
    delay: 0.5,
  });

  gsap.fromTo(
    ".braket-decoration",
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 0.5,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.7,
    }
  );

  gsap.to(".profile", {
    scale: 1,
    width: () => (window.innerWidth > 900 ? "250px" : "120px"),
    height: () => (window.innerWidth > 900 ? "350px" : "200px"),
    stagger: 0,
    duration: 0.6,
    ease: "power2.out",
    delay: 1,
    onComplete: scatterAndShrink,
  });

  gsap.to(".text-left", {
    opacity: 0,
    ease: "power4.inOut",
    duration: 0.8,
    stagger: { amount: 0.1 },
    delay: 2,
  });

  gsap.to(".braket-decoration", {
    opacity: 0,
    ease: "power4.inOut",
    duration: 0.8,
    delay: 2,
    onComplete: () => {
      const landingText = document.querySelector(".landing-text");
      if (landingText) landingText.remove();
    },
  });
} else {
  const landingText = document.querySelector(".landing-text");
  if (landingText) {
    landingText.remove();
  }

  imgs.forEach((img) => {
    gsap.set(img, { clearProps: "all" });
  });
}

function adjustSectionHeightFromPositions() {
  if (checkIsMobileLayout()) return;

  const wrapper = document.querySelector(".profile-gallery-wrapper");
  if (!wrapper || !positions.length) return;
  const maxTopPercent = Math.max(...positions.map((p) => parseFloat(p.top) || 0));
  const extraVhPadding = 15;
  wrapper.style.minHeight = `${maxTopPercent + extraVhPadding}vh`;
}

function scatterAndShrink() {
  if (checkIsMobileLayout()) return;

  gsap.to(".profile", {
    top: (i) => positions[i].top,
    left: (i) => positions[i].left,
    transform: "none",
    width: () => (window.innerWidth > 900 ? "220px" : "160px"),
    height: () => (window.innerWidth > 900 ? "350px" : "240px"),
    stagger: 0,
    duration: 1,
    ease: "power2.inOut",
    onComplete: () => {
      document.querySelector(".content01").classList.add("slide-down");

      setTimeout(() => {
        parenLeft.classList.add("visible");
        parenRight.classList.add("visible");

        setTimeout(() => {
          const rect = titleWrapper.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          const gap = 20;

          parenLeft.style.top = centerY + "px";
          parenLeft.style.left = rect.left - parenLeft.offsetWidth - gap + "px";
          parenRight.style.top = centerY + "px";
          parenRight.style.left = rect.right + gap + "px";

          parenLeft.classList.add("fixed");
          parenRight.classList.add("fixed");
          document.body.appendChild(parenLeft);
          document.body.appendChild(parenRight);

          parensVisible = true;
        }, 1000);
      }, 100);

      document.querySelector(".designer-profile").classList.add("positioned");
      adjustSectionHeightFromPositions();

      window.lenis?.resize();

      setTimeout(() => {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        window.lenis?.resize();
      }, 1200);
    },
  });
}

overlay.addEventListener("click", () => {
  const enlarged = document.querySelector('.profile[data-enlarged="true"]');
  if (enlarged) enlarged.click();
});

imgs.forEach((img, i) => {
  if (!checkIsMobileLayout() && positions[i]) {
    img.setAttribute("data-original-position", JSON.stringify(positions[i]));
    img.setAttribute("data-enlarged", "false");
  }
});

window.addEventListener("load", () => {
  if (!checkIsMobileLayout()) {
    adjustSectionHeightFromPositions();
  }
});

window.addEventListener("resize", () => {
  const wasMobile = positions.length === 0;
  positions = getPositions();
  const isNowMobile = positions.length === 0;

  if (wasMobile !== isNowMobile) {
    location.reload();
    return;
  }

  if (!checkIsMobileLayout()) {
    adjustSectionHeightFromPositions();
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }
});

function getKoreanInitial(name) {
  const initials = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const firstChar = name.charAt(0);
  const code = firstChar.charCodeAt(0) - 44032;
  if (code < 0 || code > 11171) return "";
  return initials[Math.floor(code / 588)];
}

document.querySelectorAll(".profile").forEach((profile) => {
  const name = profile.querySelector("p").textContent;
  const initial = getKoreanInitial(name);
  profile.setAttribute("data-initial", initial);
});

const sortButtons = document.querySelectorAll(".sort-btn");
const availableInitials = new Set();

document.querySelectorAll(".profile").forEach((profile) => {
  const initial = profile.getAttribute("data-initial");
  if (initial) availableInitials.add(initial);
});

sortButtons.forEach((btn) => {
  const initial = btn.getAttribute("data-initial");
  if (initial !== "all" && !availableInitials.has(initial)) {
    btn.classList.add("disabled");
  }

  btn.addEventListener("click", () => {
    const selectedInitial = btn.getAttribute("data-initial");
    const gallery = document.querySelector(".profile-gallery");
    const wrapper = document.querySelector(".profile-gallery-wrapper");
    const allProfiles = document.querySelectorAll(".profile");

    sortButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    gsap.to(allProfiles, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        if (selectedInitial === "all") {
          allProfiles.forEach((profile, i) => {
            const parentLink = profile.closest("a");
            parentLink.style.display = "block";
          });

          gallery.classList.remove("filtered");
          wrapper.classList.remove("filtered-small");
          wrapper.style.minHeight = "";
          adjustSectionHeightFromPositions();

          allProfiles.forEach((profile, i) => {
            if (!checkIsMobileLayout() && positions[i]) {
              gsap.set(profile, {
                position: "absolute",
                top: positions[i].top,
                left: positions[i].left,
                scale: 0.8,
                opacity: 0,
              });
            } else {
              gsap.set(profile, {
                scale: 0.8,
                opacity: 0,
              });
            }
          });

          gsap.to(allProfiles, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.02,
            ease: "power2.out",
          });
        } else {
          let visibleCount = 0;
          const visibleProfiles = [];

          allProfiles.forEach((profile) => {
            const profileInitial = profile.getAttribute("data-initial");
            const parentLink = profile.closest("a");

            if (profileInitial === selectedInitial) {
              parentLink.style.display = "block";
              visibleProfiles.push(profile);
              visibleCount++;
            } else {
              parentLink.style.display = "none";
            }
          });

          const itemsPerRow = window.innerWidth > 1400 ? 5 : window.innerWidth > 768 ? 5 : 2;
          const rows = Math.ceil(visibleCount / itemsPerRow);
          const cardHeight = window.innerWidth > 900 ? 350 : window.innerWidth > 768 ? 240 : 170;
          const gap = window.innerWidth > 768 ? 40 : 30;

          if (window.innerWidth > 768) {
            if (rows < 2) {
              wrapper.classList.add("filtered-small");
              wrapper.style.minHeight = "auto";
            } else {
              wrapper.classList.remove("filtered-small");
              const totalHeight = rows * cardHeight + (rows - 1) * gap + 50;
              wrapper.style.minHeight = `${totalHeight}px`;
            }
          } else {
            wrapper.style.minHeight = "auto";
          }

          gallery.classList.add("filtered");

          gsap.set(visibleProfiles, {
            clearProps: "position, top, left, transform",
          });

          gsap.set(visibleProfiles, {
            opacity: 0,
            scale: 0.8,
          });

          gsap.to(visibleProfiles, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.03,
            ease: "power2.out",
            delay: 0.1,
            overwrite: true,
          });
        }
      },
    });
  });
});

const parenLeft = document.createElement("span");
parenLeft.className = "designer-paren designer-paren--left";
const parenRight = document.createElement("span");
parenRight.className = "designer-paren designer-paren--right";

const titleWrapper = document.querySelector(".designer-title-wrapper");
if (titleWrapper) {
  titleWrapper.appendChild(parenLeft);
  titleWrapper.appendChild(parenRight);
} else {
  document.body.appendChild(parenLeft);
  document.body.appendChild(parenRight);
}

let parensVisible = false;

function setParenPositions() {
  if (!titleWrapper) return;
  const rect = titleWrapper.getBoundingClientRect();
  const gap = 20;

  parenLeft.style.left = -parenLeft.offsetWidth - gap + "px";
  parenLeft.style.top = "50%";

  parenRight.style.left = rect.width + gap + "px";
  parenRight.style.top = "50%";
}

setParenPositions();

function moveParensToTitle() {
  if (!titleWrapper) return;

  if (parenLeft.parentElement !== document.body) {
    document.body.appendChild(parenLeft);
    document.body.appendChild(parenRight);
  }

  const rect = titleWrapper.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;
  const gap = 20;

  parenLeft.style.top = centerY + "px";
  parenLeft.style.left = rect.left - parenLeft.offsetWidth - gap + "px";

  parenRight.style.top = centerY + "px";
  parenRight.style.left = rect.right + gap + "px";

  parenLeft.classList.remove("heavy");
  parenRight.classList.remove("heavy");
}

function moveParensToProfile(profile) {
  if (parenLeft.parentElement !== document.body) {
    document.body.appendChild(parenLeft);
    document.body.appendChild(parenRight);
  }

  const rect = profile.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;
  const gap = 20;

  parenLeft.style.top = centerY + "px";
  parenLeft.style.left = rect.left - parenLeft.offsetWidth - gap + "px";

  parenRight.style.top = centerY + "px";
  parenRight.style.left = rect.right + gap + "px";

  parenLeft.classList.add("heavy");
  parenRight.classList.add("heavy");
}

document.querySelectorAll(".profile").forEach((profile) => {
  profile.addEventListener("mouseenter", () => {
    if (parensVisible) {
      moveParensToProfile(profile);
    }
  });
});

const profileGallery = document.querySelector(".profile-gallery");
if (profileGallery) {
  profileGallery.addEventListener("mouseleave", () => {
    if (parensVisible) {
      moveParensToTitle();
    }
  });
}

function handleScrollForParens() {
  if (!parensVisible) return;
  const hoveredProfile = document.querySelector(".profile:hover");
  if (hoveredProfile) {
    moveParensToProfile(hoveredProfile);
  } else {
    moveParensToTitle();
  }
}

window.addEventListener("scroll", handleScrollForParens);

if (window.lenis) {
  window.lenis.on("scroll", handleScrollForParens);
}

window.addEventListener("resize", () => {
  handleScrollForParens();
});

const designerMap = {};

document.querySelectorAll(".profile-gallery a").forEach((link) => {
  const profile = link.querySelector(".profile");
  const name = profile.querySelector("p").textContent.trim().replace(/\s+/g, "");
  designerMap[name] = { link, profile };
});

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-form input");

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchName = searchInput.value.trim().replace(/\s+/g, "");

    if (!searchName) return;

    const result = designerMap[searchName];

    if (result) {
      const profile = result.profile;

      const rect = profile.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - window.innerHeight / 2 + rect.height / 2;

      if (window.lenis && !checkIsMobileLayout()) {
        window.lenis.scrollTo(targetY, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }

      profile.classList.add("highlighted");

      searchInput.value = "";
      searchInput.blur();

      setTimeout(() => {
        profile.classList.remove("highlighted");
      }, 2500);
    } else {
      alert(`'${searchInput.value}' 디자이너를 찾을 수 없습니다.`);
    }
  });
}
