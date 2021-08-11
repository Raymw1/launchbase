const express = require("express");
const routes = express.Router();
const public = require("./public/index");
const recipes = require("./admin/recipes");
const chefs = require("./admin/chefs");

/* =================== PUBLIC =================== */
routes.use(public);

/* =================== ADMIN =================== */
/* ============= RECIPES ============= */
routes.use("/admin/recipes", recipes);

/* ============= CHEFS ============= */
routes.use("/admin/chefs", chefs);

/* ============= ALIAS ============= */
routes.get("/admin", function (req, res) {
  return res.redirect("/admin/recipes");
});

module.exports = routes;
