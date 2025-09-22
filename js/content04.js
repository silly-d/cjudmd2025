document.addEventListener("DOMContentLoaded", () => {
  const nav   = document.getElementById("c04-nav");
  const left  = nav?.closest(".c04-left");
  const track = document.getElementById("c04-center");
  const ofEl  = document.getElementById("c04-of");
  const list  = document.getElementById("c04-members");
  if (!nav || !left || !track || !ofEl || !list) return;

  if (!ofEl.dataset.inited){
    ofEl.innerHTML = `<span class="c04-of-eui">의</span><span class="c04-of-gong">공명</span>`;
    ofEl.dataset.inited = "1";
  }

  const DATA = {
    "임원": ["유은비","임희원","김보미","박서희"],
    "디피부": ["유은비","임희원","김보미","박서희","최서윤","김현진","백진주","이연우","조범규","윤정원"],
    "기획부": ["유은비","임희원","김보미","박서희"],
    "편집부": ["유은비","임희원","김보미","박서희"],
    "멀티부": ["권용우","조서영","김선정","김지수","곽초은","오효진","황지원"],
    "홍보부": ["유은비","임희원","김보미","박서희"],
    "포스터부": ["유은비","임희원","김보미","박서희"]
  };


  const pL = document.createElement("span"); pL.className = "c04-paren c04-paren--left";
  const pR = document.createElement("span"); pR.className = "c04-paren c04-paren--right";
  left.appendChild(pL); left.appendChild(pR);

function syncTrackHeight(){
  const h = nav.offsetHeight;
  track.style.height = h + "px";

  const pad = ofEl.offsetHeight ? ofEl.offsetHeight / 2 : 0;
  track.style.paddingTop = pad + "px";
  track.style.paddingBottom = pad + "px";
}

  function moveAll(btn){
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--c04-paren-gap")) || 10;

    const leftRect  = left.getBoundingClientRect();
    const btnRect   = btn.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();

    const centerY = btnRect.top + window.scrollY + btnRect.height/2;
    const topInLeft = centerY - (leftRect.top + window.scrollY);
    pL.style.top = topInLeft + "px";
    pR.style.top = topInLeft + "px";

    const centerXInLeft = btnRect.left - leftRect.left + btnRect.width/2;
    const halfW = btnRect.width/2;
    pL.style.left = (centerXInLeft - halfW - pL.offsetWidth - gap) + "px";
    pR.style.left = (centerXInLeft + halfW + gap) + "px";

    const topInTrack = centerY - (trackRect.top + window.scrollY) - ofEl.offsetHeight/2;
    const pad = ofEl.getBoundingClientRect().height / 2;
    const maxY = track.clientHeight - ofEl.offsetHeight + pad;
    const clamped = Math.max(-pad, Math.min(topInTrack, maxY));
    ofEl.style.transform = `translateY(${clamped}px)`;

  }

  function renderMembers(arr){
    list.innerHTML = "";
    arr.forEach((name, i) => {
      const li = document.createElement("li");
      li.textContent = name;
      list.appendChild(li);
      setTimeout(() => li.classList.add("show"), i * 60);
    });
  }

  function init(){
    syncTrackHeight();
    const first = nav.querySelector("button.is-active") || nav.querySelector("button");
    if (first){
      renderMembers(DATA[first.dataset.key] || []);
      requestAnimationFrame(() => moveAll(first));
    }
  }
  init();

  nav.addEventListener("click", e => {
    const btn = e.target.closest("button[data-key]");
    if (!btn) return;
    nav.querySelectorAll("button").forEach(b => b.classList.remove("is-active"));
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
