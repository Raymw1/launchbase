const mailer = require("../../lib/mailer");

const User = require("../models/User");
const Order = require("../models/Order");

const LoadProductService = require("../services/LoadProductService");
const LoadOrderService = require("../services/LoadOrderService");
const Cart = require("../../lib/cart");

const email = (seller, product, buyer) => `
<h2>Olá ${seller.name}</h2>
<p>Você tem um novo pedido de compra do seu produto</p>
<p>Produto: ${product.name}</p>
<p>Preço: ${product.formattedPrice}</p>
<p><br/></p>
<h3>Dados do comprador</h3>
<p>${buyer.name}</p>
<p>${buyer.email}</p>
<p>${buyer.address}</p>
<p>${buyer.cep}</p>
<p><br/></p>
<p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
<p><br/></p>
<p>Atenciosamente, Equipe Launchstore</p>
`

module.exports = {
  async index(req, res) {
    try {
      const orders = await LoadOrderService.load("orders", { where: { buyer_id: req.session.userId } });
      return res.render("orders/index", { orders })
    } catch (err) {
      console.error(err);
      return res.render("cart/index", { error: "Algo inesperado ocorreu, tente novamente!" })
    }
  },
  async show(req, res) {
    const order = await LoadOrderService.load("order", { where: { id: req.params.id } });
    return res.render("orders/details", { order });
  },
  async sales(req, res) {
    try {
      const sales = await LoadOrderService.load("orders", { where: { seller_id: req.session.userId } });
      return res.render("orders/sales", { sales });
    } catch (err) {
      console.error(err);
      return res.render("cart/index", { error: "Algo inesperado ocorreu, tente novamente!" });
    }
  },
  async post(req, res) {
    try {
      const cart = Cart.init(req.session.cart);
      const buyer_id = req.session.userId;
      const filteredItems = cart.items.filter(item => item.product.user_id != buyer_id);
      const createOrdersPromise = filteredItems.map(async item => {
        let { product, price: total, quantity } = item;
        const { price, id: product_id, user_id: seller_id } = product;
        const status = "open";
        const order = await Order.create({
          seller_id, buyer_id, product_id, price, total, quantity, status
        })
        product = await LoadProductService.load("product", { where: { id: product_id } });
        const seller = await User.find(seller_id);
        const buyer = await User.find(buyer_id);
        await mailer.sendMail({
          to: seller.email,
          from: 'no-reply@launchstore.com.br',
          subject: "Novo pedido de compra",
          html: email(seller, product, buyer)
        })
        return order;
      })
      await Promise.all(createOrdersPromise);
      req.session.cart = null;
      Cart.init(req.session.cart)
      return res.render("orders/success")
    } catch (err) {
      console.error(err);
      return res.render("orders/error")
    }
  },
  async update(req, res) {
    try {
      const { id, action } = req.params;
      const acceptedActions = ["close", "cancel"];
      if (!acceptedActions.includes(action)) return res.render("cart/index", { error: "Ação foi definida incorretamente!" });
      const order = await LoadOrderService.load("order", { where: { id } });
      if (!order) return res.render("cart/index", { error: "Pedido não encontrado!" });
      if (order.status != 'open') return res.render("cart/index", { error: "Este pedido já não está mais aberto!" });
      const statuses = { close: "sold", cancel: "canceled"};
      await Order.update(id, { status: statuses[action] });
      return res.redirect("/orders/sales")
    } catch (err) {
      console.error(err);
      return res.render("cart/index", { error: "Erro inesperado, tente novamente!" });
    }
  },
}