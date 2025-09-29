// SECTION 06: 중앙 = YouTube iframe, 양옆 썸네일은 자동(thumbnail API)
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("content06");
  if (!root) return;

  const dataNodes = Array.from(root.querySelectorAll(".c06-data > li"));
  if (dataNodes.length === 0) return;

  const leftBtn  = root.querySelector(".c06-side-left");
  const rightBtn = root.querySelector(".c06-side-right");
  const prevBr   = root.querySelector(".c06-prev");
  const nextBr   = root.querySelector(".c06-next");
  const current  = root.querySelector(".c06-current");

  // 유틸: URL에서 YouTube VIDEO_ID 추출
  function getVideoId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
      return null;
    } catch (e) { return null; }
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

  let items = dataNodes.map(li => ({
    video: li.getAttribute("data-video") || "",
    title: li.getAttribute("data-title") || "영상"
  })).filter(it => getVideoId(it.video));

  if (items.length === 0) return;

  let index = 0; // 중앙 재생 영상 인덱스

  function renderSides() {
    const n = items.length;
    const leftIdx  = (index - 1 + n) % n;
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
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    current.appendChild(iframe);
  }

  function goNext(){ index = (index + 1) % items.length; renderSides(); renderCenter(); }
  function goPrev(){ index = (index - 1 + items.length) % items.length; renderSides(); renderCenter(); }

  // 초기 렌더
  renderSides();
  renderCenter();

  // 인터랙션
  nextBr.addEventListener("click", goNext);
  prevBr.addEventListener("click", goPrev);
  rightBtn.addEventListener("click", goNext);
  leftBtn.addEventListener("click", goPrev);
});
