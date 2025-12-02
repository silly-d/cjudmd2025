document.addEventListener("DOMContentLoaded", () => {
  // 1. 공통 설정 (GSAP 플러그인 등록 등)
  gsap.registerPlugin(ScrollTrigger);

  // 2. 초기 로드 애니메이션 (Fade In)
  initPageTransition();

  // 3. 각 섹션별 기능 초기화
  initHeroSection(); // Content 01
  initPosterSection(); // Content 02
  initCounterSection(); // Content 03
  initTeamSection(); // Content 04
  initProfessorSection(); // Content 05
  initYoutubeSection(); // Content 06
});

// ============================================
// 0. Page Transition (Fade In)
// ============================================
function initPageTransition() {
  const fromIndex = sessionStorage.getItem("fromIndex");

  if (fromIndex === "true") {
    gsap.set("body", { opacity: 0 });
    gsap.to("body", {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut",
    });
    sessionStorage.removeItem("fromIndex");
  } else {
    gsap.set("body", { opacity: 1 });
  }
}

// ============================================
// 1. CONTENT 01: Hero Photo Slideshow
// ============================================
function initHeroSection() {
  const slot = document.getElementById("c01-photo");
  if (!slot) return;

  const IMAGES = [
    "../img/hero/01.png",
    "../img/hero/02.png",
    "../img/hero/03.png",
    "../img/hero/04.png",
    "../img/hero/05.png",
    "../img/hero/06.png",
  ];

  let i = 0;
  slot.style.backgroundImage = `url('${IMAGES[i]}')`;

  setInterval(() => {
    i = (i + 1) % IMAGES.length;
    slot.style.backgroundImage = `url('${IMAGES[i]}')`;
  }, 200);

  // 텍스트 애니메이션
  const textAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".content01",
      start: "top top",
      end: "+=500",
      scrub: 1,
    },
  });

  textAnimation.to(".field", { yPercent: 0, opacity: 0 }, 0);
}

// ============================================
// 2. CONTENT 02: Poster Download & Animation
// ============================================
function initPosterSection() {
  // 다운로드 기능
  const btn = document.getElementById("c02-download");
  if (btn) {
    const POSTER_FILE = "./img/5th-poster.png";
    btn.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = POSTER_FILE;
      a.download = "gongmyeong-poster.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  // GSAP 애니메이션
  const poster = document.querySelector(".c02-poster");
  const title = document.querySelector(".c02-title");
  const body = document.querySelector(".c02-body");
  const body2 = document.querySelector(".c02-body2");
  const downloadBtn = document.querySelector(".c02-btn");

  if (!poster || !title) return;

  gsap.set([poster, title, body, body2, downloadBtn], {
    y: 90,
    opacity: 0,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#content02",
      start: "top 50%",
      end: "top 30%",
      toggleActions: "play none none reverse",
    },
  });

  tl.to(poster, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" })
    .to(title, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 0.3)
    .to(body, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 0.45)
    .to(body2, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 0.6)
    .to(downloadBtn, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 0.75);
}

// ============================================
// 3. CONTENT 03: Number Count-up Animation
// ============================================
function initCounterSection() {
  const section = document.getElementById("content03");
  const title = document.querySelector(".c03-title");
  const numEl = document.getElementById("c03-num");
  if (!section || !title || !numEl) return;

  // 헤더 높이 계산 (CSS 변수 세팅)
  const header = document.querySelector("header");
  function setHeaderH() {
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
        title.addEventListener("animationend", () => title.classList.remove("ripple"), { once: true });
      }
    }, speed);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          countUp();
          io.disconnect();
        }
      });
    },
    { threshold: [0.0, 0.6, 1.0] }
  );

  io.observe(section);
}

// ============================================
// 4. CONTENT 04: Team Members Navigation
// ============================================
function initTeamSection() {
  const nav = document.getElementById("c04-nav");
  const left = nav?.closest(".c04-left");
  const track = document.getElementById("c04-center");
  const ofEl = document.getElementById("c04-of");
  const list = document.getElementById("c04-members");

  if (!nav || !left || !track || !ofEl || !list) return;

  if (!ofEl.dataset.inited) {
    ofEl.innerHTML = `<span class="c04-of-eui">의</span><span class="c04-of-gong">공명</span>`;
    ofEl.dataset.inited = "1";
  }

  // 데이터 정의
  const DATA = {
    디피부: [
      { name: "유은비", img: "../img/miniprofile/miniprofile03.png" },
      { name: "임희원", img: "../img/miniprofile/miniprofile04.png" },
      { name: "김보미", img: "../img/miniprofile/miniprofile05.png" },
      { name: "김현진", img: "../img/miniprofile/miniprofile06.png" },
      { name: "박서희", img: "../img/miniprofile/miniprofile07.png" },
      { name: "백진주", img: "../img/miniprofile/miniprofile08.png" },
      { name: "윤정원", img: "../img/miniprofile/miniprofile09.png" },
      { name: "이연우", img: "../img/miniprofile/miniprofile10.png" },
      { name: "조범규", img: "../img/miniprofile/miniprofile11.png" },
      { name: "최서윤", img: "../img/miniprofile/miniprofile12.png" },
    ],
    기획부: [
      { name: "김도희", img: "../img/miniprofile/miniprofile13.png" },
      { name: "반상우", img: "../img/miniprofile/miniprofile14.png" },
      { name: "김윤주", img: "../img/miniprofile/miniprofile15.png" },
      { name: "김현지", img: "../img/miniprofile/miniprofile16.png" },
      { name: "박순후", img: "../img/miniprofile/miniprofile17.png" },
      { name: "손예진", img: "../img/miniprofile/miniprofile18.png" },
      { name: "이현서", img: "../img/miniprofile/miniprofile19.png" },
    ],
    편집부: [
      { name: "정유민", img: "../img/miniprofile/miniprofile20.png" },
      { name: "박미소", img: "../img/miniprofile/miniprofile21.png" },
      { name: "고현희", img: "../img/miniprofile/miniprofile22.png" },
      { name: "박기연", img: "../img/miniprofile/miniprofile23.png" },
      { name: "왕뢰이저", img: "../img/miniprofile/miniprofile24.png" },
      { name: "이새연", img: "../img/miniprofile/miniprofile24.png" },
      { name: "이채민", img: "../img/miniprofile/miniprofile25.png" },
      { name: "황서진", img: "../img/miniprofile/miniprofile26.png" },
    ],
    멀티부: [
      { name: "권용우", img: "../img/miniprofile/miniprofile27.png" },
      { name: "조서영", img: "../img/miniprofile/miniprofile28.png" },
      { name: "김선정", img: "../img/miniprofile/miniprofile29.png" },
      { name: "김지수", img: "../img/miniprofile/miniprofile30.png" },
      { name: "곽초은", img: "../img/miniprofile/miniprofile31.png" },
      { name: "오효진", img: "../img/miniprofile/miniprofile32.png" },
      { name: "황지원", img: "../img/miniprofile/miniprofile33.png" },
    ],
    홍보부: [
      { name: "최희선", img: "../img/miniprofile/miniprofile34.png" },
      { name: "오우진", img: "../img/miniprofile/miniprofile35.png" },
      { name: "김루나", img: "../img/miniprofile/miniprofile36.png" },
      { name: "박지수", img: "../img/miniprofile/miniprofile37.png" },
      { name: "양윤보", img: "../img/miniprofile/miniprofile38.png" },
      { name: "이주연", img: "../img/miniprofile/miniprofile39.png" },
      { name: "정예원", img: "../img/miniprofile/miniprofile40.png" },
    ],
    포스터부: [
      { name: "서동현", img: "../img/miniprofile/miniprofile41.png" },
      { name: "강유림", img: "../img/miniprofile/miniprofile42.png" },
      { name: "김민정", img: "../img/miniprofile/miniprofile43.png" },
      { name: "나원호", img: "../img/miniprofile/miniprofile44.png" },
      { name: "노채린", img: "../img/miniprofile/miniprofile45.png" },
      { name: "이소현", img: "../img/miniprofile/miniprofile46.png" },
      { name: "이채현", img: "../img/miniprofile/miniprofile47.png" },
    ],
  };

  const pL = document.createElement("span");
  pL.className = "c04-paren c04-paren--left";
  const pR = document.createElement("span");
  pR.className = "c04-paren c04-paren--right";
  left.appendChild(pL);
  left.appendChild(pR);

  function syncTrackHeight() {
    const h = nav.offsetHeight;
    track.style.height = h + "px";
    const pad = ofEl.offsetHeight ? ofEl.offsetHeight / 2 : 0;
    track.style.paddingTop = pad + "px";
    track.style.paddingBottom = pad + "px";
  }

  function moveAll(btn) {
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--c04-paren-gap")) || 10;
    const leftRect = left.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();

    const centerY = btnRect.top + window.scrollY + btnRect.height / 2;
    const topInLeft = centerY - (leftRect.top + window.scrollY);
    pL.style.top = topInLeft + "px";
    pR.style.top = topInLeft + "px";

    const centerXInLeft = btnRect.left - leftRect.left + btnRect.width / 2;
    const halfW = btnRect.width / 2;
    pL.style.left = centerXInLeft - halfW - pL.offsetWidth - gap + "px";
    pR.style.left = centerXInLeft + halfW + gap + "px";

    const topInTrack = centerY - (trackRect.top + window.scrollY) - ofEl.offsetHeight / 2;
    const pad = ofEl.getBoundingClientRect().height / 2;
    const maxY = track.clientHeight - ofEl.offsetHeight + pad;
    const clamped = Math.max(-pad, Math.min(topInTrack, maxY));
    ofEl.style.transform = `translateY(${clamped}px)`;
  }

  function renderMembers(arr) {
    list.innerHTML = "";
    arr.forEach((member, i) => {
      const li = document.createElement("li");
      li.textContent = member.name;
      const preview = document.createElement("div");
      preview.className = "c04-preview";
      preview.style.backgroundImage = `url('${member.img}')`;
      li.appendChild(preview);
      list.appendChild(li);
      setTimeout(() => li.classList.add("show"), i * 60);
    });
  }

  function init() {
    syncTrackHeight();
    const first = nav.querySelector("button.is-active") || nav.querySelector("button");
    if (first) {
      renderMembers(DATA[first.dataset.key] || []);
      requestAnimationFrame(() => moveAll(first));
    }
  }

  init();

  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-key]");
    if (!btn) return;
    nav.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    moveAll(btn);
    renderMembers(DATA[btn.dataset.key] || []);
  });

  nav.addEventListener("mouseover", (e) => {
    const btn = e.target.closest("button[data-key]");
    if (!btn) return;
    moveAll(btn);
  });

  nav.addEventListener("mouseout", () => {
    const active = nav.querySelector("button.is-active");
    if (active) moveAll(active);
  });

  window.addEventListener("resize", () => {
    syncTrackHeight();
    const active = nav.querySelector("button.is-active");
    if (active) requestAnimationFrame(() => moveAll(active));
  });
}

// ============================================
// 5. CONTENT 05: Professor Cards Stack
// ============================================
function initProfessorSection() {
  const flowContainer = document.querySelector(".ct05-flow-container");
  const cards = gsap.utils.toArray(".flow-area");

  if (!flowContainer || cards.length === 0) return;

  const isMobile = () => window.innerWidth <= 768;

  function setupScrollAnimation() {
    // 기존 트리거 제거 (리사이즈 대응)
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === ".content05") {
        trigger.kill();
      }
    });

    cards.forEach((card, index) => {
      gsap.set(card, { transformOrigin: "center top" });
      if (index === 0) {
        gsap.set(card, { y: 0, scale: 1 });
      } else {
        gsap.set(card, { y: "100vh", scale: 1 });
      }
    });

    const scrollDistance = isMobile() ? 400 : 500;
    const startOffset = isMobile() ? "top-=100 top" : "-=150";

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".content05",
        start: startOffset,
        end: () => `+=${(cards.length - 1) * scrollDistance}`,
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        const nextIndex = index + 1;
        scrollTl.to(
          cards.slice(0, index + 1),
          {
            scale: "-=0.05",
            y: "-=20",
            duration: 1,
            ease: "none",
          },
          index
        );

        scrollTl.fromTo(
          cards[nextIndex],
          { y: "100svh", scale: 1 },
          {
            y: 0,
            filter: `brightness(${1 - (index + 1) * 0.05})`,
            scale: 1,
            duration: 1,
            ease: "none",
          },
          index
        );
      }
    });
  }

  setupScrollAnimation();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupScrollAnimation();
      ScrollTrigger.refresh();
    }, 250);
  });
}

// ============================================
// 6. CONTENT 06: YouTube Video Carousel
// ============================================
function initYoutubeSection() {
  const swiperEl = document.querySelector(".swiper-container");
  if (!swiperEl) return;

  const swiper = new Swiper(".swiper-container", {
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    slidesPerView: 1,
    spaceBetween: 200,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    allowTouchMove: true,
    on: {
      reachEnd: function () {
        setTimeout(() => {
          swiper.slideTo(0);
        }, 2000);
      },
    },
  });

  // HTML에 id="next02", "prev02" 버튼이 없으므로 해당 이벤트 리스너 제거함.
  /*
  const nextBtn = document.getElementById("next02");
  const prevBtn = document.getElementById("prev02");
  if(nextBtn) nextBtn.addEventListener("click", (e) => e.preventDefault());
  if(prevBtn) prevBtn.addEventListener("click", (e) => e.preventDefault());
  */
}
