const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");
const cards = document.querySelectorAll(".card");
const maxModalBtn = document.querySelector(".modal-overlay .max-modal i")

cards.forEach(card => {
    card.addEventListener("click", () => {
        const iframeId = card.getAttribute("id")
        modalOverlay.querySelector("iframe").src = `https://blog.rocketseat.com.br/${iframeId}/`;
        modalOverlay.classList.add("active");
    })
});

document.querySelector(".modal-overlay .close-modal").addEventListener("click", () => {
    modalOverlay.querySelector("iframe").src = 
    modalOverlay.classList.remove("active");
    modal.classList.remove("maximize")
    maxModalBtn.textContent = "open_in_full"
})

maxModalBtn.addEventListener("click", () => {
    if (modal.classList.contains("maximize")) {
        modal.classList.remove("maximize");
        maxModalBtn.textContent = "open_in_full"
    }   else {
        modal.classList.add("maximize")
        maxModalBtn.textContent = "minimize"
    }

})

document.querySelector(".modal-overlay")
