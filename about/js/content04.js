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
  "임원": [
    { name: "조예리", img: "../img/miniprofile/miniprofile01.png" },
    { name: "민유진", img: "../img/miniprofile/miniprofile02.png" }
  ],
  "디피부": [
    { name: "유은비", img: "../img/miniprofile/miniprofile03.png" },
    { name: "임희원", img: "../img/miniprofile/miniprofile04.png" },
    { name: "김보미", img: "../img/miniprofile/miniprofile05.png" },
    { name: "김현진", img: "../img/miniprofile/miniprofile06.png" },
    { name: "박서희", img: "../img/miniprofile/miniprofile07.png" },
    { name: "백진주", img: "../img/miniprofile/miniprofile08.png" },
    { name: "윤정원", img: "../img/miniprofile/miniprofile09.png" },
    { name: "이연우", img: "../img/miniprofile/miniprofile10.png" },
    { name: "조범규", img: "../img/miniprofile/miniprofile11.png" },
    { name: "최서윤", img: "../img/miniprofile/miniprofile12.png" }
  ],
  "기획부": [
    { name: "김도희", img: "../img/miniprofile/miniprofile13.png" },
    { name: "반상우", img: "../img/miniprofile/miniprofile14.png" },
    { name: "김윤주", img: "../img/miniprofile/miniprofile15.png" },
    { name: "김현지", img: "../img/miniprofile/miniprofile16.png" },
    { name: "박순후", img: "../img/miniprofile/miniprofile17.png" },
    { name: "손예진", img: "../img/miniprofile/miniprofile18.png" },
    { name: "이현서", img: "../img/miniprofile/miniprofile19.png" }
  ],
  "편집부": [
    { name: "정유민", img: "../img/miniprofile/miniprofile20.png" },
    { name: "박미소", img: "../img/miniprofile/miniprofile21.png" },
    { name: "고현희", img: "../img/miniprofile/miniprofile22.png" },
    { name: "박기연", img: "../img/miniprofile/miniprofile23.png" },
    { name: "이새연", img: "../img/miniprofile/miniprofile24.png" },
    { name: "이채민", img: "../img/miniprofile/miniprofile25.png" },
    { name: "황서진", img: "../img/miniprofile/miniprofile26.png" }
  ],
  "멀티부": [
    { name: "권용우", img: "../img/miniprofile/miniprofile27.png" },
    { name: "조서영", img: "../img/miniprofile/miniprofile28.png" },
    { name: "김선정", img: "../img/miniprofile/miniprofile29.png" },
    { name: "김지수", img: "../img/miniprofile/miniprofile30.png" },
    { name: "곽초은", img: "../img/miniprofile/miniprofile31.png" },
    { name: "오효진", img: "../img/miniprofile/miniprofile32.png" },
    { name: "황지원", img: "../img/miniprofile/miniprofile33.png" }
  ],
  "홍보부": [
    { name: "최희선", img: "../img/miniprofile/miniprofile34.png" },
    { name: "오우진", img: "../img/miniprofile/miniprofile35.png" },
    { name: "김루나", img: "../img/miniprofile/miniprofile36.png" },
    { name: "박지수", img: "../img/miniprofile/miniprofile37.png" },
    { name: "양윤보", img: "../img/miniprofile/miniprofile38.png" },
    { name: "이주연", img: "../img/miniprofile/miniprofile39.png" },
    { name: "정예원", img: "../img/miniprofile/miniprofile40.png" }
  ],
  "포스터부": [
    { name: "서동현", img: "../img/miniprofile/miniprofile41.png" },
    { name: "강유림", img: "../img/miniprofile/miniprofile42.png" },
    { name: "김민정", img: "../img/miniprofile/miniprofile43.png" },
    { name: "나원호", img: "../img/miniprofile/miniprofile44.png" },
    { name: "노채린", img: "../img/miniprofile/miniprofile45.png" },
    { name: "이소현", img: "../img/miniprofile/miniprofile46.png" },
    { name: "이채현", img: "../img/miniprofile/miniprofile47.png" }
  ]
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
