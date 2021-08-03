const Chef = require("../model/Chef");
const Recipe = require("../model/Recipe");

module.exports = {
  index(req, res) {
    let mostViewedRecipes = [];
    Recipe.all(function (recipes) {
      mostViewedRecipes = [...recipes];
      while (mostViewedRecipes.length > 6) {
        mostViewedRecipes.pop()
      }
      return res.render("users/index", { recipes: mostViewedRecipes });
    })
  },
  about(req, res) {
    return res.render("users/about");
  },
  recipes(req, res) {
    const { filter } = req.query;
    if (filter) {
      Recipe.findBy(filter, function (recipes) {
        return res.render("users/recipes", { recipes, filter });
      })
    } else {
      Recipe.all(function (recipes) {
        return res.render("users/recipes", { recipes });
      })
    }
  },
  recipe(req, res) {
    Recipe.find(req.params.id, function (recipe) {
      if (!recipe) {
        return res.send("Recipe not found");
      }
      return res.render("users/recipe", { recipe });
    })
  },
  chefs(req, res) {
    Chef.all(function (chefs) {
      return res.render("users/chefs", {chefs})
    })
  }
}