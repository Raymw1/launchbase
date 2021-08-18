const { verifyForm, parseToArray } = require("../../lib/utils");
const Recipe = require("../model/Recipe");
const { getRecipe } = require("../services/recipeServices");

module.exports = {
  async post(req, res, next) {
    const chefs = (await Recipe.chefSelectOptions()).rows;
    const noImage = req.files.length == 0;
    req.body.ingredients = parseToArray(req.body.ingredients);
    req.body.preparation = parseToArray(req.body.preparation);
    if (noImage) return res.render("admin/recipes/create", { user: req.user, files: req.files, recipe: req.body, chefs, error: "Insira pelo menos uma imagem!"});
    const emptyFields = verifyForm(req.body);
    const data = { recipe: {...emptyFields?.user, ingredients: parseToArray(emptyFields?.user.ingredients), preparation: parseToArray(emptyFields?.user.preparation) }, error: emptyFields?.error};
    if (emptyFields) return res.render("admin/recipes/create", { user: req.user, ...data, chefs});
    next()
  },
  async put(req, res, next) {
    const chefs = (await Recipe.chefSelectOptions()).rows;
    const emptyFields = verifyForm(req.body);
    const { recipe, images} = await getRecipe(req, res, req.body.id)
    const data = { recipe: {...emptyFields?.user, ingredients: parseToArray(emptyFields?.user.ingredients), preparation: parseToArray(emptyFields?.user.preparation) }, files: images, error: emptyFields?.error};
    console.log(data.files)
    if (emptyFields) return res.render("admin/recipes/edit", { user: req.user, ...data, chefs});
    next()
  }
}