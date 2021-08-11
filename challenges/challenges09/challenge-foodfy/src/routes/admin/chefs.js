const express = require("express");
const routes = express.Router();
const chefs = require("../../app/controllers/admin/chefsController");
const multer = require("../../app/middlewares/multer");



routes.get("/", chefs.index); // Mostrar a lista de receitas
routes.get("/create", chefs.create); // Mostrar formulário de nova receita
routes.get("/:id", chefs.show); // Exibir detalhes de uma receita
routes.get("/:id/edit", chefs.edit); // Mostrar formulário de edição de receita
routes.post("/", multer.array("avatar", 1), chefs.post); // Cadastrar nova receita
routes.put("/", multer.array("avatar", 1), chefs.put); // Editar uma receita
routes.delete("/", chefs.delete); // Deletar uma receita

module.exports = routes;