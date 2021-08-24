const { compare } = require("bcryptjs");

const { checkIfIsAdminToCreate } = require("../middlewares/session");

const User = require("../model/User");
const { verifyForm } = require("../../lib/utils");

module.exports = {
  async update(req, res, next) {
    const emptyFields = verifyForm(req.body);
    await checkIfIsAdminToCreate(req, res, () => {});
    const is_admin = req.user?.is_admin;
    let user = {...emptyFields, is_admin}
    if (emptyFields) return res.render("admin/profile/index", user);
    const { name, email, password } = req.body;
    user = {...req.body, is_admin}
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailFormat)) return res.render("admin/profile/index", { user, error: "Insira um email válido" });
    const { userId: id } = req.session;
    user = await User.findOne({ where: { email }, "and not": { id } });
    let data = {...req.body, is_admin};
    if (user) return res.render("admin/profile/index", { user: data, error: "Email já cadastrado!" });
    user = await User.find(id);
    data = {...req.body, is_admin};
    const passed = await compare(password, user.password);
    if (!passed) return res.render("admin/profile/index", { user: data, error: "Por favor, insira corretamente sua senha!" });
    req.user = user;
    next();
  }
}