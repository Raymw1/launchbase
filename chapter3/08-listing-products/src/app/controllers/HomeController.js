const { formatPrice } = require("../../lib/utils");
const Product = require("../models/Product");
const File = require("../models/File");

module.exports = {
  async index(req, res) {
    let products = (await Product.all()).rows;
    if (!products) return res.send("Products not found!");

    async function getImage(productId) {
      let results = await Product.files(productId);
      const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`);
      return files[0];
    }
    const productsPromise = products.map(async product => {
      product.image = await getImage(product.id);
      product.price = formatPrice(product.price);
      product.old_price = formatPrice(product.old_price);
      return product;
    }).filter((product, index) => index > 2 ? false : true)
    products = await Promise.all(productsPromise);
    return res.render("home/index.njk", { products })
  }
}