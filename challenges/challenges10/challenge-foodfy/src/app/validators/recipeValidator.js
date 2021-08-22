const { verifyForm, parseToArray } = require("../../lib/utils");
const Chef = require("../model/Chef");
const Recipe = require("../model/Recipe");
const recipeServices = require("../services/recipeServices");
const { getRecipe } = require("../services/recipeServices");

module.exports = {
  async post(req, res, next) {
    const chefs = await Chef.findAll();
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
    const chefs = await Chef.findAll();
    const emptyFields = verifyForm(req.body);
    const recipe = await recipeServices.load("getRecipe", { id: req.body.id })
    const data = { recipe: {...emptyFields?.user, ingredients: parseToArray(emptyFields?.user.ingredients), images: recipe.images, preparation: parseToArray(emptyFields?.user.preparation) }, error: emptyFields?.error};
    if (emptyFields) return res.render("admin/recipes/edit", { user: req.user, ...data, chefs});
    next()
  }
}