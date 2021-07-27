const express = require("express");
const routes = express.Router();
const recipes = require("./model/recipes");


routes.get("/", function (req, res) {
  return res.render("index", { recipes });
});

routes.get("/about", function (req, res) {
  return res.render("about");
});

routes.get("/recipes", function (req, res) {
  return res.render("recipes", { recipes });
});

routes.get("/recipes/:id", function (req, res) {
  const recipeId = req.params.id;
  const recipe = recipes.find((recipe) => recipe.id == recipeId);
  if (!recipe) {
    return res.send("Recipe not found");
  }
  return res.render("recipe", { recipe });
});

module.exports = routes;
