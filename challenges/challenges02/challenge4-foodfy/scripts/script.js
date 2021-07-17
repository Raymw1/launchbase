const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");
const cards = document.querySelectorAll(".recipe-card");

cards.forEach(card => {
    card.addEventListener("click", () => {
        const recipeTitle = card.querySelector("p").textContent;
        modal.querySelector("img").src = card.querySelector("img").src;
        modal.querySelector("img").alt = recipeTitle;
        modal.querySelector("h3").textContent = recipeTitle;
        modal.querySelector("p").textContent = card.querySelector("small").textContent;
        modalOverlay.classList.add("active");
    })
})

document.querySelector("a.close-modal").addEventListener("click", () => {
    modalOverlay.classList.remove("active");
})
