const { compare } = require("bcryptjs");

const { checkIfIsAdminToCreate } = require("../middlewares/session");

const User = require("../model/User");
const { verifyForm } = require("../../lib/utils");

module.exports = {
  async update(req, res, next) {
    const emptyFields = verifyForm(req.body);
    await checkIfIsAdminToCreate(req, res, () => {});
    const is_admin = req.user?.is_admin;
    let data = {...emptyFields, is_admin}
    if (emptyFields) return res.render("admin/profile/index", data);
    const { name, email, password } = req.body;
    const { userId: id } = req.session;
    let user = await User.findOne({ where: { email }, "and not": { id } });
    data = {...req.body, is_admin}
    const reqBody = { name, email}
    if (user) return res.render("admin/profile/index", { user: reqBody, data, error: "Email já cadastrado!" });
    user = await User.findOne({ where: { id } });
    const passed = await compare(password, user.password);
    if (!passed) return res.render("admin/profile/index", { user: reqBody, data, error: "Por favor, insira corretamente sua senha!" });
    req.user = user;
    next();
  }
}