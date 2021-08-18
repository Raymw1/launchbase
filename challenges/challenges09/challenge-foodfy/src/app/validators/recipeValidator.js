const { verifyForm, parseToArray } = require("../../lib/utils");
const Recipe = require("../model/Recipe");

module.exports = {
  async post(req, res, next) {
    const chefs = (await Recipe.chefSelectOptions()).rows;
    const noImage = req.files.length == 0;
    req.body.ingredients = parseToArray(req.body.ingredients);
    if (noImage) return res.render("admin/recipes/create", { user: req.user, recipe: req.body, chefs, error: "Insira pelo menos uma imagem!"});
    const emptyFields = verifyForm(req.body);
    const data = { recipe: {...emptyFields?.user, ingredients: parseToArray(emptyFields?.user.ingredients) }, error: emptyFields?.error};
    if (emptyFields) return res.render("admin/recipes/create", { user: req.user, ...data, chefs});
    next()
  }
}