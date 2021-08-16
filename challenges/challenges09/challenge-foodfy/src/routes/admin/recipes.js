const express = require("express");
const routes = express.Router();
const recipes = require("../../app/controllers/admin/recipesController");
const multer = require("../../app/middlewares/multer");
const { onlyUsers } = require("../../app/middlewares/session");


routes.get("/", onlyUsers, recipes.index); // Mostrar a lista de receitas
routes.get("/create", onlyUsers, recipes.create); // Mostrar formulário de nova receita
routes.get("/:id", onlyUsers, recipes.show); // Exibir detalhes de uma receita
routes.get("/:id/edit", onlyUsers, recipes.edit); // Mostrar formulário de edição de receita
routes.post("/", onlyUsers, multer.array("photos", 5), recipes.post); // Cadastrar nova receita
routes.put("/", onlyUsers, multer.array("photos", 5), recipes.put); // Editar uma receita
routes.delete("/", onlyUsers, recipes.delete); // Deletar uma receita

module.exports = routes;