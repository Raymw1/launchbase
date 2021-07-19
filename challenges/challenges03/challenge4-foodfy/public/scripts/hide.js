const hideBtns = document.querySelectorAll("a.hide-info");

hideBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const elementToHide = btn.parentElement.nextElementSibling;
        if (elementToHide.classList.contains("hidden")) {
            elementToHide.classList.remove("hidden");
        }   else {
            elementToHide.classList.add("hidden");
        }
    })
})
