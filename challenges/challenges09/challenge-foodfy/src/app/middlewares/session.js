const User = require("../model/User");

function onlyUsers (req, res, next) {
  if (!req.session.userId) return res.redirect("/admin/users/login");
  next();
}

function isLoggedRedirectToProfile(req, res, next) {
  if (req.session.userId) return res.redirect("/admin/profile");
  next();
}

async function getUser(req, res, next) {
  const id = req.session.userId
  const user = await User.findOne({ where: { id } });
  if (!user)
  return res.render("session/login", { user: req.body, error: "Usuário não cadastrado!" });
  req.user = user;
  next();
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToProfile,
  getUser
}