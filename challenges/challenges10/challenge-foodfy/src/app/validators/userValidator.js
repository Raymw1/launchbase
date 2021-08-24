const { verifyForm } = require("../../lib/utils");
const { compare } = require("bcryptjs");
const User = require("../model/User");
const { checkIfIsAdminToCreate } = require("../middlewares/session");

module.exports = {
  async show(req, res, next) {
    const { userId: id } = req.session;
    const user = await User.find(id);
    if (!user) return res.render("admin/users/create", { error: "Usuário não encontrado!" });
    req.user = user;
    next();
  },
  async post(req, res, next) {
    const emptyFields = verifyForm(req.body);
    await checkIfIsAdminToCreate(req, res, () => {});
    const is_admin = req.user?.is_admin;
    if (emptyFields) return res.render("admin/users/create", { data: emptyFields.user, error: emptyFields.error, is_admin});
    const { name, email, password, passwordRepeat } = req.body;
    const reqBody = { name, email}
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailFormat)) return res.render("admin/users/create", { data: reqBody, is_admin, error: "Insira um email válido" });
    const user = await User.findOne({ where: { email } });
    if (user) return res.render("admin/users/create", { data: reqBody, is_admin, error: "Email já cadastrado!" });
    if (password != passwordRepeat) return res.render("admin/users/create", { data: reqBody, is_admin, error: "Senhas diferentes, tente novamente!" });
    next();
  },
  async update(req, res, next) {
    const emptyFields = verifyForm(req.body);
    let data = { data: {...emptyFields?.user, id: req.params.id}, error: emptyFields?.error}
    if (emptyFields) return res.render("admin/users/edit", { user: req.user, ...data});
    const { email } = req.body;
    data = {...req.body, id: req.params.id}
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailFormat)) return res.render("admin/users/edit", { data, user: req.user, error: "Insira um email válido" });
    let user = await User.findOne({ where: { email }, "and not": { id: req.params.id } });
    if (user) return res.render("admin/users/edit", { data, user: req.user, error: "Email já cadastrado!" });
    next();
  }
}