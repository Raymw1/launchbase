const fs = require("fs");
const {
  parseServices,
  parseDegree,
  parseClasstype,
  parseAge,
  parseDate,
} = require("../utils/utils");
const data = require("../model/data.json");
const degrees = {
  ef5: "5º ano E.F.",
  ef6: "6º ano E.F.",
  ef7: "7º ano E.F.",
  ef8: "8º ano E.F.",
  ef9: "9º ano E.F.",
  em1: "1º ano E.M.",
  em2: "2º ano E.M.",
  em3: "3º ano E.M.",
};

exports.index = function (req, res) {
  const students = data.students.map(student => {
    return {
      ...student,
      degree: degrees[student.degree]
    }
  })
  return res.render("students/index", { students });
};

exports.show = function (req, res) {
  const { id } = req.params;
  let foundStudent = data.students.find((student) => student.id == id);
  if (!foundStudent) return res.send("Student not found!");

  const student = {
    ...foundStudent,
    degree: parseDegree(degrees, foundStudent.degree),
    age: parseAge(foundStudent.birth),
    birth: parseDate(foundStudent.birth).birthday,
  };
  return res.render("students/show", { student });
};

exports.create = function (req, res) {
  return res.render("students/create", { degrees });
};

exports.post = function (req, res) {
  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    if (req.body[key].trim() === "")
      return res.send(`Error, please insert value in ${key}`);
  });

  const lastId = data.students[data.students.length - 1]?.id;
  const id = lastId + 1 || 1;

  data.students.push({
    id,
    ...req.body,
    birth: Date.parse(req.body.birth)
  });
  fs.writeFile(
    "src/model/data.json",
    JSON.stringify(data, null, 2),
    function (err) {
      if (err) return res.send("Write file error!");
    }
  );
  return res.redirect("/students");
};

exports.edit = function (req, res) {
  const { id } = req.params;
  let foundStudent = data.students.find((student) => student.id == id);
  if (!foundStudent) return res.send("Student not found!");
  const student = {
    ...foundStudent,
    birth: parseDate(foundStudent.birth).iso,
  };
  return res.render("students/edit", { student, degrees });
};

exports.put = function (req, res) {
  const { id } = req.body;
  let index = 0;
  const foundStudent = data.students.find((student, foundIndex) => {
    if (student.id == id) {
      index = foundIndex;
      return true;
    }
  });
  if (!foundStudent) return res.send("Student not found!");
  const student = {
    ...foundStudent,
    ...req.body,
    id: Number(req.body.id),
    birth: Date.parse(req.body.birth),
  };
  data.students[index] = student;
  fs.writeFile(
    "src/model/data.json",
    JSON.stringify(data, null, 2),
    function (err) {
      if (err) return res.send("Write file error");
      return res.redirect(`/students/${id}`);
    }
  );
};

exports.delete = function (req, res) {
  const { id } = req.body;
  const students = data.students.filter((student) => student.id != id);
  data.students = students;
  fs.writeFile(
    "src/model/data.json",
    JSON.stringify(data, null, 2),
    function (err) {
      if (err) return res.send("Write file error");
      return res.redirect(`/students`);
    }
  );
};
