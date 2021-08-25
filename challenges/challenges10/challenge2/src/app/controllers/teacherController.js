const {
  parseSubjectsTaught,
  parseEducationLevel,
  parseClassType,
  parseAge,
  parseDate,
} = require("../../lib/utils");
const education_levels = require("../../lib/education_levels").teacher;
const Teacher = require("../models/Teacher");
const paginateService = require("../services/paginateService");

module.exports = {
  async index(req, res) {
    let { filter, page, limit } = req.query;
    const params = await paginateService.load("teachers", {
      filter,
      page,
      limit,
    });
    const teachers = await Teacher.paginate(params);
    const pagination = {
      total: Math.ceil(teachers[0].total / params.limit),
      page,
    };
    return res.render(`teachers/index`, { teachers, filter, pagination });
  },
  async show(req, res) {
    const { id } = req.params;
    const teacher = await Teacher.find(id);
    if (!teacher) return res.send("Teacher not found!");
    teacher.subjects_taught = parseSubjectsTaught(teacher.subjects_taught);
    teacher.education_level = parseEducationLevel(
      education_levels,
      teacher.education_level
    );
    teacher.class_type = parseClassType(teacher.class_type);
    teacher.age = parseAge(teacher.birth_date);
    teacher.created_at = Intl.DateTimeFormat("pt-BR").format(
      teacher.created_at
    );
    return res.render(`teachers/show`, { teacher });
  },
  create(req, res) {
    return res.render("teachers/create", { education_levels });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);
    for (let key of keys) {
      if (req.body[key].trim() === "")
        return res.render(`teachers/create`, { teacher: req.body, education_levels, error: true });
    }
    let {
      avatar_url,
      name,
      birth_date,
      education_level,
      class_type,
      subjects_taught,
    } = req.body;
    birth_date = parseDate(birth_date).iso;
    const id = await Teacher.create({
      avatar_url,
      name,
      birth_date,
      education_level,
      class_type,
      subjects_taught,
      created_at: parseDate(Date.now()).iso
    });
    return res.render("returns/success", {
      primary_message: "Professor criado com sucesso",
      secondary_message: "Você pode ver ele aqui!",
      ctalink: `/teachers/${id}`,
      cta: "Ver professor",
    });
  },
  async edit(req, res) {
    const { id } = req.params;
    const teacher = await Teacher.find(id);
    if (!teacher) return res.send("Teacher not found!");
    teacher.birth_date = parseDate(teacher.birth_date).iso;
    return res.render(`teachers/edit`, { teacher, education_levels });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);
    for (let key of keys) {
      if (req.body[key].trim() === "")
        return res.render(`teachers/edit`, { teacher: req.body, education_levels, error: true });
    }
    let {
      avatar_url,
      name,
      birth_date,
      education_level,
      class_type,
      subjects_taught,
    } = req.body;
    birth_date = parseDate(birth_date).iso;
    await Teacher.update(req.body.id, {
      avatar_url,
      name,
      birth_date,
      education_level,
      class_type,
      subjects_taught,
    });
    return res.render("returns/success", {
      primary_message: "Professor editado com sucesso",
      secondary_message: "Você pode ver ele aqui!",
      ctalink: `/teachers/${req.body.id}`,
      cta: "Ver professor",
    });
  },
  async delete(req, res) {
    await Teacher.delete(req.body.id);
    return res.render("returns/success", {
      primary_message: "Professor deletado com sucesso",
      secondary_message: "Você pode ver os outros professores!",
      ctalink: `/teachers`,
      cta: "Ver professor",
    });
  },
};
