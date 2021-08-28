const { parseDate, formatPrice } = require("../../lib/utils");
const Product = require("../models/Product");

async function getImages(productId) {
  let files = await Product.files(productId);
  files = files.map((file) => ({
    ...file,
    src: `${file.path.replace("public", "")}`,
  }));
  return files;
}

async function format(product) {
  const files = await getImages(product.id);
  product.img = files[0].src;
  product.files = files;
  product.formattedPrice = formatPrice(product.price);
  product.formattedOldPrice = formatPrice(product.old_price);

  const { day, month, hour, minutes } = parseDate(product.updated_at);
  product.published = {
    day: `${day}/${month}`,
    hour: `${hour}h${minutes}`,
  };

  return product
}

const LoadService = {
  load(service, filters) {
    this.filters = filters;
    return this[service]();
  },
  async product() {
    try {
      let product = await Product.findOne(this.filters);
      return format(product);
    } catch (err) {
      console.error(err);
    }
  },
  async products() {
    try {
      let products = await Product.findAll(this.filters);
      const productsPromise = products.map(format);
      return Promise.all(productsPromise);
    } catch (err) {
      console.error(err);
    }
  },
  async productWithDeleted() {
    try {
      let product = await Product.findOneWithDeleted(this.filters);
      return format(product);
    } catch (err) {
      console.error(err);
    }
  },
  format,
};

module.exports = LoadService;
