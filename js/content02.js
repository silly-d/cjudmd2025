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