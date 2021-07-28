const {
  parseServices,
  parseDegree,
  parseClasstype,
  parseAge,
  parseDate,
} = require("../../lib/utils");
const degrees = require("../../lib/degrees").student;

module.exports = {
  index(req, res) {
    const students = data.students.map((student) => {
      return {
        ...student,
        degree: degrees[student.degree],
      };
    });
    return res.render("students/index", { students });
  },
  show(req, res) {
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
  },
  create(req, res) {
    return res.render("students/create", { degrees });
  },
  post(req, res) {
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
      birth: Date.parse(req.body.birth),
    });
    fs.writeFile(
      "src/model/data.json",
      JSON.stringify(data, null, 2),
      function (err) {
        if (err) return res.send("Write file error!");
      }
    );
    return res.redirect("/students");
  },
  edit(req, res) {
    const { id } = req.params;
    let foundStudent = data.students.find((student) => student.id == id);
    if (!foundStudent) return res.send("Student not found!");
    const student = {
      ...foundStudent,
      birth: parseDate(foundStudent.birth).iso,
    };
    return res.render("students/edit", { student, degrees });
  },
  put(req, res) {
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
  },
  delete(req, res) {
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
  },
};
