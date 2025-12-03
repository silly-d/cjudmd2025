import { sliderData } from "./sliderData.js";

const config = {
  SCROLL_SPEED: 1.75,
  LERP_FACTOR: 0.07,
  MAX_VELOCITY: 100,
};

const header = document.querySelector("header");
const headerHeight = header ? header.offsetHeight : 0;

let lastScrollTop = 0;

// 헤더 스크롤 이벤트
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

const totalSlideCount = sliderData.length;

const state = {
  currentX: 0,
  targetX: 0,
  slideWidth: 0,
  slides: [],
  isDragging: false,
  startX: 0,
  lastX: 0,
  lastMouseX: 0,
  lastScrollTime: Date.now(),
  isMoving: false,
  velocity: 0,
  lastCurrentX: 0,
  dragDistance: 0,
  hasActuallyDragged: false,
  isMobile: false,
  wheelSnapTimeout: null,
};

let lastWidth = window.innerWidth;
let lastIsMobile = window.innerWidth < 1000;

function handleResize() {
  const currentWidth = window.innerWidth;
  const currentIsMobile = currentWidth < 1000;
  if (currentIsMobile !== lastIsMobile) {
    initializeSlides();
    lastWidth = currentWidth;
    lastIsMobile = currentIsMobile;
  }
}

function removeGlitchEffect() {
  document.documentElement.classList.remove("glitch-active");
}

function checkMobile() {
  state.isMobile = window.innerWidth < 1000;
}

// 슬라이드 생성 함수
function createSlideElement(index) {
  const slide = document.createElement("div");
  slide.className = "slide";
  const dataIndex = index % totalSlideCount;
  slide.dataset.index = index;
  slide.dataset.contentIndex = dataIndex;

  if (state.isMobile) {
    slide.style.width = "250px";
    slide.style.height = "350px";
  }

  // --- Front ---
  const front = document.createElement("div");
  front.className = "slide-front";

  const imageContainer = document.createElement("div");
  imageContainer.className = "slide-image";
  const img = document.createElement("img");
  img.src = sliderData[dataIndex].img;
  img.alt = sliderData[dataIndex].title;
  imageContainer.appendChild(img);

  const overlay = document.createElement("div");
  overlay.className = "slide-overlay";
  const title = document.createElement("p");
  title.className = "project-title";
  title.textContent = sliderData[dataIndex].title;
  const arrow = document.createElement("div");
  arrow.className = "project-arrow";
  arrow.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>`;
  overlay.appendChild(title);
  overlay.appendChild(arrow);

  front.appendChild(imageContainer);
  front.appendChild(overlay);

  // --- Back ---
  const back = document.createElement("div");
  back.className = "slide-back";

  const backImg = document.createElement("img");
  backImg.className = "back-blur-img";
  backImg.src = sliderData[dataIndex].img;
  back.appendChild(backImg);

  const backTitle = document.createElement("h3");
  backTitle.textContent = sliderData[dataIndex].title;
  back.appendChild(backTitle);

  if (sliderData[dataIndex].members) {
    const member = document.createElement("div");
    member.className = "back-members";
    member.textContent = sliderData[dataIndex].members.join(" · ");
    back.appendChild(member);
  }

  if (sliderData[dataIndex].description) {
    const desc = document.createElement("div");
    desc.className = "back-desc";
    desc.innerHTML = sliderData[dataIndex].description.replace(/\n/g, "<br>");
    back.appendChild(desc);
  }

  if (sliderData[dataIndex].subjects) {
    const subjectWrap = document.createElement("div");
    subjectWrap.className = "back-subjects";
    sliderData[dataIndex].subjects.forEach((subj) => {
      const box = document.createElement("span");
      box.className = "subject-box";
      box.textContent = subj;
      subjectWrap.appendChild(box);
    });
    back.appendChild(subjectWrap);
  }

  slide.appendChild(front);
  slide.appendChild(back);

  // 이벤트
  slide.addEventListener("click", (e) => {
    e.preventDefault();
    if (state.dragDistance < 10 && !state.hasActuallyDragged) {
      window.location.href = sliderData[dataIndex].url;
    }
  });

  slide.addEventListener("mouseenter", () => slide.classList.add("flipped"));
  slide.addEventListener("mouseleave", () => slide.classList.remove("flipped"));

  return slide;
}

function initializeSlides() {
  const track = document.querySelector(".slide-track");
  track.innerHTML = "";
  state.slides = [];
  checkMobile();

  const slideMargin = 40;
  state.slideWidth = state.isMobile ? 250 + slideMargin : 375 + slideMargin;

  const copies = 6;
  const totalSlides = totalSlideCount * copies;

  for (let i = 0; i < totalSlides; i++) {
    const slide = createSlideElement(i);
    track.appendChild(slide);
    state.slides.push(slide);
  }

  const startOffset = -(totalSlideCount * state.slideWidth * 2);
  state.currentX = startOffset;
  state.targetX = startOffset;
}

function updateSlidePositions() {
  const track = document.querySelector(".slide-track");
  const sequenceWidth = state.slideWidth * totalSlideCount;

  if (state.currentX > -sequenceWidth * 1) {
    state.currentX -= sequenceWidth;
    state.targetX -= sequenceWidth;
  } else if (state.currentX < -sequenceWidth * 4) {
    state.currentX += sequenceWidth;
    state.targetX += sequenceWidth;
  }
  track.style.transform = `translate3d(${state.currentX}px, 0, 0)`;
}

function updateParallax() {
  const viewportCenter = window.innerWidth / 2;
  state.slides.forEach((slide) => {
    const img = slide.querySelector("img");
    if (!img) return;
    const slideRect = slide.getBoundingClientRect();
    if (slideRect.right < -500 || slideRect.left > window.innerWidth + 500) return;

    const slideCenter = slideRect.left + slideRect.width / 2;
    const distanceFromCenter = slideCenter - viewportCenter;
    const parallaxOffset = distanceFromCenter * -0.05;
    img.style.transform = `translateX(${parallaxOffset}px) scale(1.25)`;
  });
}

function updateMovingState() {
  state.velocity = Math.abs(state.currentX - state.lastCurrentX);
  state.lastCurrentX = state.currentX;
  const isSlowEnough = state.velocity < 0.1;
  const hasBeenStillLongEnough = Date.now() - state.lastScrollTime > 200;
  state.isMoving = state.hasActuallyDragged || !isSlowEnough || !hasBeenStillLongEnough;
  document.documentElement.style.setProperty("--slider-moving", state.isMoving ? "1" : "0");
}

let reqId;
function animate() {
  state.currentX += (state.targetX - state.currentX) * config.LERP_FACTOR;
  updateMovingState();
  updateSlidePositions();
  updateParallax();
  reqId = requestAnimationFrame(animate);
}

// --- 마우스/터치 이벤트 핸들러들 ---
function handleWheel(e) {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  e.preventDefault();
  state.lastScrollTime = Date.now();
  const scrollDelta = e.deltaY * config.SCROLL_SPEED;
  state.targetX -= Math.max(Math.min(scrollDelta, config.MAX_VELOCITY), -config.MAX_VELOCITY);
  clearTimeout(state.wheelSnapTimeout);
  state.wheelSnapTimeout = setTimeout(snapToCenter, 1000);
}

function handleTouchStart(e) {
  state.isDragging = true;
  state.startX = e.touches[0].clientX;
  state.lastX = state.targetX;
  state.dragDistance = 0;
  state.hasActuallyDragged = false;
  state.lastScrollTime = Date.now();
}

function handleTouchMove(e) {
  if (!state.isDragging) return;
  const deltaX = (e.touches[0].clientX - state.startX) * 7.5;
  state.targetX = state.lastX + deltaX;
  state.dragDistance = Math.abs(deltaX);
  if (state.dragDistance > 5) state.hasActuallyDragged = true;
}

function handleTouchEnd() {
  state.isDragging = false;
  setTimeout(() => {
    state.hasActuallyDragged = false;
  }, 100);
  removeGlitchEffect();
  setTimeout(snapToCenter, 100);
}

function handleMouseDown(e) {
  e.preventDefault();
  state.isDragging = true;
  state.startX = e.clientX;
  state.lastMouseX = e.clientX;
  state.lastX = state.targetX;
  state.dragDistance = 0;
  state.hasActuallyDragged = false;
  state.lastScrollTime = Date.now();
}

function handleMouseMove(e) {
  if (!state.isDragging) return;
  e.preventDefault();
  const deltaX = (e.clientX - state.lastMouseX) * 2;
  state.targetX += deltaX;
  state.lastMouseX = e.clientX;
  state.dragDistance += Math.abs(deltaX);
  if (state.dragDistance > 5) state.hasActuallyDragged = true;
}

function handleMouseUp() {
  state.isDragging = false;
  setTimeout(() => {
    state.hasActuallyDragged = false;
  }, 1000);
  removeGlitchEffect();
  setTimeout(snapToCenter, 100);
}

function resetSearchZoom() {
  document.querySelector(".sliders").classList.remove("search-active");
  state.slides.forEach((s) => {
    s.classList.remove("zoomed", "shrunken", "flipped");
  });
}

function snapToCenter() {
  if (state.isDragging || document.querySelector(".sliders").classList.contains("search-active")) return;
  const viewportCenter = window.innerWidth / 2;
  let closestSlide = null;
  let minDistance = Infinity;

  state.slides.forEach((slide) => {
    const rect = slide.getBoundingClientRect();
    if (rect.width === 0) return;
    const slideCenter = rect.left + rect.width / 2;
    const distance = Math.abs(slideCenter - viewportCenter);
    if (distance < minDistance) {
      minDistance = distance;
      closestSlide = slide;
    }
  });

  if (!closestSlide) return;
  const slideIndex = parseInt(closestSlide.dataset.index, 10);
  const slideCenterInTrack = slideIndex * state.slideWidth + state.slideWidth / 2;
  state.targetX = viewportCenter - slideCenterInTrack;
}

document.addEventListener("search:found", (e) => {
  const { targetSlide } = e.detail;
  if (targetSlide && targetSlide.dataset.index) {
    const slideIndex = parseInt(targetSlide.dataset.index, 10);
    const slideCenterInTrack = slideIndex * state.slideWidth + state.slideWidth / 2;
    const viewportCenter = window.innerWidth / 2;
    const idealTargetX = viewportCenter - slideCenterInTrack;
    const sequenceWidth = state.slideWidth * totalSlideCount;
    const diff = idealTargetX - state.targetX;
    const sequencesAway = Math.round(diff / sequenceWidth);
    const closestTargetX = idealTargetX - sequencesAway * sequenceWidth;

    state.targetX = closestTargetX;
    document.querySelector(".sliders").classList.add("search-active");
    const targetContentIndex = targetSlide.dataset.contentIndex;

    state.slides.forEach((s) => {
      if (s.dataset.contentIndex === targetContentIndex) {
        s.classList.add("zoomed");
        s.classList.remove("shrunken");
        s.classList.add("flipped");
      } else {
        s.classList.add("shrunken");
        s.classList.remove("zoomed");
        s.classList.remove("flipped");
      }
    });
  }
});

// ===============================================
// [통합] 검색 및 그리드 뷰 처리 (Search & Grid Logic)
// ===============================================

// 그리드 렌더링
function renderGrid() {
  const gridContainer = document.getElementById("view-grid");
  if (gridContainer.children.length > 0) return;

  sliderData.forEach((data, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.dataset.index = index;

    // 앞면
    const front = document.createElement("div");
    front.className = "slide-front";
    front.innerHTML = `
      <div class="slide-image"><img src="${data.img}" alt="${data.title}"></div>
      <div class="slide-overlay">
        <p class="project-title">${data.title}</p>
        <div class="project-arrow"><svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg></div>
      </div>
    `;

    // 뒷면
    const back = document.createElement("div");
    back.className = "slide-back";

    // 뒷면 컨텐츠 조립
    let backContent = `
      <img class="back-blur-img" src="${data.img}">
      <h3>${data.title}</h3>
    `;
    if (data.members) backContent += `<div class="back-members">${data.members.join(" · ")}</div>`;
    if (data.description) backContent += `<div class="back-desc">${data.description.replace(/\n/g, "<br>")}</div>`;

    let subjectsHtml = "";
    if (data.subjects) {
      subjectsHtml = `<div class="back-subjects">${data.subjects
        .map((s) => `<span class="subject-box">${s}</span>`)
        .join("")}</div>`;
    }
    backContent += subjectsHtml;

    back.innerHTML = backContent;

    slide.appendChild(front);
    slide.appendChild(back);

    // 이벤트
    slide.addEventListener("click", () => {
      window.location.href = data.url;
    });
    slide.addEventListener("mouseenter", () => slide.classList.add("flipped"));
    slide.addEventListener("mouseleave", () => slide.classList.remove("flipped"));

    gridContainer.appendChild(slide);
  });
}

// 뷰 토글 변수
let isGridView = false;
const toggleBtn = document.getElementById("view-toggle-btn");
const sliderView = document.getElementById("view-slider");
const gridView = document.getElementById("view-grid");

// 뷰 토글 이벤트
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    isGridView = !isGridView;
    const btnIcon = toggleBtn.querySelector("i");
    const btnText = toggleBtn.querySelector("span");

    if (isGridView) {
      if (reqId) cancelAnimationFrame(reqId);
      renderGrid();
      sliderView.style.display = "none";
      gridView.style.display = "grid";
      gsap.fromTo(gridView, { opacity: 0 }, { opacity: 1, duration: 0.5 });

      btnIcon.className = "fa-solid fa-layer-group";
      btnText.textContent = "슬라이드 보기";
      if (window.lenis) window.lenis.start();
    } else {
      gridView.style.display = "none";
      sliderView.style.display = "block";
      gsap.set(sliderView, { opacity: 0 });
      updateSlidePositions();
      updateParallax();
      gsap.to(sliderView, { opacity: 1, duration: 0.5, clearProps: "opacity" });

      btnIcon.className = "fa-solid fa-border-all";
      btnText.textContent = "전체보기";
      state.lastCurrentX = state.currentX;
      animate();
    }
  });
}

// [핵심] 통합 검색 핸들러 (search.js의 로직을 흡수)
function handleSearch(event) {
  if (event.type === "submit") event.preventDefault();

  const inputEl =
    event.target.tagName === "INPUT" ? event.target : document.querySelector('.search-title input[type="search"]');
  const query = inputEl ? inputEl.value.trim().toLowerCase() : "";

  // 검색어 없음 -> 초기화
  if (!query) {
    if (isGridView) {
      document.querySelectorAll(".project-grid-container .slide").forEach((c) => {
        c.style.display = "";
        c.classList.remove("grid-highlight");
      });
    } else {
      resetSearchZoom();
    }
    return;
  }

  // --- 검색 로직 (search.js에서 가져온 강력한 찾기) ---
  // 1. 전체 데이터에서 찾기
  let foundProjectIndex = -1;
  const foundProject = sliderData.find((project, index) => {
    // 1. 제목 검색
    const title = (project.projectTitle || project.title).toLowerCase();
    if (title === query || title.includes(query)) {
      foundProjectIndex = index;
      return true;
    }
    // 2. 팀원 이름 검색
    if (
      project.members &&
      project.members.some(
        (name) => name.replace(/\s/g, "").toLowerCase().includes(query) || name.toLowerCase().includes(query)
      )
    ) {
      foundProjectIndex = index;
      return true;
    }
    // 3. 키워드 검색
    if (project.keywords && project.keywords.some((kw) => kw.toLowerCase().includes(query))) {
      foundProjectIndex = index;
      return true;
    }
    return false;
  });

  if (foundProjectIndex === -1) {
    alert("해당 프로젝트 또는 디자이너를 찾을 수 없습니다.");
    return;
  }

  // --- 결과 처리 (뷰 모드에 따라 다르게) ---
  if (isGridView) {
    // [그리드 뷰]: 필터링 + 스크롤 이동 + 흰색 테두리
    const gridCards = document.querySelectorAll(".project-grid-container .slide");
    let targetCard = null;

    gridCards.forEach((card) => {
      if (parseInt(card.dataset.index) === foundProjectIndex) {
        card.style.display = ""; // 찾은건 보여줌
        targetCard = card;
      } else {
        card.style.display = "none"; // 나머진 숨김
      }
    });

    if (targetCard) {
      setTimeout(() => {
        const rect = targetCard.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - window.innerHeight / 2 + rect.height / 2;

        if (window.lenis) {
          window.lenis.scrollTo(targetY, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }

        // 흰색 테두리 (CSS 클래스 사용)
        document.querySelectorAll(".grid-highlight").forEach((el) => el.classList.remove("grid-highlight"));
        targetCard.classList.add("grid-highlight");

        // 2.5초 뒤 제거
        setTimeout(() => targetCard.classList.remove("grid-highlight"), 2500);
      }, 50);

      if (inputEl) inputEl.blur();
    }
  } else {
    // [슬라이더 뷰]: 줌인 효과
    const targetSlide = document.querySelector(`.sliders .slide[data-content-index="${foundProjectIndex}"]`);
    if (targetSlide) {
      const customEvent = new CustomEvent("search:found", {
        detail: { targetSlide: targetSlide },
      });
      document.dispatchEvent(customEvent);
      if (inputEl) inputEl.blur();
    }
  }
}

function initializeEventListeners() {
  const slider = document.querySelector(".sliders");
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector('.search-title input[type="search"]');

  // 검색 폼 이벤트 연결
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearch);
  }

  // 검색어 지웠을 때 초기화
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      if (e.target.value.trim() === "") {
        if (isGridView) {
          document.querySelectorAll(".project-grid-container .slide").forEach((c) => {
            c.style.display = "";
            c.classList.remove("grid-highlight");
          });
        } else {
          resetSearchZoom();
        }
      }
    });
  }

  // 슬라이더 이벤트
  slider.addEventListener("mouseenter", () => {
    if (window.lenis) window.lenis.stop();
  });
  slider.addEventListener("mouseleave", () => {
    if (window.lenis) window.lenis.start();
  });
  slider.addEventListener("wheel", resetSearchZoom, { passive: true });
  slider.addEventListener("mousedown", resetSearchZoom);
  slider.addEventListener("touchstart", resetSearchZoom);
  slider.addEventListener("wheel", handleWheel, { passive: false });
  slider.addEventListener("touchstart", handleTouchStart, { passive: true });
  slider.addEventListener("touchmove", handleTouchMove, { passive: false });
  slider.addEventListener("touchend", handleTouchEnd, { passive: true });
  slider.addEventListener("mousedown", handleMouseDown);
  slider.addEventListener("mouseleave", handleMouseUp);
  slider.addEventListener("dragstart", (e) => e.preventDefault());

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("resize", handleResize);
}

function initializeSlider() {
  initializeSlides();
  initializeEventListeners();
  animate();
}

document.addEventListener("DOMContentLoaded", initializeSlider);
