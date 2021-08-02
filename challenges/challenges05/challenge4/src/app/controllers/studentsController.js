const {
  parseSubjectsTaught,
  parseEducationLevel,
  parseClassType,
  parseAge,
  parseDate,
} = require("../../lib/utils");
const education_levels = require("../../lib/education_levels").student;
const Student = require("../models/Student");

module.exports = {
  index(req, res) {
    let { filter, page, limit } = req.query;
    page = page || 1;
    limit = limit || 2;
    const offset = limit * (page - 1);
    const params = {
      filter,
      page,
      limit,
      offset,
      callback(students) {
        const pagination = {
          total: Math.ceil(students[0].total / limit),
          page
        }
        students.forEach(student => {
          student.education_level = parseEducationLevel(education_levels, student.education_level);
        })
        return res.render("students/index", { students, filter, pagination });
      }
    }
    Student.paginate(params)
  },
  show(req, res) {
    const { id } = req.params;
    Student.find(id, function (student) {
      if (!student) return res.send("Student not found!");
      student.education_level= parseEducationLevel(education_levels, student.education_level);
      student.age = parseAge(student.birth_date);
      student.birth_date = parseDate(student.birth_date).birthday;
      return res.render(`students/show`, { student })
    })
  },
  create(req, res) {
    Student.teachersSelectOptions(function (teachers) {
      return res.render("students/create", { education_levels, teachers });
    })
  },
  post(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key].trim() === "")
        return res.send(`Error, please insert value in ${key}`);
    });
    Student.create(req.body, function(id) {
      return res.redirect(`/students/${id}`);
    });
  },
  edit(req, res) {
    const { id } = req.params;
    Student.find(id, function (student) {
      if (!student) return res.send("Student not found!");
      student.birth_date = parseDate(student.birth_date).iso;
      Student.teachersSelectOptions(function (teachers) {
        return res.render("students/edit", { student, education_levels, teachers });
      })
    })
  },
  put(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key].trim() === "")
        return res.send(`Error, please insert value in ${key}`);
    });
    Student.update(req.body, function () {
      return res.redirect(`/students/${req.body.id}`);
    })
  },
  delete(req, res) {
    Student.delete(req.body.id, function () {
      return res.redirect("/students");
    })
  }
};
