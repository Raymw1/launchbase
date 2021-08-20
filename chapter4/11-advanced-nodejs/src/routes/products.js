const express = require("express");
const routes = express.Router();
const ProductController = require("../app/controllers/ProductController");
const SearchController = require("../app/controllers/SearchController");
const multer = require("../app/middlewares/multer");
const { onlyUsers } = require("../app/middlewares/session");
const productValidator = require("../app/validators/product");

/* ============= SEARCH ============= */
routes.get("/search", SearchController.index);

/* ============= PRODUCTS ============= */
routes.get("/create", onlyUsers, ProductController.create);
routes.get("/:id", ProductController.show);
routes.get("/:id/edit", onlyUsers, ProductController.edit);
routes.post("/", onlyUsers, multer.array("photos", 6), productValidator.post, ProductController.post);
routes.put("/", onlyUsers, multer.array("photos", 6), productValidator.put, ProductController.put);
routes.delete("/", onlyUsers, ProductController.delete);

module.exports = routes;