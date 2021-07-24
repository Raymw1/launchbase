const fs = require("fs");
const {
  parseServices,
  parseDegree,
  parseClasstype,
  parseAge,
  parseDate,
} = require("../utils/teacherUtils");
const data = require("../model/data.json");
const degrees = {
  highschool: "Ensino Médio Completo",
  college: "Ensino Superior Completo",
  master: "Mestrado",
  doctor: "Doutorado",
};

exports.show = function (req, res) {
  const { id } = req.params;
  let foundTeacher = data.teachers.find((teacher) => teacher.id == id);
  if (!foundTeacher) return res.send("Teacher not found!");

  const teacher = {
    ...foundTeacher,
    services: parseServices(foundTeacher.services),
    degree: parseDegree(foundTeacher.degree),
    classtype: parseClasstype(foundTeacher.classtype),
    age: parseAge(foundTeacher.birth),
    created_at: Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at),
  };
  return res.render("teachers/show", { teacher });
};

exports.create = function (req, res) {
  return res.render("teachers/create", { degrees });
}

exports.post = function (req, res) {
  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    if (req.body[key].trim() === "")
      return res.send(`Error, please insert value in ${key}`);
  });

  let { avatar_url, name, birth, degree, classtype, services } = req.body;

  const id = data.teachers.length + 1;
  birth = Date.parse(birth);
  const created_at = Date.now();

  data.teachers.push({
    id,
    avatar_url,
    name,
    birth,
    degree,
    classtype,
    services,
    created_at,
  });
  fs.writeFile(
    "src/model/data.json",
    JSON.stringify(data, null, 2),
    function (err) {
      if (err) return res.send("Write file error!");
    }
  );
  return res.redirect("/teachers");
};

exports.edit = function (req, res) {
  const { id } = req.params;
  let foundTeacher = data.teachers.find((teacher) => teacher.id == id);
  if (!foundTeacher) return res.send("Teacher not found!");
  const teacher = {
    ...foundTeacher,
    birth: parseDate(foundTeacher.birth)
  }
  return res.render("teachers/edit", { teacher , degrees });
};
