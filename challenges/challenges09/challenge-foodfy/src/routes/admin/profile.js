const express = require("express");
const routes = express.Router();
const { onlyUsers } = require("../../app/middlewares/session");
const userValidator = require("../../app/validators/userValidator");
const UserController = require("../../app/controllers/admin/UserController");
// const chefs = require("../../app/controllers/admin/chefsController");

routes.get("/", onlyUsers, userValidator.show, UserController.show);
routes.put("/", onlyUsers, userValidator.update, UserController.update);

module.exports = routes;