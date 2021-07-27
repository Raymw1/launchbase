const express = require("express");
const routes = express.Router();
const recipeData = require("./model/recipes");
const users = require("./controllers/usersController");
const admin = require("./controllers/adminController");

routes.get("/", function (req, res) {
  return res.render("users/index", { recipes: recipeData });
});
routes.get("/about", users.about);
routes.get("/recipes", users.recipes);
routes.get("/recipes/:id", users.recipe);


routes.get("/admin/recipes", admin.index); // Mostrar a lista de receitas
// routes.get("/admin/recipes/create", admin.create); // Mostrar formulário de nova receita
// routes.get("/admin/recipes/:id", admin.show); // Exibir detalhes de uma receita
// routes.get("/admin/recipes/:id/edit", admin.edit); // Mostrar formulário de edição de receita
// routes.post("/admin/recipes", admin.post); // Cadastrar nova receita
// routes.put("/admin/recipes", admin.put); // Editar uma receita
// routes.delete("/admin/recipes", admin.delete); // Deletar uma receita

module.exports = routes;
