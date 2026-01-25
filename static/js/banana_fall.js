document.addEventListener("DOMContentLoaded", () => {
  const container = document.createElement("div");
  container.className = "banana-fall";
  document.body.appendChild(container);

  const BANANA_COUNT = 20;

  for (let i = 0; i < BANANA_COUNT; i++) {
    const b = document.createElement("div");
    b.className = "banana";
    b.textContent = "🍌";
    b.style.left = Math.random() * 100 + "vw";
    b.style.animationDelay = Math.random() * 10 + "s";
    container.appendChild(b);
  }
});
