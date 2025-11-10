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

// 페이드인 효과 (index.html에서 왔을 때만)
document.addEventListener("DOMContentLoaded", () => {
  const fromIndex = sessionStorage.getItem("fromIndex");

  if (fromIndex === "true") {
    // index에서 왔을 때만 페이드인
    gsap.set("body", { opacity: 0 });
    gsap.to("body", {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut",
    });

    // 플래그 제거 (한 번만 실행)
    sessionStorage.removeItem("fromIndex");
  } else {
    // 다른 페이지에서 왔을 때는 즉시 표시
    gsap.set("body", { opacity: 1 });
  }
});

// ============================================
// CONTENT 01: Hero Photo Slideshow
// ============================================
document.addEventListener("DOMContentLoaded", () => {
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
});

// ============================================
// CONTENT 02: Poster Download
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("c02-download");
  if (!btn) return;

  // 다운로드 파일 경로(예시). PNG, JPG, PDF 아무거나 가능.
  const POSTER_FILE = "../img/ct02/poster.png"; // 필요 시 poster.pdf 등으로 변경

  btn.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = POSTER_FILE;
    a.download = ""; // 파일명 자동. 특정 이름 원하면 "gongmyeong-poster.png"
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
});

// ============================================
// CONTENT 03: Number Count-up Animation
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("content03");
  const title = document.querySelector(".c03-title");
  const numEl = document.getElementById("c03-num");
  if (!section || !title || !numEl) return;

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
        title.addEventListener(
          "animationend",
          () => {
            title.classList.remove("ripple");
          },
          { once: true }
        );
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
});

// ============================================
// CONTENT 04: Team Members Navigation
// ============================================
document.addEventListener("DOMContentLoaded", () => {
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

  const DATA = {
    임원: [
      { name: "조예리", img: "../img/miniprofile/miniprofile01.png" },
      { name: "민유진", img: "../img/miniprofile/miniprofile02.png" },
    ],
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

      // 프리뷰 박스 추가
      const preview = document.createElement("div");
      preview.className = "c04-preview";
      preview.style.backgroundImage = `url('${member.img}')`; // 멤버별 이미지
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

  window.addEventListener("resize", () => {
    syncTrackHeight();
    const active = nav.querySelector("button.is-active");
    if (active) requestAnimationFrame(() => moveAll(active));
  });
});

// ============================================
// CONTENT 05: Professor Cards Stack
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const flowContainer = document.querySelector(".ct05-flow-container");
  const cards = gsap.utils.toArray(".flow-area");

  if (!flowContainer || cards.length === 0) return;

  // 초기 설정
  cards.forEach((card, index) => {
    gsap.set(card, {
      transformOrigin: "center top",
    });

    if (index === 0) {
      // 첫 번째 카드만 화면에 보임
      gsap.set(card, {
        y: 0,
        scale: 1,
      });
    } else {
      // 나머지는 화면 아래에 숨김
      gsap.set(card, {
        y: "100vh",
        scale: 1,
      });
    }
  });

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".content05",
      start: "-=150",
      end: () => `+=${(cards.length - 1) * 500}`,
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

      // 다음 카드 올라오기
      scrollTl.fromTo(
        cards[nextIndex],
        {
          y: "100vh",
          scale: 1,
        },
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
});

// ============================================
// CONTENT 06: YouTube Video Carousel
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("content06");
  if (!root) return;

  const dataNodes = Array.from(root.querySelectorAll(".c06-data > li"));
  if (dataNodes.length === 0) return;

  const leftBtn = root.querySelector(".c06-side-left");
  const rightBtn = root.querySelector(".c06-side-right");
  const prevBr = root.querySelector(".c06-prev");
  const nextBr = root.querySelector(".c06-next");
  const current = root.querySelector(".c06-current");

  // 유틸: URL에서 YouTube VIDEO_ID 추출
  function getVideoId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
      return null;
    } catch (e) {
      return null;
    }
  }
  // 썸네일/임베드 URL
  const thumbOf = (url) => {
    const id = getVideoId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
  };
  const embedOf = (url) => {
    const id = getVideoId(url);
    return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1` : "";
  };

  let items = dataNodes
    .map((li) => ({
      video: li.getAttribute("data-video") || "",
      title: li.getAttribute("data-title") || "영상",
    }))
    .filter((it) => getVideoId(it.video));

  if (items.length === 0) return;

  let index = 0; // 중앙 재생 영상 인덱스

  function renderSides() {
    const n = items.length;
    const leftIdx = (index - 1 + n) % n;
    const rightIdx = (index + 1) % n;

    const limg = leftBtn.querySelector("img");
    limg.src = thumbOf(items[leftIdx].video);
    limg.alt = items[leftIdx].title;

    const rimg = rightBtn.querySelector("img");
    rimg.src = thumbOf(items[rightIdx].video);
    rimg.alt = items[rightIdx].title;
  }

  function renderCenter() {
    const src = embedOf(items[index].video);
    // iframe 교체
    current.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = items[index].title;
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );
    current.appendChild(iframe);
  }

  function goNext() {
    index = (index + 1) % items.length;
    renderSides();
    renderCenter();
  }
  function goPrev() {
    index = (index - 1 + items.length) % items.length;
    renderSides();
    renderCenter();
  }

  // 초기 렌더
  renderSides();
  renderCenter();

  // 인터랙션
  nextBr.addEventListener("click", goNext);
  prevBr.addEventListener("click", goPrev);
  rightBtn.addEventListener("click", goNext);
  leftBtn.addEventListener("click", goPrev);
});
