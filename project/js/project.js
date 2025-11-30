import { sliderData } from "./sliderData.js";

const config = {
  SCROLL_SPEED: 1.75,
  LERP_FACTOR: 0.07,
  MAX_VELOCITY: 100,
};

const header = document.querySelector("header");
const headerHeight = header ? header.offsetHeight : 0;

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

  // 모바일↔데스크톱 전환이 일어났을 때만 초기화
  if (currentIsMobile !== lastIsMobile) {
    initializeSlides();
    lastWidth = currentWidth;
    lastIsMobile = currentIsMobile;
  }
}

let glitchTimeout = null;
function addGlitchEffect() {
  if (!document.documentElement.classList.contains("glitch-active")) {
    document.documentElement.classList.add("glitch-active");
  }
}
function removeGlitchEffect() {
  document.documentElement.classList.remove("glitch-active");
}

function checkMobile() {
  state.isMobile = window.innerWidth < 1000;
}

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
  arrow.innerHTML = `
    <svg viewBox="0 0 24 24">
        <path d="M7 17L17 7M17 7H7M17 7V17"/>
    </svg>
    `;
  overlay.appendChild(title);
  overlay.appendChild(arrow);

  front.addEventListener("click", (e) => {
    e.preventDefault();
    if (state.dragDistance < 10 && !state.hasActuallyDragged) {
      window.location.href = sliderData[dataIndex].url;
    }
  });

  front.appendChild(imageContainer);
  front.appendChild(overlay);

  const back = document.createElement("div");
  back.className = "slide-back";

  slide.appendChild(front);
  slide.appendChild(back);

  slide.addEventListener("click", (e) => {
    e.preventDefault();
    if (state.dragDistance < 10 && !state.hasActuallyDragged) {
      window.location.href = sliderData[dataIndex].url;
    }
  });

  const backImg = document.createElement("img");
  backImg.className = "back-blur-img";
  backImg.src = sliderData[dataIndex].img;
  backImg.alt = sliderData[dataIndex].title;
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

  slide.addEventListener("mouseenter", () => {
    slide.classList.add("flipped");
  });
  slide.addEventListener("mouseleave", () => {
    slide.classList.remove("flipped");
  });

  return slide;
}

function initializeSlides() {
  const track = document.querySelector(".slide-track");
  track.innerHTML = "";
  state.slides = [];

  checkMobile();

  const slideMargin = 40;
  if (state.isMobile) {
    state.slideWidth = 250 + slideMargin;
  } else {
    state.slideWidth = 375 + slideMargin;
  }

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

    if (slideRect.right < -500 || slideRect.left > window.innerWidth + 500) {
      return;
    }

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

function animate(time) {
  state.currentX += (state.targetX - state.currentX) * config.LERP_FACTOR;

  updateMovingState();
  updateSlidePositions();
  updateParallax();

  reqId = requestAnimationFrame(animate);
}

function handleWheel(e) {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    return;
  }
  e.preventDefault();
  state.lastScrollTime = Date.now();
  const scrollDelta = e.deltaY * config.SCROLL_SPEED;
  state.targetX -= Math.max(Math.min(scrollDelta, config.MAX_VELOCITY), -config.MAX_VELOCITY);
  clearTimeout(state.wheelSnapTimeout);
  state.wheelSnapTimeout = setTimeout(() => {
    snapToCenter();
  }, 1000);
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
  if (state.dragDistance > 5) {
    state.hasActuallyDragged = true;
  }
}

function handleTouchEnd() {
  state.isDragging = false;
  setTimeout(() => {
    state.hasActuallyDragged = false;
  }, 100);
  removeGlitchEffect();
  setTimeout(() => {
    snapToCenter();
  }, 100);
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
  if (state.dragDistance > 5) {
    state.hasActuallyDragged = true;
  }
}

function handleMouseUp() {
  state.isDragging = false;
  setTimeout(() => {
    state.hasActuallyDragged = false;
  }, 1000);
  removeGlitchEffect();
  setTimeout(() => {
    snapToCenter();
  }, 100);
}

function resetSearchZoom() {
  document.querySelector(".sliders").classList.remove("search-active");
  state.slides.forEach((s) => {
    s.classList.remove("zoomed", "shrunken", "flipped");
  });
}

function snapToCenter() {
  if (state.isDragging || document.querySelector(".sliders").classList.contains("search-active")) {
    return;
  }

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

function handleSearch(event) {
  const query = event.target.value.trim().toLowerCase();

  if (query === "") {
    resetSearchZoom();
    return;
  }

  let foundProjectIndex = -1;
  const foundProject = sliderData.find((project, index) => {
    if (project.keywords && Array.isArray(project.keywords)) {
      const match = project.keywords.some((keyword) => keyword.toLowerCase().includes(query));
      if (match) {
        foundProjectIndex = index;
        return true;
      }
    }
    return false;
  });

  if (foundProject) {
    const targetSlide = document.querySelector(`.slide[data-content-index="${foundProjectIndex}"]`);

    if (targetSlide) {
      const event = new CustomEvent("search:found", {
        detail: { targetSlide: targetSlide },
      });
      document.dispatchEvent(event);
    }
  }
}

// [추가] 그리드 뷰 렌더링 함수
function renderGrid() {
  const gridContainer = document.getElementById("view-grid");
  // 이미 렌더링 되었으면 중복 실행 방지
  if (gridContainer.children.length > 0) return;

  sliderData.forEach((data, index) => {
    // 기존 createSlideElement 함수를 재활용하거나 유사하게 생성
    // 단, 그리드용이므로 이벤트 리스너(드래그 등)는 최소화하는 것이 좋음

    // 여기서는 기존 createSlideElement를 활용하되,
    // 생성 후 클래스나 속성을 살짝 조정하는 방식을 씁니다.
    // 주의: createSlideElement 내부의 모바일 분기처리가 슬라이더 전용일 수 있으므로
    // 그리드용 요소를 새로 만드는 것이 깔끔할 수 있습니다.

    const slide = document.createElement("div");
    slide.className = "slide"; // CSS 재활용
    slide.dataset.index = index;

    // --- 내부 구조 (Front/Back) 생성 (기존 로직 복사) ---
    const front = document.createElement("div");
    front.className = "slide-front";

    // 이미지
    const imgContainer = document.createElement("div");
    imgContainer.className = "slide-image";
    const img = document.createElement("img");
    img.src = data.img;
    img.alt = data.title;
    imgContainer.appendChild(img);

    // 오버레이
    const overlay = document.createElement("div");
    overlay.className = "slide-overlay";
    overlay.innerHTML = `
      <p class="project-title">${data.title}</p>
      <div class="project-arrow"><i class="fa-solid fa-arrow-right"></i></div>
    `;

    front.appendChild(imgContainer);
    front.appendChild(overlay);

    // 뒷면
    const back = document.createElement("div");
    back.className = "slide-back";

    // 뒷면 내용 채우기 (기존 로직과 동일)
    const backImg = document.createElement("img");
    backImg.className = "back-blur-img";
    backImg.src = data.img;
    back.appendChild(backImg);

    const backTitle = document.createElement("h3");
    backTitle.textContent = data.title;
    back.appendChild(backTitle);

    if (data.members) {
      const mem = document.createElement("div");
      mem.className = "back-members";
      mem.textContent = data.members.join(" · ");
      back.appendChild(mem);
    }
    // ... description, subjects 등 추가 ...

    slide.appendChild(front);
    slide.appendChild(back);

    // --- 그리드 전용 이벤트 ---
    // 클릭 시 링크 이동
    slide.addEventListener("click", () => {
      window.location.href = data.url;
    });

    // 호버 시 플립 효과 (CSS class 제어)
    slide.addEventListener("mouseenter", () => slide.classList.add("flipped"));
    slide.addEventListener("mouseleave", () => slide.classList.remove("flipped"));

    gridContainer.appendChild(slide);
  });
}

// [추가/수정] 뷰 토글 로직
const toggleBtn = document.getElementById("view-toggle-btn");
const sliderView = document.getElementById("view-slider");
const gridView = document.getElementById("view-grid");
const btnIcon = toggleBtn.querySelector("i");
const btnText = toggleBtn.querySelector("span");

let isGridView = false;

toggleBtn.addEventListener("click", () => {
  isGridView = !isGridView;

  if (isGridView) {
    // [그리드 모드로 전환]
    // 1. 슬라이더 애니메이션 즉시 중단 (중요: 백그라운드 계산 방지)
    if (reqId) cancelAnimationFrame(reqId);

    // 2. 그리드 렌더링
    renderGrid();

    // 3. 화면 전환
    sliderView.style.display = "none";

    gridView.style.display = "grid";
    // 그리드는 투명도 0에서 1로 부드럽게 등장
    gsap.fromTo(gridView, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // 4. 버튼 및 스크롤 설정
    btnIcon.className = "fa-solid fa-layer-group";
    btnText.textContent = "슬라이드 보기";
    if (window.lenis) window.lenis.start();
  } else {
    // [슬라이드 모드로 전환]

    // 1. 그리드 숨김
    gridView.style.display = "none";

    // 2. 슬라이더 보이게 설정 (중요: 투명도는 아직 0)
    sliderView.style.display = "block";
    gsap.set(sliderView, { opacity: 0 }); // GSAP으로 강제 0 설정

    // 3. ★ 핵심 해결책: 애니메이션 루프 돌리기 전에 위치 강제 업데이트
    // display: block이 된 직후에 위치를 다시 계산해야 요소들이 제자리로 옵니다.
    updateSlidePositions();
    updateParallax();

    // 4. 투명도 애니메이션 시작 (0 -> 1)
    gsap.to(sliderView, { opacity: 1, duration: 0.5, clearProps: "opacity" });

    // 5. 버튼 설정
    btnIcon.className = "fa-solid fa-border-all";
    btnText.textContent = "전체보기";

    // 6. 애니메이션 루프 재시작
    if (reqId) cancelAnimationFrame(reqId); // 혹시 모를 중복 방지
    state.lastCurrentX = state.currentX; // 속도 계산 튀는 것 방지
    animate();
  }
});

function initializeEventListeners() {
  const slider = document.querySelector(".sliders");

  const searchInput = document.querySelector('.search-title input[type="search"]');

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      if (searchInput.value.trim() === "") {
        resetSearchZoom();
      }
    });
  }

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
