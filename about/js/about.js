document.addEventListener("DOMContentLoaded", () => {
  // 1. 공통 설정 (GSAP 플러그인 등록 등)
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.config({
    ignoreMobileResize: true,
  });

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
  // 1. 다운로드 버튼 기능 (기존 유지)
  const btn = document.getElementById("c02-download");
  if (btn) {
    const POSTER_FILE = "./img/5th-poster.jpg";
    btn.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = POSTER_FILE;
      a.download = "dmd-5th-poster.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  // 2. 요소 선택
  const poster = document.querySelector(".c02-poster");
  const title = document.querySelector(".c02-title");
  const body = document.querySelector(".c02-body");
  const body2 = document.querySelector(".c02-body2");
  const downloadBtn = document.querySelector(".c02-btn");

  if (!poster || !title) return;

  // 애니메이션 대상들을 배열로 묶어두면 편합니다
  const aniTargets = [poster, title, body, body2, downloadBtn];

  // 3. GSAP Media Query 설정
  let mm = gsap.matchMedia();

  // ------------------------------------------------
  // (A) PC 화면 (800px 이상) - 기존의 디테일한 시퀀스 유지
  // ------------------------------------------------
  mm.add("(max-width: 60000px)", () => {
    // 초기 상태 설정
    gsap.set(aniTargets, { y: 90, opacity: 0 });

    // ★ 중요: 타임라인을 반드시 이 안에서 생성해야 합니다.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#content02",
        start: "top 50%", // 화면 절반쯤 오면 시작
        end: "top 30%",
        toggleActions: "play none none reverse",
      },
    });

    // 순차적 등장 애니메이션
    tl.to(poster, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" })
      .to(title, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 0.3)
      .to(body, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 0.45)
      .to(body2, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 0.6)
      .to(downloadBtn, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 0.75);
  });
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

  const bgElement = document.getElementById("c04-bg");

  const DEPT_IMAGES = {
    디피부: "./img/01.jpg",
    기획부: "./img/02.jpg",
    편집부: "./img/03.jpg",
    멀티부: "./img/04.jpg",
    홍보부: "./img/05.jpg",
    포스터부: "./img/06.jpg",
  };

  if (!nav || !left || !track || !ofEl || !list) return;

  if (!ofEl.dataset.inited) {
    ofEl.innerHTML = `<span class="c04-of-eui">의</span><span class="c04-of-gong">공명</span>`;
    ofEl.dataset.inited = "1";
  }

  const DATA = {
    디피부: [
      { name: "유은비", url: "../designer/designer30.html", img: "../designer/img/30.png" },
      { name: "임희원", url: "../designer/designer39.html", img: "../designer/img/39.png" },
      { name: "김보미", url: "../designer/designer8.html", img: "../designer/img/8.png" },
      { name: "김현진", url: "../designer/designer13.html", img: "../designer/img/13.png" },
      { name: "박서희", url: "../designer/designer19.html", img: "../designer/img/19.png" },
      { name: "백진주", url: "../designer/designer23.html", img: "../designer/img/23.png" },
      { name: "윤정원", url: "../designer/designer31.html", img: "../designer/img/31.png" },
      { name: "이연우", url: "../designer/designer34.html", img: "../designer/img/34.png" },
      { name: "조범규", url: "../designer/designer42.html", img: "../designer/img/42.png" },
      { name: "최서윤", url: "../designer/designer45.html", img: "../designer/img/45.png" },
    ],
    기획부: [
      { name: "김도희", url: "../designer/designer5.html", img: "../designer/img/5.png" },
      { name: "반상우", url: "../designer/designer22.html", img: "../designer/img/22.png" },
      { name: "김윤주", url: "../designer/designer10.html", img: "../designer/img/10.png" },
      { name: "김현지", url: "../designer/designer12.html", img: "../designer/img/12.png" },
      { name: "박순후", url: "../designer/designer20.html", img: "../designer/img/20.png" },
      { name: "손예진", url: "../designer/designer25.html", img: "../designer/img/25.png" },
      { name: "이현서", url: "../designer/designer38.html", img: "../designer/img/38.png" },
    ],
    편집부: [
      { name: "정유민", url: "../designer/designer41.html", img: "../designer/img/41.png" },
      { name: "박미소", url: "../designer/designer18.html", img: "../designer/img/18.png" },
      { name: "고현희", url: "../designer/designer2.html", img: "../designer/img/2.png" },
      { name: "박기연", url: "../designer/designer17.html", img: "../designer/img/17.png" },
      { name: "왕뢰이저", url: "../project/project29.html", img: "../designer/img/29.png" },
      { name: "이새연", url: "../designer/designer32.html", img: "../designer/img/32.png" },
      { name: "이채민", url: "../designer/designer36.html", img: "../designer/img/36.png" },
      { name: "황서진", url: "../designer/designer47.html", img: "../designer/img/47.png" },
    ],
    멀티부: [
      { name: "권용우", url: "../designer/designer4.html", img: "../designer/img/4.png" },
      { name: "조서영", url: "../designer/designer43.html", img: "../designer/img/43.png" },
      { name: "김선정", url: "../designer/designer9.html", img: "../designer/img/9.png" },
      { name: "김지수", url: "../designer/designer11.html", img: "../designer/img/11.png" },
      { name: "곽초은", url: "../designer/designer3.html", img: "../designer/img/3.png" },
      { name: "오효진", url: "../designer/designer.html", img: "../designer/img/28.png" },
      { name: "황지원", url: "../designer/designer.html", img: "../designer/img/48.png" },
    ],
    홍보부: [
      { name: "최희선", url: "../designer/designer46.html", img: "../designer/img/46.png" },
      { name: "오우진", url: "../designer/designer27.html", img: "../designer/img/27.png" },
      { name: "김루나", url: "../designer/designer6.html", img: "../designer/img/6.png" },
      { name: "박지수", url: "../designer/designer21.html", img: "../designer/img/21.png" },
      { name: "양윤보", url: "../designer/designer26.html", img: "../designer/img/26.png" },
      { name: "이주연", url: "../designer/designer35.html", img: "../designer/img/35.png" },
      { name: "정예원", url: "../designer/designer40.html", img: "../designer/img/40.png" },
    ],
    포스터부: [
      { name: "서동현", url: "../designer/designer24.html", img: "../designer/img/24.png" },
      { name: "강유림", url: "../designer/designer1.html", img: "../designer/img/1.png" },
      { name: "김민정", url: "../designer/designer7.html", img: "../designer/img/7.png" },
      { name: "나원호", url: "../designer/designer14.html", img: "../designer/img/14.png" },
      { name: "노채린", url: "../designer/designer15.html", img: "../designer/img/15.png" },
      { name: "이소현", url: "../designer/designer33.html", img: "../designer/img/33.png" },
      { name: "이채현", url: "../designer/designer37.html", img: "../designer/img/37.png" },
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

  const previewBox = document.getElementById("member-preview");

  function initParallax() {
    if (!bgElement) return;

    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      bgElement.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    });
  }

  function renderMembers(key) {
    const members = DATA[key] || [];
    const deptBg = DEPT_IMAGES[key];

    list.innerHTML = "";

    if (bgElement) {
      if (deptBg) {
        bgElement.style.backgroundImage = `url('${deptBg}')`;
      } else {
        bgElement.style.backgroundImage = "none";
      }
    }

    if (previewBox) {
      previewBox.classList.remove("active");
      previewBox.style.backgroundImage = "";
    }

    members.forEach((member, i) => {
      const li = document.createElement("li");
      li.textContent = member.name;

      li.addEventListener("mouseenter", () => {
        if (previewBox) {
          previewBox.style.backgroundImage = `url('${member.img}')`;
          previewBox.classList.add("active");
        }
      });

      li.addEventListener("click", () => {
        if (member.url) {
          window.location.href = member.url;
        } else {
          alert("준비 중인 페이지입니다.");
        }
      });

      li.addEventListener("mouseleave", () => {
        if (previewBox) {
          previewBox.classList.remove("active");
        }
      });

      list.appendChild(li);
      requestAnimationFrame(() => li.classList.add("show"));
    });
  }

  function init() {
    syncTrackHeight();
    const first = nav.querySelector("button.is-active") || nav.querySelector("button");
    if (first) {
      renderMembers(first.dataset.key);
      requestAnimationFrame(() => moveAll(first));
    }
    initParallax();
  }

  init();

  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-key]");
    if (!btn) return;
    nav.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    moveAll(btn);

    renderMembers(btn.dataset.key);
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

document.querySelectorAll(".commitee-accordion").forEach((accordion) => {
  accordion.addEventListener("toggle", function () {
    if (this.open) {
      const list = this.querySelector(".commitee-list");
      const height = list.scrollHeight;
      list.style.maxHeight = height + "px";
    }
  });
});

// ============================================
// 5. CONTENT 05: Professor Cards Stack
// ============================================
function initProfessorSection() {
  const flowContainer = document.querySelector(".ct05-flow-container");
  const cards = gsap.utils.toArray(".flow-area");

  if (!flowContainer || cards.length === 0) return;

  // GSAP 미디어 쿼리 생성
  let mm = gsap.matchMedia();

  // [PC 전용] 769px 이상일 때만 애니메이션 실행
  mm.add("(min-width: 769px)", () => {
    // 1. 초기 상태 설정
    cards.forEach((card, index) => {
      gsap.set(card, { transformOrigin: "center top" });
      if (index === 0) {
        gsap.set(card, { y: 0, scale: 1 });
      } else {
        gsap.set(card, { y: "100vh", scale: 1 });
      }
    });

    const scrollDistance = 500;

    // 2. 타임라인 및 스크롤 트리거 설정
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".content05",
        start: "-=150",
        end: () => `+=${(cards.length - 1) * scrollDistance}`,
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        // invalidateOnRefresh: true // 리사이즈 시 값 재계산 (필요 시 주석 해제)
      },
    });

    // 3. 카드 모션 정의
    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        const nextIndex = index + 1;

        // 현재 카드는 뒤로 가면서 작아짐
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

        // 다음 카드는 아래에서 올라옴
        scrollTl.fromTo(
          cards[nextIndex],
          { y: "100vh", scale: 1 }, // svh 대신 vh 써도 무방 (핀 고정이라)
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

    // return () => {
    //   // cleanup function (matchMedia가 알아서 처리하므로 보통은 비워도 됨)
    // };
  });

  // [모바일 전용] 768px 이하일 때 (선택 사항)
  // 애니메이션 없이 그냥 세로로 나열되길 원하시면 이 블록은 비워두셔도 됩니다.
  // GSAP이 PC용 스타일을 싹 걷어내므로 CSS 레이아웃대로 나옵니다.
}
// ============================================
// 6. CONTENT 06: YouTube Video Carousel
// ============================================

function initYoutubeSection() {
  const swiperEl = document.querySelector(".swiper-container");
  if (!swiperEl) return;

  // 1. Swiper 초기화
  const swiper = new Swiper(".swiper-container", {
    // [중요] Iframe 클릭 간섭 방지 설정
    touchStartPreventDefault: false,
    preventClicks: false,
    preventClicksPropagation: false,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },

    // [수정] 양쪽 슬라이드가 보이도록 설정
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 150,
    loop: true,
    loopedSlides: 3,

    // 괄호 버튼 연결
    navigation: {
      nextEl: ".ct06-braket-left",
      prevEl: ".ct06-braket-right",
    },

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 1,
    },
    allowTouchMove: true,
  });

  // 2. YouTube API 스크립트 로드
  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // 3. YouTube API 준비 시 실행
  window.onYouTubeIframeAPIReady = function () {
    const slides = document.querySelectorAll(".swiper-slide iframe");

    slides.forEach((iframe, index) => {
      // 3-1. enablejsapi=1 파라미터 강제 주입
      let src = iframe.getAttribute("src");
      if (src) {
        if (src.indexOf("enablejsapi=1") === -1) {
          src += (src.indexOf("?") === -1 ? "?" : "&") + "enablejsapi=1";
          iframe.setAttribute("src", src);
        }
      }

      // 3-2. 고유 ID 부여 (API 연결용)
      // Swiper loop: true일 경우 복제된 슬라이드 때문에 ID 중복이 발생할 수 있으므로
      // 랜덤 문자열이나 index를 조합해 안전하게 ID 생성
      const currentId = iframe.getAttribute("id");
      const iframeId = currentId || "yt-player-" + index + "-" + Math.floor(Math.random() * 10000);
      iframe.setAttribute("id", iframeId);

      // 3-3. 플레이어 객체 생성
      // 약간의 지연 시간을 주어 src가 업데이트된 후 로드되도록 함
      setTimeout(() => {
        new YT.Player(iframeId, {
          events: {
            onStateChange: function (event) {
              // 1: 재생중 (PLAYING)
              if (event.data === YT.PlayerState.PLAYING) {
                swiper.autoplay.stop(); // 슬라이드 멈춤
              }
              // 2: 일시정지(PAUSED) or 0: 종료(ENDED)
              else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                swiper.autoplay.start(); // 슬라이드 재개
              }
            },
          },
        });
      }, 500);
    });
  };
}
