/***********************
 * 튜닝 가능한 상수들
 ************************/
const TOTAL = 48;
const PLACEHOLDER = "./img/placeholder.jpg";      // 페이지(designer.html) 기준
const WHEEL_THRESHOLD = 65;                        // 휠/제스처 임계값
const PAGING_COOLDOWN = 260;                       // 한 장 넘김 쿨다운(ms)
const IDLE_SNAP_MS = 130;                          // 멈춘 뒤 스냅 대기(ms)

/***********************
 * 데이터: ./img/test1.jpg ~ ./img/test48.jpg
 ************************/
const DESIGNERS = Array.from({ length: TOTAL }, (_, i) => ({
  id: `d${String(i + 1).padStart(3, "0")}`,
  name: `디자이너 ${i + 1}`,
  img: `./img/test${i + 1}.png`,                  // ★ 경로 수정
}));

/***********************
 * 엘리먼트
 ************************/
const $rail        = document.getElementById("designer-carousel");
const $list        = document.getElementById("designer-list");   // 없으면 null
const $searchForm  = document.getElementById("designer-search");
const $searchInput = document.getElementById("search-name");
const $count       = document.getElementById("designer-count");
const $wrap        = document.querySelector(".carousel-wrap");

/***********************
 * 렌더
 ************************/
function render(){
  $rail.innerHTML = DESIGNERS.map(d => `
    <article class="designer-card" data-id="${d.id}" data-name="${d.name}">
      <div class="thumb">
        <img src="${d.img}" alt="${d.name}"
             onerror="this.onerror=null; this.src='${PLACEHOLDER}'; console.warn('이미지 로드 실패:', '${d.img}');">
      </div>
      <div class="overlay"></div>
      <div class="label">${d.name}</div>
    </article>
  `).join("");

  if ($list) {
    $list.innerHTML = DESIGNERS.map(d => `<option value="${d.name}"></option>`).join("");
  }
  if ($count) $count.textContent = DESIGNERS.length;
}

/***********************
 * 중앙 기준 계산(괄호 = 50vw)
 ************************/
const getCards = () => [...$rail.querySelectorAll(".designer-card")];

function getClosestCardIndex(){
  const centerX = window.innerWidth / 2;
  const cards = getCards();
  let idx = 0, min = Infinity;
  for (let i = 0; i < cards.length; i++){
    const r  = cards[i].getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const d  = Math.abs(cx - centerX);
    if (d < min){ min = d; idx = i; }
  }
  return idx;
}

function centerOnIndex(index, smooth = true){
  const cards = getCards();
  const i = Math.max(0, Math.min(index, cards.length - 1));
  const card = cards[i]; if (!card) return;
  const target = (card.offsetLeft + card.offsetWidth / 2) - (window.innerWidth / 2);
  $rail.scrollTo({ left: target, behavior: smooth ? "smooth" : "auto" });
}

/***********************
 * 활성 카드 강조
 ************************/
let ticking = false;
function updateActive(){
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const activeIdx = getClosestCardIndex();
    const cards = getCards();
    for (const c of cards) c.classList.remove("is-active","is-dim");
    for (const c of cards) c.classList.add("is-dim");
    if (cards[activeIdx]){
      cards[activeIdx].classList.add("is-active");
      cards[activeIdx].classList.remove("is-dim");
    }
    ticking = false;
  });
}

/***********************
 * 검색 이동
 ************************/
function scrollToName(name){
  if (!name) return;
  const q = name.trim().toLowerCase();
  const cards = getCards();
  let idx = cards.findIndex(el => el.dataset.name.toLowerCase() === q);
  if (idx < 0) idx = cards.findIndex(el => el.dataset.name.toLowerCase().includes(q));
  if (idx >= 0) centerOnIndex(idx, true);
}

/***********************
 * 한 장씩 페이징 + 과도한 스냅 방지
 ************************/
let paging = false;
let scrollIdleTimer = null;

function snapToClosestAfterIdle(){
  clearTimeout(scrollIdleTimer);
  scrollIdleTimer = setTimeout(() => {
    centerOnIndex(getClosestCardIndex(), true);
  }, IDLE_SNAP_MS);
}

$rail.addEventListener("wheel", (e) => {
  // 세로휠을 가로로 전환
  if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) e.preventDefault();

  // 작은 제스처는 무시 → 과한 스냅 방지
  const magnitude = Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY));
  if (magnitude < WHEEL_THRESHOLD) return;

  if (paging) return;
  paging = true;

  const dir = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) > 0 ? 1 : -1;
  const current = getClosestCardIndex();
  centerOnIndex(current + (dir > 0 ? 1 : -1), true);

  setTimeout(() => { paging = false; }, PAGING_COOLDOWN);
}, { passive:false });

$rail.addEventListener("scroll", () => {
  updateActive();
  snapToClosestAfterIdle();
}, { passive:true });

document.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  e.preventDefault();
  const current = getClosestCardIndex();
  centerOnIndex(current + (e.key === "ArrowRight" ? 1 : -1), true);
});

/***********************
 * 실행
 ************************/
render();
requestAnimationFrame(() => { centerOnIndex(0, false); updateActive(); });
window.addEventListener("load", () => {
  requestAnimationFrame(() => { centerOnIndex(getClosestCardIndex(), false); updateActive(); });
});

// 검색 이벤트
$searchForm.addEventListener("submit", e => { e.preventDefault(); scrollToName($searchInput.value); });
$searchInput.addEventListener("change", () => scrollToName($searchInput.value));
