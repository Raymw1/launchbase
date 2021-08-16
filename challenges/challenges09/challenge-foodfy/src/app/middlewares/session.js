const User = require("../model/User");

async function onlyUsers (req, res, next) {
  const id = req.session.userId
  if (!req.session.userId) return res.redirect("/admin/users/login");
  const user = await User.findOne({ where: { id } });
  if (!user) return res.render("session/login", { user: req.body, error: "Usuário não cadastrado!" });
  req.user = user;
  next();
}

function isLoggedRedirectToProfile(req, res, next) {
  if (req.session.userId) return res.redirect("/admin/profile");
  next();
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToProfile
}