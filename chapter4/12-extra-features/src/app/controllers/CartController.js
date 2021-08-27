const Cart = require("../../lib/cart");
const LoadProductService = require("../services/LoadProductService");

module.exports = {
  async index(req, res) {
    try {
      let { cart } = req.session
      return res.render("cart/index", { cart })
    } catch (err) {
      console.error(err);
    }
  },
  async addOne(req, res) {
    try {
      const { id } = req.params;
      const product = await LoadProductService.load("product", { where: { id } });
      let { cart } = req.session;
      cart = Cart.init(cart).addOne(product);
      req.session.cart = cart;
      req.session.save(err => {
        if (err) throw err;
        return res.redirect("/cart")
      });
    } catch (err) {
      console.error(err);
    }
  }
}