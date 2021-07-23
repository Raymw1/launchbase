const express = require("express");
const teachers = require("./teachers");
const routes = express.Router();

routes.get("/", function (req, res) {
    return res.redirect("/teachers");
});

routes.get("/teachers", function (req, res) {
    return res.render("teachers/index");
});

routes.post("/teachers", teachers.post);

routes.get("/create", function (req, res) {
    return res.render("teachers/create");
});

module.exports = routes;
