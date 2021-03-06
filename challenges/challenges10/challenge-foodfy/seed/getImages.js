const { createApi } = require("unsplash-js");
const fs = require('fs');
const fetch = require("node-fetch");
const unsplash = createApi({ accessKey: 'OTmC8R-g_USJiiRtPob2EMpAsdM8LLbjFwdl2Ym1TZU', fetch });

async function changePhotoName(photoName) {
  photoName = photoName.split(" ");
  photoName.push(".jpeg");
  return photoName = photoName.join("");
}

async function downloadImage(url, photoName) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  return fs.writeFile(`./public/assets/images/${photoName}`, buffer, () => {});
}

async function getImages(collectionIds, chefs = false) {
  const results = await unsplash.photos.getRandom({ collectionIds });
  const photo = results.response;
  let photoName = await changePhotoName(photo.alt_description);
  let url = chefs ? photo.urls.thumb : photo.urls.full;
  await downloadImage(url, photoName);
  return photoName;
}

module.exports = getImages;
