document.addEventListener("DOMContentLoaded", () => {
  const slot = document.getElementById("c01-photo");
  if (!slot) return;

  const IMAGES = [
    "../img/hero/hero01.png",
    "../img/hero/hero02.png",
    "../img/hero/hero03.png",
    "../img/hero/hero04.png",
    "../img/hero/hero05.png",
    "../img/hero/hero06.png",
  ];

  let i = 0;
  slot.style.backgroundImage = `url('${IMAGES[i]}')`;

  setInterval(() => {
    i = (i + 1) % IMAGES.length;
    slot.style.backgroundImage = `url('${IMAGES[i]}')`;
  }, 100);
});
