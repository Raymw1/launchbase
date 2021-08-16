const express = require("express");
const routes = express.Router();
const recipes = require("../../app/controllers/admin/recipesController");
const multer = require("../../app/middlewares/multer");
const { getUser } = require("../../app/middlewares/session");


routes.get("/", getUser, recipes.index); // Mostrar a lista de receitas
routes.get("/create", getUser, recipes.create); // Mostrar formulário de nova receita
routes.get("/:id", getUser, recipes.show); // Exibir detalhes de uma receita
routes.get("/:id/edit", getUser, recipes.edit); // Mostrar formulário de edição de receita
routes.post("/", multer.array("photos", 5), recipes.post); // Cadastrar nova receita
routes.put("/", multer.array("photos", 5), recipes.put); // Editar uma receita
routes.delete("/", recipes.delete); // Deletar uma receita

module.exports = routes;