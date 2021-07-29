document.querySelector("#form-delete").addEventListener("submit", (event) => {
    const confirmation = confirm("Deseja realmente deletar?");
    if (!confirmation) {
        event.preventDefault();
    }
})