const modalOverlay = document.querySelector(".modal-overlay");
const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const videoId = card.getAttribute("id");
    modalOverlay.querySelector("iframe").src = `https://www.youtube.com/embed/${videoId}`;
    modalOverlay.classList.add("active");
  });
});

document.querySelector(".modal-overlay a.close-modal").addEventListener("click", () => {
    modalOverlay.querySelector("iframe").src = '';
    modalOverlay.classList.remove("active");
});

