const express = require("express");
const routes = express.Router();
const SessionController = require("../app/controllers/SessionController");
const UserController = require("../app/controllers/UserController");
const userValidator = require("../app/validators/user");

/* ============= LOGIN/LOGOUT ============= */
// routes.get("/login", SessionController.loginForm);
// routes.post("/login", SessionController.login);
// routes.post("/logout", SessionController.logout);

/* ============= REGISTER ============= */
routes.get("/register", UserController.registerForm);
routes.post("/register", userValidator.post, UserController.post);

/* ============= RESET PASS ============= */
// routes.get("/forgot-password", SessionController.forgotForm);
// routes.get("/password-reset", SessionController.resetForm);
// routes.post("/forgot-password", SessionController.forgot);
// routes.post("/password-reset", SessionController.reset);

// /* ============= USER ============= */
routes.get("/", UserController.show);
// routes.put("/", UserController.put);
// routes.delete("/", UserController.delete);

module.exports = routes;
