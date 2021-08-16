const express = require("express");
const routes = express.Router();
const { onlyUsers } = require("../../app/middlewares/session");
const userValidator = require("../../app/validators/userValidator");
const ProfileController = require("../../app/controllers/admin/ProfileController");

routes.get("/", onlyUsers, userValidator.show, ProfileController.show);
routes.put("/", onlyUsers, userValidator.update, ProfileController.update);

module.exports = routes;