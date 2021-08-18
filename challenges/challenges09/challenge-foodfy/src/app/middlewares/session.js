const Recipe = require("../model/Recipe");
const User = require("../model/User");
const { getRecipe } = require("../services/recipeServices");

async function onlyUsers(req, res, next) {
  const id = req.session.userId;
  if (!req.session.userId) return res.redirect("/admin/users/login");
  const user = await User.findOne({ where: { id } });
  if (!user)
    return res.render("admin/users/login", {
      error: "Usuário não cadastrado!",
    });
  req.user = user;
  next();
}

async function onlyAdmins(req, res, next) {
  const id = req.session.userId;
  if (!req.session.userId) return res.redirect("/admin/users/login");
  const user = await User.findOne({ where: { id } });
  if (!user)
    return res.render("admin/users/login", {
      error: "Usuário não cadastrado!",
    });
  if (!user.is_admin)
    return res.render("admin/profile/index", {
      user: user,
      error: "Você não tem permissão para entrar nesta área!",
    });
  req.user = user;
  next();
}

function isLoggedRedirectToProfile(req, res, next) {
  if (req.session.userId) return res.redirect("/admin/profile");
  next();
}

async function checkIfIsAdminToCreate(req, res, next) {
  const id = req.session.userId;
  if (id) {
    const user = await User.findOne({ where: { id } });
    req.user = user.is_admin ? user : null;
  }
  next();
}

async function checkIfIsOfOwnUserOrAdmin(req, res, next) {
  const recipe = (await Recipe.find(req.body.id || req.params.id)).rows[0];
  if (recipe.user_id != req.session.userId && !req.user.is_admin)
    return res.render("admin/profile/index", {
      user: req.user,
      error: "Você não tem permissão para editar essa receita!",
    });
  req.user.isAllowed = true;
  req.recipe = recipe;
  next()
}

async function checkIfIsAllowedToChange(req, res, next) {
  const { recipe, images } = await getRecipe(req, res);
  if (recipe.user_id == req.session.userId || req.user.is_admin) req.user.isAllowed = true;
  req.recipe = recipe;
  next()
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToProfile,
  onlyAdmins,
  checkIfIsAdminToCreate,
  checkIfIsOfOwnUserOrAdmin,
  checkIfIsAllowedToChange
};
