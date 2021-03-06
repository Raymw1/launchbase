const { parseEducationLevel, parseAge, parseDate } = require("../../lib/utils");
const education_levels = require("../../lib/education_levels").student;
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const paginateService = require("../services/paginateService");

module.exports = {
  async index(req, res) {
    let { filter, page, limit } = req.query;
    const params = await paginateService.load("students", {
      filter,
      page,
      limit,
    });
    const students = await Student.paginate(params);
    const pagination = {
      total: Math.ceil(students[0].total / params.limit),
      page,
    };
    students.forEach((student) => {
      student.education_level = parseEducationLevel(
        education_levels,
        student.education_level
      );
    });
    return res.render(`students/index`, { students, filter, pagination });
  },
  async show(req, res) {
    const { id } = req.params;
    const student = await Student.find(id);
    if (!student) return res.send("Student not found!");
    student.education_level = parseEducationLevel(
      education_levels,
      student.education_level
    );
    student.age = parseAge(student.birth_date);
    student.birth_date = parseDate(student.birth_date).birthday;
    student.teacher_name = (await Teacher.find(student.teacher_id)).name;
    return res.render(`students/show`, { student });
  },
  async create(req, res) {
    const teachers = await Teacher.findAll();
    return res.render("students/create", { education_levels, teachers });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);
    for (let key of keys) {
      if (req.body[key].trim() === "")
        return res.render(`students/create`, {
          student: req.body,
          education_levels,
          teachers: await Teacher.findAll(),
          error: true,
        });
    }
    let {
      avatar_url,
      name,
      email,
      birth_date,
      education_level,
      weektime,
      teacher: teacher_id,
    } = req.body;
    const id = await Student.create({
      avatar_url,
      name,
      email,
      birth_date: parseDate(birth_date).iso,
      education_level,
      weektime,
      teacher_id,
    });
    return res.render("returns/success", {
      primary_message: "Estudante criado com sucesso",
      secondary_message: "Voc?? pode ver ele aqui!",
      ctalink: `/students/${id}`,
      cta: "Ver estudante",
    });
  },
  async edit(req, res) {
    const { id } = req.params;
    const student = await Student.find(id);
    if (!student) return res.send("Student not found!");
    student.birth_date = parseDate(student.birth_date).iso;
    const teachers = await Teacher.findAll();
    return res.render("students/edit", { student, education_levels, teachers });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);
    for (let key of keys) {
      if (req.body[key].trim() === "")
        return res.render(`students/edit`, {
          student: req.body,
          education_levels,
          teachers: await Teacher.findAll(),
          error: true,
        });
    }

    let {
      avatar_url,
      name,
      email,
      birth_date,
      education_level,
      weektime,
      teacher,
    } = req.body;

    (birth_date = parseDate(birth_date).iso),
      await Student.update(req.body.id, {
        avatar_url,
        name,
        email,
        birth_date,
        education_level,
        weektime,
        teacher_id: teacher,
      });
    return res.render("returns/success", {
      primary_message: "Estudante editado com sucesso",
      secondary_message: "Voc?? pode ver ele aqui!",
      ctalink: `/students/${req.body.id}`,
      cta: "Ver estudante",
    });
  },
  async delete(req, res) {
    await Student.delete(req.body.id);
    return res.render("returns/success", {
      primary_message: "Estudante deletado com sucesso",
      secondary_message: "Voc?? tamb??m pode ver outros estudantes!",
      ctalink: `/students`,
      cta: "Ver estudantes",
    });
  },
};
