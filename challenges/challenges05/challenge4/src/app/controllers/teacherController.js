const {
  parseSubjectsTaught,
  parseEducationLevel,
  parseClassType,
  parseAge,
  parseDate,
} = require("../../lib/utils");
const education_levels = require("../../lib/education_levels").teacher;
const Teacher = require("../models/Teacher");

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
      callback(teachers) {
        const pagination = {
          total: Math.ceil(teachers[0].total / limit),
          page
        }
        return res.render("teachers/index", { teachers, filter, pagination });
      }
    }
    Teacher.paginate(params)
  },
  show(req, res) {
    const { id } = req.params;
    Teacher.find(id, function (teacher) {
      if (!teacher) return res.send("Teacher not found!");
      teacher.subjects_taught= parseSubjectsTaught(teacher.subjects_taught);
      teacher.education_level= parseEducationLevel(education_levels, teacher.education_level);
      teacher.class_type = parseClassType(teacher.class_type);
      teacher.age = parseAge(teacher.birth_date);
      teacher.created_at = Intl.DateTimeFormat("pt-BR").format(teacher.created_at)
      return res.render(`teachers/show`, { teacher })
    })
  },
  create(req, res) {
    return res.render("teachers/create", { education_levels });
  },
  post(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key].trim() === "")
        return res.send(`Error, please insert value in ${key}`);
    });
    Teacher.create(req.body, function(id) {
      return res.redirect(`/teachers/${id}`);
    });
  },
  edit(req, res) {
    const { id } = req.params;
    Teacher.find(id, function (teacher) {
      if (!teacher) return res.send("Teacher not found!");
      teacher.birth_date = parseDate(teacher.birth_date).iso;
      return res.render(`teachers/edit`, { teacher, education_levels })
    })
  },
  put(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key].trim() === "")
        return res.send(`Error, please insert value in ${key}`);
    });
    Teacher.update(req.body, function () {
      return res.redirect(`/teachers/${req.body.id}`);
    })
  },
  delete(req, res) {
    Teacher.delete(req.body.id, function () {
      return res.redirect("/teachers");
    })
  },
  paginate(params) {
    const { filter, offset, limit, callback } = params;
    let query = "",
      filterQuery = "";
    if (filter) {
      filterQuery = `
      WHERE students.name ILIKE '%${filter}%' OR 
      students.email ILIKE '%${filter}%'
      `;
    }
    query = `
    SELECT students.*, count(students) AS total_students FROM students
    ${filterQuery}
    ORDER BY name ASC LIMIT $1 OFFSET $2;
    `;
    db.query(query, [ limit, offset ], function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows)
    })
  },
};
