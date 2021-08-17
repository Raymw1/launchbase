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
    const is_admin = req.user?.is_admin;
    let data = {...emptyFields, is_admin}
    if (emptyFields) return res.render("admin/users/create", data);
    const { name, email, password, passwordRepeat } = req.body;
    const user = await User.findOne({ where: { email } });
    data = {...req.body, is_admin}
    const reqBody = { name, email}
    if (user) return res.render("admin/users/create", { user: reqBody, data, error: "Email já cadastrado!" });
    if (password != passwordRepeat) return res.render("admin/users/create", { user: reqBody, data, error: "Senhas diferentes, tente novamente!" });
    next();
  },
  async update(req, res, next) {
    const emptyFields = verifyForm(req.body);
    let data = { userData: {...emptyFields?.user, id: req.params.id}, error: emptyFields?.error}
    if (emptyFields) return res.render("admin/users/edit", { user: req.user, ...data});
    const { email } = req.body;
    let user = await User.findOne({ where: { email }, "and not": { id: req.params.id } });
    data = {...req.body, id: req.params.id}
    if (user) return res.render("admin/users/edit", { userData: data, user: req.user, error: "Email já cadastrado!" });
    next();
  }
}