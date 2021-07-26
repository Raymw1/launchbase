const express = require("express");
const teachers = require("./controllers/teacherController");
const routes = express.Router();

routes.get("/", function (req, res) {
  return res.redirect("/teachers");
});

routes.get("/teachers", teachers.index);

routes.get("/teachers/create", teachers.create);

routes.get("/teachers/:id", teachers.show);

routes.get("/teachers/:id/edit", teachers.edit);

routes.post("/teachers", teachers.post);

routes.put("/teachers", teachers.put);

routes.delete("/teachers", teachers.delete);

module.exports = routes;
