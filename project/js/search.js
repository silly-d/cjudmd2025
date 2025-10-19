import { sliderData } from "./sliderData.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchInput = this.querySelector('input[type="search"]');
      const keyword = searchInput.value.trim().toLowerCase();

      if (!keyword) return;

      const foundProject = sliderData.find((project) => {
        const title = (project.projectTitle || project.title).toLowerCase();
        if (title === keyword) return true;
        if (project.members && project.members.some((name) => name.replace(/\s/g, "").toLowerCase() === keyword)) {
          return true;
        }
        return false;
      });

      if (foundProject) {
        const projectTitle = foundProject.projectTitle || foundProject.title;
        const slideElements = document.querySelectorAll(".slide");

        let targetSlide = null;
        slideElements.forEach((slide) => {
          const titleElement = slide.querySelector(".project-title");
          if (titleElement && titleElement.textContent.trim() === projectTitle) {
            targetSlide = slide;
          }
        });

        if (targetSlide) {
          const searchEvent = new CustomEvent("search:found", {
            detail: { targetSlide },
          });
          document.dispatchEvent(searchEvent);

          targetSlide.style.transition = "box-shadow 0.3s ease-in-out";
          targetSlide.style.boxShadow = "0 0 30px 50px rgba(255, 60, 118, 0.5)";

          setTimeout(() => {
            targetSlide.style.boxShadow = "";
          }, 2000);
        } else {
          alert("프로젝트를 화면에서 찾을 수 없습니다.");
        }
      } else {
        alert("해당 프로젝트 또는 디자이너를 찾을 수 없습니다.");
      }
    });
  }
});
