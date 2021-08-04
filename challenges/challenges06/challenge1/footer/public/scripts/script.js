const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("click", () => {
        const iframeId = card.getAttribute("id")
        // modalOverlay.querySelector("iframe").src = `https://blog.rocketseat.com.br/${iframeId}/`;
        // modalOverlay.classList.add("active");
        window.location.href = `/course/${iframeId}`;
    })
});
