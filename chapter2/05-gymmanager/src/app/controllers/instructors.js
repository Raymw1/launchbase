const Instructor = require("../models/Instructor");
const { parseAge, parseDate } = require("../../lib/utils");

module.exports = {
  index(req, res) {
    Instructor.all(function (instructors) {
      return res.render("instructors/index", { instructors });
    });
  },
  show(req, res) {
    const { id } = req.params
    Instructor.find(id, function (instructor) {
      if (!instructor) return res.send("Instructor not found!");
      instructor.age = parseAge(instructor.birth);
      instructor.services = instructor.services.split(",");
      instructor.created_at = parseDate(instructor.created_at).format;
      return res.render(`instructors/show`, { instructor });
    })
  },
  create(req, res) {
    return res.render("instructors/create");
  },
  post(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key] == "") {
        return res.send(`Error, please insert value in ${key}`);
      }
    });

    Instructor.create(req.body, function(id) {
      return res.redirect(`/instructors/${id}`);
    })
  },
  edit(req, res) {
    const { id } = req.params
    Instructor.find(id, function (instructor) {
      if (!instructor) return res.send("Instructor not found!");
      instructor.birth = parseDate(instructor.birth).iso;
      return res.render(`instructors/edit`, { instructor });
    })
  },
  put(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key] == "") {
        return res.send(`Error, please insert value in ${key}`);
      }
    });
    Instructor.update(req.body, function () {
      return res.redirect(`/instructors/${req.body.id}`);
    })
  },
  delete(req, res) {
    Instructor.delete(req.body.id, function() {
      return res.redirect("/instructors")
    })
  },
};
