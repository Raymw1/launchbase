const { verifyForm } = require("../../lib/utils");
const { compare } = require("bcryptjs");
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
  },
  async update(req, res, next) {
    const emptyFields = verifyForm(req.body);
    if (emptyFields) return res.render("admin/profile/index", emptyFields);
    const { email, password } = req.body;
    const { userId: id } = req.session;
    let user = await User.findOne({ where: { email }, "and not": { id } });
    if (user) return res.render("admin/profile/index", { user: req.body, error: "Email já cadastrado!" });
    user = await User.findOne({ where: { id } });
    const passed = await compare(password, user.password);
    if (!passed) return res.render("admin/profile/index", { user: req.body, error: "Por favor, insira corretamente sua senha!" });
    req.user = user;
    next();
  }
}