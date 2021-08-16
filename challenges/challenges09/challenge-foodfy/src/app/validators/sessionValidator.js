const { verifyForm } = require("../../lib/utils");
const { compare } = require("bcryptjs");
const User = require("../model/User");

module.exports = {
  async login(req, res, next) {
    const emptyFields = verifyForm(req.body);
    if (emptyFields) return res.render("admin/users/login", emptyFields);
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.render("admin/users/login", { user: req.body, error: "Usuário não cadastrado!" });
    const passed = await compare(password, user.password);
    if (!passed) return res.render("admin/users/login", { user: req.body, error: "Por favor, insira corretamente sua senha!" });
    req.user = user;
    next();
  }
}