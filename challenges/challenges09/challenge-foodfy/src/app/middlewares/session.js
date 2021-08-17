const User = require("../model/User");

async function onlyUsers (req, res, next) {
  const id = req.session.userId
  if (!req.session.userId) return res.redirect("/admin/users/login");
  const user = await User.findOne({ where: { id } });
  if (!user) return res.render("admin/users/login", { error: "Usuário não cadastrado!" });
  req.user = user;
  next();
}

async function onlyAdmins (req, res, next) {
  const id = req.session.userId
  if (!req.session.userId) return res.redirect("/admin/users/login");
  const user = await User.findOne({ where: { id } });
  if (!user) return res.render("admin/users/login", { error: "Usuário não cadastrado!" });
  if (!user.is_admin) return res.render("admin/profile/index", { user: user, error: "Você não tem permissão para entrar nesta área!" });
  req.user = user;
  next();
}

function isLoggedRedirectToProfile(req, res, next) {
  if (req.session.userId) return res.redirect("/admin/profile");
  next();
}

async function checkIfIsAdminToCreate(req, res, next) {
  const id = req.session.userId
  if (id) {
    const user = await User.findOne({ where: { id } });
    req.user = user.is_admin ? user : null;
  };
  next();
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToProfile,
  onlyAdmins,
  checkIfIsAdminToCreate
}