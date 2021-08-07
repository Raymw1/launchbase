const express = require("express");
const routes = express.Router();
const users = require("./app/controllers/usersController");
const recipes = require("./app/controllers/recipesController");
const chefs = require("./app/controllers/chefsController");
const multer = require("./app/middlewares/multer");

routes.get("/", users.index);
routes.get("/about", users.about);
routes.get("/recipes", users.recipes);
routes.get("/recipes/:id", users.recipe);
routes.get("/chefs", users.chefs);


routes.get("/admin", function (req, res) {
  return res.redirect("/admin/recipes")
});
routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita
routes.post("/admin/recipes", multer.array("photos", 5), recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes", multer.array("photos", 5), recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita


routes.get("/admin/chefs", chefs.index); // Mostrar a lista de receitas
routes.get("/admin/chefs/create", chefs.create); // Mostrar formulário de nova receita
routes.get("/admin/chefs/:id", chefs.show); // Exibir detalhes de uma receita
routes.get("/admin/chefs/:id/edit", chefs.edit); // Mostrar formulário de edição de receita
routes.post("/admin/chefs", chefs.post); // Cadastrar nova receita
routes.put("/admin/chefs", chefs.put); // Editar uma receita
routes.delete("/admin/chefs", chefs.delete); // Deletar uma receita


module.exports = routes;
