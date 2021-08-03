const newFieldBtns = document.querySelectorAll("a.new-field");
newFieldBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const lastInput = btn.previousElementSibling.lastElementChild;
        if (lastInput.value.trim() === '') {
            lastInput.setAttribute("placeholder", "Por favor, insira o campo atual");
        }   else {
            let newInput = lastInput.cloneNode(true);
            btn.previousElementSibling.append(newInput)
            btn.previousElementSibling.lastElementChild.value = "";
        }
    })
})
