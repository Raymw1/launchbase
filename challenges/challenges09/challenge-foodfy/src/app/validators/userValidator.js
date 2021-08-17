const { verifyForm } = require("../../lib/utils");
const { compare } = require("bcryptjs");
const User = require("../model/User");
const { checkIfIsAdminToCreate } = require("../middlewares/session");

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
    await checkIfIsAdminToCreate(req, res, () => {});
    const { is_admin } = req.user;
    let user = {...emptyFields, is_admin}
    if (emptyFields) return res.render("admin/users/create", user);
    const { email, password, passwordRepeat } = req.body;
    user = await User.findOne({ where: { email } });
    const data = {...req.body, is_admin}
    if (user) return res.render("admin/users/create", { user: data, error: "Email já cadastrado!" });
    if (password != passwordRepeat) return res.render("admin/users/create", { user: data, error: "Senhas diferentes, tente novamente!" });
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