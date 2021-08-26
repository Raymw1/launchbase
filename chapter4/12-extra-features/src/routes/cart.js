const express = require("express");
const routes = express.Router();

const CartController = require("../app/controllers/CartController");

/* ============= LOGIN/LOGOUT ============= */
routes.get("/", CartController.index);

module.exports = routes;
