const recipeData = require("../model/recipes");

exports.about = function (req, res) {
  return res.render("users/about");
};

exports.recipes = function (req, res) {
  return res.render("users/recipes", { recipes: recipeData });
};

exports.recipe = function (req, res) {
  const recipeId = req.params.id;
  const recipe = recipeData.find((recipe) => recipe.id == recipeId);
  if (!recipe) {
    return res.send("Recipe not found");
  }
  return res.render("users/recipe", { recipe });
};
