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
  cpfCnpj(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 14) {
      value = value.slice(0, -1);
    }
    if (value.length > 11) {
      value = value.replace(/(\d{2})(\d)/, "$1.$2"); // '11.222333444455'
      value = value.replace(/(\d{3})(\d)/, "$1.$2"); // '11.222.333444455'
      value = value.replace(/(\d{3})(\d)/, "$1/$2"); // '11.222.333/444455'
      value = value.replace(/(\d{4})(\d)/, "$1-$2"); // '11.222.333/4444-55'
    } else {
      value = value.replace(/(\d{3})(\d)/, "$1.$2"); // '112.22333444'
      value = value.replace(/(\d{3})(\d)/, "$1.$2"); // '112.223.33444'
      value = value.replace(/(\d{3})(\d)/, "$1-$2"); // '112.223.334-44'
    }
    return value;
  },
  cep(value) {
    value = value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.slice(0, -1);
    }
    value = value.replace(/(\d{5})(\d)/, "$1-$2"); // '11222-333'
    return value;
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
      alert(`Envie no m??ximo ${uploadLimit} fotos!`);
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
  },
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
  },
};

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input);
    let results = Validate[func](input.value);
    input.value = results.value;
    if (results.error) {
      Validate.displayError(input, results.error);
    }
  },
  displayError(input, error) {
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerHTML = error;
    input.parentNode.appendChild(div);
    input.focus();
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector(".error");
    if (errorDiv) {
      errorDiv.remove();
    }
  },
  isEmail(value) {
    let error = null;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!value.match(mailFormat)) {
      error = "Email inv??lido!";
    }
    return {
      error,
      value,
    };
  },
  isCpfCnpj(value) {
    let error = null;
    const cleanValues = value.replace(/\D/g, "");
    if (cleanValues.length > 11 && cleanValues.length !== 14) {
      error = 'CNPJ incorreto!';
    } else if (cleanValues.length < 12 && cleanValues.length !== 11) {
      error = 'CPF incorreto!';
    }
    return {
      error,
      value,
    };
  },
  isCep(value) {
    let error = null;
    const cleanValues = value.replace(/\D/g, "");
    if (cleanValues.length !== 8) {
      error = "CEP inv??lido!";
    }
    return {
      error,
      value,
    };
  },
  allFields(event) {
    const items = document.querySelectorAll(".item input, .item select, .item textarea");
    for (let item of items) {
      if (item.value == "" && item.name != "removed_files" && item.name != "photos") {
        event.preventDefault()
        const message = document.createElement("div");
        message.classList.add("messages");
        message.classList.add("error");
        message.innerHTML = "Por favor, preencha todos os campos";
        document.querySelector("body").append(message);
      }
    }
  }
};
