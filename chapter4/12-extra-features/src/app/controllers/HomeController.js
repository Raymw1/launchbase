const LoadProductService = require("../services/LoadProductService");

module.exports = {
  async index(req, res) {
    try {
      let products = await LoadProductService.load('products')
      products = products.filter((product, index) => index > 2 ? false : true)
      return res.render("home/index", { products })
    } catch (err) {
      console.error(err);
    }
  }
}