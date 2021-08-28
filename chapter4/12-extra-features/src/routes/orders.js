const express = require("express");
const routes = express.Router();

const OrderController = require("../app/controllers/OrderController");

const { onlyUsers } = require("../app/middlewares/session");


routes.get("/", onlyUsers, OrderController.index)
  .post("/", onlyUsers, OrderController.post)
  .get("/sales", onlyUsers, OrderController.sales)
  .get("/:id", onlyUsers, OrderController.show)
  .post("/:id/:action", onlyUsers, OrderController.update)

module.exports = routes;
