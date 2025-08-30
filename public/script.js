const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

let scrollIndex = 0;

function scrollCarousel(direction) {
  const container = document.getElementById("carousel");
  const cardsPerView = 3;
  const card = container.querySelector(".location-card");

  if (!card) return;

  const cardStyle = window.getComputedStyle(card);
  const cardMargin = 30;
  const cardWidth = card.offsetWidth + cardMargin;

  const totalCards = container.children.length;
  const maxIndex = Math.ceil(totalCards / cardsPerView) - 1;

  scrollIndex += direction;
  scrollIndex = Math.max(0, Math.min(scrollIndex, maxIndex));

  const scrollAmount = scrollIndex * cardWidth * cardsPerView;

  container.scrollTo({
    left: scrollAmount,
    behavior: "smooth"
  });

  updateButtons(maxIndex);
}

function updateButtons(maxIndex) {
  const leftBtn = document.querySelector(".carousel-btn.left");
  const rightBtn = document.querySelector(".carousel-btn.right");

  leftBtn.classList.toggle("hidden", scrollIndex === 0);
  rightBtn.classList.toggle("hidden", scrollIndex === maxIndex);
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("carousel");
  const totalCards = container.children.length;
  const cardsPerView = 3;
  const maxIndex = Math.ceil(totalCards / cardsPerView) - 1;

  updateButtons(maxIndex);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});
