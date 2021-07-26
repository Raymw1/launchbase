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

exports.index = function (req, res) {
  return res.render("teachers/index", { teachers: data.teachers });
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
};

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
    birth: parseDate(foundTeacher.birth),
  };
  return res.render("teachers/edit", { teacher, degrees });
};

exports.put = function (req, res) {
  const { id } = req.body;
  let index = 0;
  const foundTeacher = data.teachers.find((teacher, foundIndex) => {
    if (teacher.id == id) {
      index = foundIndex;
      return true;
    }
  });
  if (!foundTeacher) return res.send("Teacher not found!");
  const teacher = {
    ...foundTeacher,
    ...req.body,
    id: Number(req.body.id),
    birth: Date.parse(req.body.birth),
  };
  data.teachers[index] = teacher;
  fs.writeFile(
    "src/model/data.json",
    JSON.stringify(data, null, 2),
    function (err) {
      if (err) return res.send("Write file error");
      return res.redirect(`/teachers/${id}`);
    }
  );
};

exports.delete = function (req, res) {
  const { id } = req.body;
  const teachers = data.teachers.filter((teacher) => teacher.id != id);
  data.teachers = teachers;
  fs.writeFile(
    "src/model/data.json",
    JSON.stringify(data, null, 2),
    function (err) {
      if (err) return res.send("Write file error");
      return res.redirect(`/teachers`);
    }
  );
};
