const express = require("express");
const routes = express.Router();
const instructors = require("./instructors")

routes.get("/", function (req, res) {
  return res.redirect("/instructors");
});

routes.get("/instructors", function (req, res) {
  return res.render("instructors/index");
});

routes.get("/instructors/:id", instructors.show);

routes.get("/create", function (req, res) {
  return res.render("instructors/create");
});

routes.post("/instructors", instructors.post);

routes.get("/members", function (req, res) {
  return res.render("members");
});

module.exports = routes;
