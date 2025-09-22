// SECTION 05: Accordion (single-open, full-bleed bg)
document.addEventListener("DOMContentLoaded", () => {
  const acc = document.getElementById("c05-accordion");
  if (!acc) return;

  const items = Array.from(acc.querySelectorAll(".c05-item"));
  const DEFAULT_OPEN_INDEX = -1;

  function setIndent(item){
    const head = item.querySelector(".c05-head");
    const name = item.querySelector(".c05-name");
    if (!head || !name) return;
    const headRect = head.getBoundingClientRect();
    const nameRect = name.getBoundingClientRect();
    const indent = Math.max(0, Math.round(nameRect.left - headRect.left));
    item.style.setProperty("--c05-indent", indent + "px");
  }

  function openItem(item) {
    const head  = item.querySelector(".c05-head");
    const panel = item.querySelector(".c05-panel");
    const inner = item.querySelector(".c05-inner");

    setIndent(item);

    item.classList.add("is-open");
    head.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");

    // animate height
    panel.style.maxHeight = "0px";
    requestAnimationFrame(() => {
      panel.style.maxHeight = inner.scrollHeight + "px";
    });

    // adjust after image loads
    panel.querySelectorAll("img").forEach(img => {
      if (img.complete) return;
      img.addEventListener("load", () => {
        panel.style.maxHeight = inner.scrollHeight + "px";
      });
    });
  }

  function closeItem(item) {
    const head  = item.querySelector(".c05-head");
    const panel = item.querySelector(".c05-panel");
    item.classList.remove("is-open");
    head.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    panel.style.maxHeight = "0px";
  }

  // init
  items.forEach((item) => {
    const head = item.querySelector(".c05-head");
    const panel = item.querySelector(".c05-panel");
    head.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    panel.style.maxHeight = "0px";

    head.addEventListener("click", () => {
      const isOpen = head.getAttribute("aria-expanded") === "true";
      items.forEach(closeItem);
      if (!isOpen) openItem(item);
    });

    // keyboard support (Enter/Space)
    head.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        head.click();
      }
    });
  });

  if (DEFAULT_OPEN_INDEX >= 0 && items[DEFAULT_OPEN_INDEX]) {
    openItem(items[DEFAULT_OPEN_INDEX]);
  }

  // keep height on resize
  window.addEventListener("resize", () => {
    const opened = acc.querySelector(".c05-item.is-open");
    if (!opened) return;
    const panel = opened.querySelector(".c05-panel");
    const inner = opened.querySelector(".c05-inner");
    setIndent(opened);
    panel.style.maxHeight = inner.scrollHeight + "px";
  });
});
