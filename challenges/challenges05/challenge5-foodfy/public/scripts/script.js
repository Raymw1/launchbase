const cards = document.querySelectorAll(".recipe-card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const recipeId = card.getAttribute("id");
    window.location.href = `/recipes/${recipeId}`;
  });
});

// =========== PAGINATION ===========

function paginate(selectedPage, totalPages) {
  let oldPage,
    pages = [];
  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;
    if (
      firstAndLastPage ||
      (pagesAfterSelectedPage && pagesBeforeSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push("...");
      } else if (oldPage && currentPage - oldPage == 2) {
        pages.push(currentPage - 1);
      }
      pages.push(currentPage);
      oldPage = currentPage;
    }
  }
  return pages;
}

function createPagination(pagination) {
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const filter = pagination.dataset.filter;
  const pages = paginate(page, total);
  let elements = "";
  for (let page of pages) {
    if (filter) {
      elements +=
        page != "..."
          ? `<a href="?page${page}&filter=${filter}">${page}</a>`
          : "<span>...</span>";
    } else {
      elements +=
        page != "..."
          ? `<a href="?page=${page}">${page}</a>`
          : "<span>...</span>";
    }
  }
  pagination.innerHTML = elements;
}

const pagination = document.querySelector(".pagination");
if (pagination) {
  createPagination(pagination);
}
