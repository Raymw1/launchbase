const Chef = require("../model/Chef");
const Recipe = require("../model/Recipe");

module.exports = {
  async index(req, res) {
    let recipes = (await Recipe.all()).rows;
    while (recipes.length > 6) {
      recipes.pop();
    }
    return res.render("users/index", { recipes });
  },
  about(req, res) {
    return res.render("users/about");
  },
  async recipes(req, res) {
    let { filter, page, limit } = req.query;
    page = page || 1;
    limit = limit || 2;
    let offset = limit * (page - 1);
    const params = {
      filter,
      page,
      limit,
      offset,
    };
    const recipes = (await Recipe.paginate(params)).rows;
    let total = recipes[0]?.total || 0;
    const pagination = {
      total: Math.ceil(total / limit),
      page,
    };
    return res.render("users/recipes", { recipes, filter, pagination });
  },
  async recipe(req, res) {
    const recipe = (await Recipe.find(req.params.id)).rows[0];
    if (!recipe) {
      return res.send("Recipe not found");
    }
    return res.render("users/recipe", { recipe });
  },
  async chefs(req, res) {
    const chefs = (await Chef.all()).rows;
    return res.render("users/chefs", { chefs });
  },
};
