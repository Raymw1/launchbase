const modalOverlay = document.querySelector(".modal-overlay");
const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    modalOverlay.classList.add("active");
  });
});

document.querySelector(".modal-overlay a.close-modal").addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });
