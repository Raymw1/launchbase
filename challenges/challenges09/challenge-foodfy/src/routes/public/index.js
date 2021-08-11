const express = require("express");
const routes = express.Router();
const public = require("../../app/controllers/publicController");


routes.get("/", public.index);
routes.get("/about", public.about);
routes.get("/recipes", public.recipes);
routes.get("/recipes/:id", public.recipe);
routes.get("/chefs", public.chefs);

module.exports = routes;