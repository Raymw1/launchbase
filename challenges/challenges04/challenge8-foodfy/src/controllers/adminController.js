const fs = require("fs");
const data = require("../model/data.json");

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
  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    if (Array.isArray(req.body[key])) {
      req.body[key].forEach((input) => {
        if (input.trim() === "") {
          return res.send(`Erro, por favor insira todos os campos!`);
        }
      });
    } else if (req.body[key].trim() === "") {
      return res.send(`Erro, por favor insira todos os campos!`);
    }
  });

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

function parseToArray(variable) {
  if (!Array.isArray(variable)) {
    return [variable];
  }
  return variable;
}
