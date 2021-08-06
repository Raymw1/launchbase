const Mask = {
  apply(input, func) {
    setTimeout(() => {
      input.value = Mask[func](input.value);
    }, 1);
  },
  formatBRL(value) {
    value = value.replace(/\D/g, ""); // Get only digits/numbers
    return new Intl.NumberFormat("pt-BR", {
      // TO R$
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  },
};

const PhotosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: 6,
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
        const image = new Image(); // <img>
        image.src = String(reader.result);
        const div = getContainer(image);
        preview.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
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
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer();
    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement("div");
    div.classList.add("photo");
    div.onclick = PhotosUpload.removePhoto;
    div.appendChild(image);
    div.appendChild(PhotosUpload.getRemoveButton());
    return div;
  },
  getRemoveButton() {
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
    PhotosUpload.input.files = PhotosUpload.getAllFiles();
    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;
    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"');
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`;
      }
    }
    photoDiv.remove();
  },
};

const ImageGallery = {
  highlight: document.querySelector(".highlight img"),
  previews: document.querySelectorAll(".gallery-preview img"),
  setImage(event) {
    const { target } = event;
    const { highlight, previews } = ImageGallery;
    previews.forEach((image) => image.classList.remove("active"));
    target.classList.add("active");

    ImageGallery.changeAttributes(highlight, target);
    ImageGallery.changeAttributes(Lightbox.target.querySelector("img"), target);
  },
  changeAttributes(target, wantedTarget) {
    target.setAttribute("src", wantedTarget.src);
    target.setAttribute("alt", wantedTarget.alt);
  }
};

const Lightbox = {
  target: document.querySelector(".lightbox-target"),
  image: document.querySelector(".highlight img"),
  closeButton: document.querySelector(".lightbox-target a.lightbox-close"),
  open() {
    Lightbox.target.style.opacity = 1;
    Lightbox.target.style.top = 0;
    Lightbox.target.style.bottom = 0;
    Lightbox.closeButton.style.top = 0;
    preventDefault();
  },
  close() {
    Lightbox.target.style.opacity = 0;
    Lightbox.target.style.top = "-100%";
    Lightbox.target.style.bottom = "initial";
    Lightbox.closeButton.style.top = "-80px";
  }
}
