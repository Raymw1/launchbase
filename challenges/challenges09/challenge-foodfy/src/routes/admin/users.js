const express = require("express");
const routes = express.Router();
const UserController = require("../../app/controllers/admin/UserController");
const userValidator = require("../../app/validators/userValidator");

/* ============= REGISTER ============= */
routes.get("/register", UserController.registerForm);
routes.post("/register", userValidator.post, UserController.post);

/* ============= LOGIN ============= */
// routes.get("/login", SessionController.loginForm);
// routes.post("/login", SessionController.login);
// routes.post("/logout", SessionController.logout);

/* ============= RESET PASS ============= */
// routes.get("/forgot-password", SessionController.forgotForm);
// routes.get("/password-reset", SessionController.resetForm);
// routes.post("/forgot-password", SessionController.forgot);
// routes.post("/password-reset", SessionController.reset);


/* ============= USER ============= */
// routes.get("/", UserController.show);
// routes.put("/", UserController.put);
// routes.delete("/", UserController.delete);

module.exports = routes;
