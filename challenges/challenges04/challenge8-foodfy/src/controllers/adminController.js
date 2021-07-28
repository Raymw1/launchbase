const fs = require("fs");
const data = require("../model/data.json");
const { parseToArray, verifyForm } = require("./utils/utils");

exports.index = function (req, res) {
  return res.render("admin/index", { recipes: data.recipes });
};

exports.show = function (req, res) {
  const recipeId = req.params.id;
  const recipe = data.recipes.find((recipe) => recipe.id == recipeId);
  if (!recipe) {
    return res.send("Recipe not found");
  }
  return res.render("admin/show", { recipe });
};

exports.create = function (req, res) {
  return res.render("admin/create");
};

exports.post = function (req, res) {
  verifyForm(req, res);

  const lastId = data.recipes[data.recipes.length - 1]?.id;
  const id = lastId + 1 || 1;

  const recipe = {
    id,
    ...req.body,
    ingredients: parseToArray(req.body.ingredients),
    preparation: parseToArray(req.body.preparation)
  };
  data.recipes.push(recipe);
  fs.writeFile("src/model/data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Write file error!");
    return res.redirect(`recipes/${id}`);
  })
};

exports.edit = function (req, res) {
  const { id } = req.params;
  const recipe = data.recipes.find(recipe => recipe.id == id);
  if (!recipe) {
    return res.send("Recipe not found!")
  }
  return res.render("admin/edit", { recipe })
}

exports.put = function (req, res) {
  verifyForm(req, res);
  const { id } = req.body;
  let index = 0;
  const foundRecipe = data.recipes.find((recipe, recipeIndex) => {
    if (recipe.id == id) {
      index = recipeIndex;
      return true
    }
  });
  if (!foundRecipe) return res.send("Recipe not found!");
  const recipe = {
    ...foundRecipe,
    ...req.body,
    ingredients: parseToArray(req.body.ingredients),
    preparation: parseToArray(req.body.preparation)
  }
  data.recipes[index] = recipe;
  fs.writeFile("src/model/data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Write file error!");
    return res.redirect(`/admin/recipes/${id}`);
  })
}

exports.delete = function (req, res) {
  const { id } = req.body;
  const recipes = data.recipes.filter(recipe => recipe.id != id);
  data.recipes = recipes;
  fs.writeFile("src/model/data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Write file error!");
    return res.redirect(`/admin/recipes/`);
  })
}
