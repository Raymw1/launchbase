const express = require("express");
const routes = express.Router();
const SessionController = require("../app/controllers/SessionController");
const UserController = require("../app/controllers/UserController");
const userValidator = require("../app/validators/user");
const sessionValidator = require("../app/validators/session");
const { isLoggedRedirectToUsers } = require("../app/middlewares/session");

/* ============= LOGIN/LOGOUT ============= */
routes.get("/login", isLoggedRedirectToUsers, SessionController.loginForm);
routes.post("/login", sessionValidator.login, SessionController.login);
routes.post("/logout", SessionController.logout);

/* ============= REGISTER ============= */
routes.get("/register", UserController.registerForm);
routes.post("/register", userValidator.post, UserController.post);

/* ============= RESET PASS ============= */
// routes.get("/forgot-password", SessionController.forgotForm);
// routes.get("/password-reset", SessionController.resetForm);
// routes.post("/forgot-password", SessionController.forgot);
// routes.post("/password-reset", SessionController.reset);

// /* ============= USER ============= */
routes.get("/", userValidator.show, UserController.show);
routes.put("/", userValidator.update, UserController.update);
// routes.delete("/", UserController.delete);

module.exports = routes;
