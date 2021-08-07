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

// =========== PHOTOS UPLOAD ===========
const PhotosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target;
    const { uploadLimit, preview, getContainer, hasLimit } = PhotosUpload;
    if (hasLimit(uploadLimit, event)) return;
    Array.from(fileList).forEach((file) => {
      PhotosUpload.files.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);
        const div = getContainer(image)
        preview.appendChild(div);
      }
      reader.readAsDataURL(file);
    })
    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  hasLimit(uploadLimit, event) {
    const { input, preview } = PhotosUpload;
    const { files: fileList } = input;
    const photosDiv = [];
    preview.childNodes.forEach((item) => {
      if (item.classList?.value == "photo") {
        photosDiv.push(item);
      }
    });
    const totalPhotos = fileList.length + photosDiv.length;
    if (totalPhotos > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos!`);
      event.preventDefault();
      return 1;
    }
    return 0;
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();
    PhotosUpload.files.forEach(file => dataTransfer.items.add(file));
    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement("div");
    div.classList.add("photo");
    div.onclick = PhotosUpload.removePhoto;
    div.appendChild(image);
    div.appendChild(PhotosUpload.getRemoveBtn());
    return div;
  },
  getRemoveBtn() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "close";
    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode;
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);
    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input = PhotosUpload.getAllFiles();
    photoDiv.remove();
  }
};
