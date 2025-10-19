import { sliderData } from "./sliderData.js";

const lenis = new Lenis();

const config = {
  SCROLL_SPEED: 1.75,
  LERP_FACTOR: 0.05,
  MAX_VELOCITY: 150,
};

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
    state.slideWidth = 150 + slideMargin;
  } else {
    state.slideWidth = 400 + slideMargin;
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
    const parallaxOffset = distanceFromCenter * -0.25;

    img.style.transform = `translateX(${parallaxOffset}px) scale(2.25)`;
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

function animate(time) {
  lenis.raf(time);

  state.currentX += (state.targetX - state.currentX) * config.LERP_FACTOR;

  updateMovingState();
  updateSlidePositions();
  updateParallax();

  requestAnimationFrame(animate);
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
  const deltaX = (e.touches[0].clientX - state.startX) * 1.5;
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
  }, 40);
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
  }, 400);
}

function handleResize() {
  initializeSlides();
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
    lenis.stop();
  });

  slider.addEventListener("mouseleave", () => {
    lenis.start();
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
