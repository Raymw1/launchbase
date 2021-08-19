const User = require("../models/User");
const { compare } = require("bcryptjs");

function checkAllFields(body) {
  const keys = Object.keys(body);
  for (key of keys) {
    if (body[key].trim() == "") {
      return { user: body, error: "Insira todos os valores!" };
    }
  }
}

module.exports = {
  async show(req, res, next) {
    const { userId: id } = req.session;
    const user = await User.findOne({ where: { id } });
    if (!user)
      return res.render("user/register", { error: "Usuário não encontrado!" });
    req.user = user;
    next();
  },
  async post(req, res, next) {
    const fillAllFields = checkAllFields(req.body);
    if (fillAllFields) return res.render("user/register", fillAllFields);
    let { email, cpf_cnpj, password, passwordRepeat } = req.body;
    cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

    const user = await User.findOne({
      where: { email },
      or: { cpf_cnpj },
    });
    if (user)
      return res.render("user/register", {
        user: req.body,
        error: "Usuário já cadastrado!",
      });

    if (password != passwordRepeat)
      return res.render("user/register", {
        user: req.body,
        error: "Senhas diferentes!",
      });

    next();
  },
  async update(req, res, next) {
    const fillAllFields = checkAllFields(req.body);
    if (fillAllFields) return res.render("user/index", { fillAllFields });

    const { id, password } = req.body;

    if (!password)
      return res.render("user/index", {
        user: req.body,
        error: "Por favor, insira sua senha!",
      });

    const user = await User.findOne({ where: { id } });
    const passed = await compare(password, user.password);
    if (!passed)
      return res.render("user/index", {
        user: req.body,
        error: "Por favor, insira corretamente sua senha!",
      });
    
    req.user = user;
    next();
  },
};
