const Chef = require("../model/Chef");
const Recipe = require("../model/Recipe");
const chefServices = require("../services/chefServices");
const recipeServices = require("../services/recipeServices");


module.exports = {
  async index(req, res) {
    const { rows } = await Recipe.all();
    let recipes = await recipeServices.recipesWithImages(rows, req);
    while (recipes.length > 6) {
      recipes.pop();
    }
    return res.render("public/index", { recipes });
  },
  about(req, res) {
    return res.render("public/about");
  },
  async recipes(req, res) {
    let { filter, page, limit } = req.query;
    page = page || 1;
    limit = limit || 6;
    let offset = limit * (page - 1);
    const params = {
      filter,
      page,
      limit,
      offset,
    };
    const { rows } = (await Recipe.paginate(params));
    let total = rows[0]?.total || 0;
    const pagination = {
      total: Math.ceil(total / limit),
      page,
    };
    const recipes = await recipeServices.recipesWithImages(rows, req);
    return res.render("public/recipes", { recipes, filter, pagination });
  },
  async recipe(req, res) {
    const { recipe, images } = await recipeServices.getRecipe(req);
    if (!recipe) {
      return res.send("Recipe not found");
    }
    return res.render("public/recipe", { recipe, images });
  },
  async chefs(req, res) {
    const { rows } = await Chef.all();
    const chefs = await chefServices.getChefs(rows, req);
    return res.render("public/chefs", { chefs });
  },
};
