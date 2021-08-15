const { verifyForm } = require("../../lib/utils");
const User = require("../model/User");

module.exports = {
  async show(req, res, next) {
    const { userId: id } = req.session;
    const user = await User.findOne({ where: { id } });
    if (!user) return res.render("admin/users/create", { error: "Usuário não encontrado!" });
    req.user = user;
    next();
  },
  async post(req, res, next) {
    const emptyFields = verifyForm(req.body);
    if (emptyFields) return res.render("admin/users/create", emptyFields);
    const { email, password, passwordRepeat } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) return res.render("admin/users/create", { user: req.body, error: "Email já cadastrado!" });
    if (password != passwordRepeat) return res.render("admin/users/create", { user: req.body, error: "Senhas diferentes, tente novamente!" });
    next();
  }
}