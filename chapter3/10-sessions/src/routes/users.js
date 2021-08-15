const express = require("express");
const routes = express.Router();
const SessionController = require("../app/controllers/SessionController");
const UserController = require("../app/controllers/UserController");
const userValidator = require("../app/validators/user");
const sessionValidator = require("../app/validators/session");
const { isLoggedRedirectToUsers, onlyUsers } = require("../app/middlewares/session");

/* ============= LOGIN/LOGOUT ============= */
routes.get("/login", isLoggedRedirectToUsers, SessionController.loginForm);
routes.post("/login", sessionValidator.login, SessionController.login);
routes.post("/logout", SessionController.logout);

/* ============= RESET PASS ============= */
routes.get("/forgot-password", SessionController.forgotForm);
routes.get("/password-reset", SessionController.resetForm);
routes.post("/forgot-password", sessionValidator.forgot, SessionController.forgot);
routes.post("/password-reset", sessionValidator.reset, SessionController.reset);

/* ============= REGISTER ============= */
routes.get("/register", UserController.registerForm);
routes.post("/register", userValidator.post, UserController.post);


// /* ============= USER ============= */
routes.get("/", onlyUsers, userValidator.show, UserController.show);
routes.put("/", userValidator.update, UserController.update);
routes.delete("/", UserController.delete);

module.exports = routes;
