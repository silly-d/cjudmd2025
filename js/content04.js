// SECTION 04: 버튼에 괄호 표시 + “의 공명”이 버튼 위치 따라가기 + 멤버 갱신
document.addEventListener("DOMContentLoaded", () => {
  const nav   = document.getElementById("c04-nav");
  const track = document.getElementById("c04-center");
  const ofEl  = document.getElementById("c04-of");
  const list  = document.getElementById("c04-members");
  if (!nav || !track || !ofEl || !list) return;

  // 부서별 멤버 (수정해서 쓰기)
  const DATA = {
    "임원":    ["유은비","임희원","김보미","박서희"],
    "디피부":  ["최서윤","김현진","백진주","이연우"],
    "기획부":  ["—","—"],
    "편집부":  ["조범규","윤정원"],
    "멀티부":    ["권용우","조서영"],
    "홍보부":  ["—","—"],
    "포스터부":["—","—"]
  };

  // 트랙 높이를 좌측 리스트에 맞춤
  function syncTrackHeight(){ track.style.height = nav.offsetHeight + "px"; }
  syncTrackHeight(); window.addEventListener("resize", syncTrackHeight);

  // “의 공명”을 클릭된 버튼의 세로 중앙에 맞춤
  function moveOfTo(btn){
    const navTop    = nav.getBoundingClientRect().top + window.scrollY;
    const trackTop  = track.getBoundingClientRect().top + window.scrollY;
    const btnCenter = btn.getBoundingClientRect().top + window.scrollY + btn.offsetHeight/2;
    const y = btnCenter - trackTop - ofEl.offsetHeight/2;
    ofEl.style.transform = `translateY(${Math.max(0, y)}px)`;
  }

  // 멤버 렌더
  function renderMembers(arr){
    list.innerHTML = "";
    arr.forEach((name, i) => {
      const li = document.createElement("li");
      li.textContent = name;
      list.appendChild(li);
      setTimeout(() => li.classList.add("show"), i * 60);
    });
  }

  // 초기 렌더
  const first = nav.querySelector("button.is-active") || nav.querySelector("button");
  if (first){
    renderMembers(DATA[first.dataset.key] || []);
    moveOfTo(first);
  }

  // 클릭 이벤트
  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-key]");
    if (!btn) return;

    // active 토글(괄호 표시)
    nav.querySelectorAll("button").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    // 위치 이동 + 멤버 갱신
    moveOfTo(btn);
    renderMembers(DATA[btn.dataset.key] || []);
  });
});
