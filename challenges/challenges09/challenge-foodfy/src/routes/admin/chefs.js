const express = require("express");
const routes = express.Router();
const chefs = require("../../app/controllers/admin/chefsController");
const multer = require("../../app/middlewares/multer");
const { onlyUsers } = require("../../app/middlewares/session");



routes.get("/", onlyUsers, chefs.index); // Mostrar a lista de receitas
routes.get("/create", onlyUsers, chefs.create); // Mostrar formulário de nova receita
routes.get("/:id", onlyUsers, chefs.show); // Exibir detalhes de uma receita
routes.get("/:id/edit", onlyUsers, chefs.edit); // Mostrar formulário de edição de receita
routes.post("/", onlyUsers, multer.array("avatar", 1), chefs.post); // Cadastrar nova receita
routes.put("/", onlyUsers, multer.array("avatar", 1), chefs.put); // Editar uma receita
routes.delete("/", onlyUsers, chefs.delete); // Deletar uma receita

module.exports = routes;