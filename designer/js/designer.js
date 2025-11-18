const isMobile = () => window.innerWidth <= 768;

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

positions = getPositions();

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

if (!isMobile()) {
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
    onComplete: () => document.querySelector(".landing-text").remove(),
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
  if (isMobile()) return;

  const wrapper = document.querySelector(".profile-gallery-wrapper");
  if (!wrapper || !positions.length) return;
  const maxTopPercent = Math.max(...positions.map((p) => parseFloat(p.top) || 0));
  const extraVhPadding = 15;
  wrapper.style.minHeight = `${maxTopPercent + extraVhPadding}vh`;
}

function scatterAndShrink() {
  if (isMobile()) return;

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
      document.querySelector(".designer-profile").classList.add("positioned");

      adjustSectionHeightFromPositions();
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1200);
    },
  });
}

overlay.addEventListener("click", () => {
  const enlarged = document.querySelector('.profile[data-enlarged="true"]');
  if (enlarged) enlarged.click();
});

imgs.forEach((img, i) => {
  if (!isMobile() && positions[i]) {
    img.setAttribute("data-original-position", JSON.stringify(positions[i]));
    img.setAttribute("data-enlarged", "false");
  }
});

window.addEventListener("load", () => {
  if (!isMobile()) {
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

  if (!isMobile()) {
    scatterAndShrink();
    adjustSectionHeightFromPositions();
    ScrollTrigger.refresh();
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
            if (!isMobile() && positions[i]) {
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
