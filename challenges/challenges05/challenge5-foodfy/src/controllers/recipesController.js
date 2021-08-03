const Recipe = require("../model/Recipe");
const { parseToArray, verifyForm } = require("../lib/utils");

module.exports = {
  index(req, res) {
    Recipe.all(function (recipes) {
      return res.render("recipes/index", { recipes });
    })
  },
  show(req, res) {
    Recipe.find(req.params.id, function (recipe) {
      if (!recipe) {
        return res.send("Recipe not found");
      }
      return res.render("recipes/show", { recipe });
    })
  },
  create(req, res) {
    Recipe.chefSelectOptions(function(chefs) {
      return res.render("recipes/create", { chefs });
    })
  },
  post(req, res) {
    verifyForm(req, res);
    Recipe.create(req.body, function (id) {
      return res.redirect(`/admin/recipes/${id}`);
    })
  },
  edit(req, res) {
    Recipe.find(req.params.id, function (recipe) {
      if (!recipe) {
        return res.send("Recipe not found");
      }
      Recipe.chefSelectOptions(function(chefs) {
        return res.render("recipes/edit", { recipe, chefs });
      })
    })
  },
  put(req, res) {
    verifyForm(req, res);
    Recipe.update(req.body, function () {
      return res.redirect(`/admin/recipes/${req.body.id}`);
    });
  },
  delete(req, res) {
    Recipe.delete(req.body.id, function () {
      return res.redirect(`/admin/recipes/`);
    });
  }
};
