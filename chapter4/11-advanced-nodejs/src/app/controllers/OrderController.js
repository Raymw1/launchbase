const mailer = require("../../lib/mailer");

const User = require("../models/User");

const LoadProductService = require("../services/LoadProductService");

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
  async post(req, res) {
    try {
      const product = await LoadProductService.load("product", { where: { id: req.body.id } });
      const seller = await User.find(product.user_id);
      const buyer = await User.find(req.session.userId);
      await mailer.sendMail({
        to: seller.email,
        from: 'no-reply@launchstore.com.br',
        subject: "Novo pedido de compra",
        html: email(seller, product, buyer)
      })
      return res.render("orders/success")
    } catch (err) {
      console.error(err);
      return res.render("orders/error")
    }
  }
}