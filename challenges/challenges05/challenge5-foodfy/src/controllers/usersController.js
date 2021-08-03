const Chef = require("../model/Chef");
const Recipe = require("../model/Recipe");

module.exports = {
  index(req, res) {
    let mostViewedRecipes = [];
    Recipe.all(function (recipes) {
      mostViewedRecipes = [...recipes];
      while (mostViewedRecipes.length > 6) {
        mostViewedRecipes.pop();
      }
      return res.render("users/index", { recipes: mostViewedRecipes });
    });
  },
  about(req, res) {
    return res.render("users/about");
  },
  recipes(req, res) {
    let { filter, page, limit } = req.query;
    page = page || 1;
    limit = limit || 2;
    let offset = limit * (page - 1);
    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        let total = recipes[0]?.total || 0
        const pagination = {
          total: Math.ceil(total / limit),
          page,
        };
        return res.render("users/recipes", { recipes, filter, pagination });
      },
    };
    Recipe.paginate(params)
  },
  recipe(req, res) {
    Recipe.find(req.params.id, function (recipe) {
      if (!recipe) {
        return res.send("Recipe not found");
      }
      return res.render("users/recipe", { recipe });
    });
  },
  chefs(req, res) {
    Chef.all(function (chefs) {
      return res.render("users/chefs", { chefs });
    });
  },
};
