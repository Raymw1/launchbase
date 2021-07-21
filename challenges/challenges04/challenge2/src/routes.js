const express = require("express");
const routes = express.Router();

routes.get("/", function (req, res) {
    return res.render("teachers/index");
});

module.exports = routes;
