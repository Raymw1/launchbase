const User = require("../models/User");
const { compare } = require("bcryptjs");
const { reset } = require("../controllers/SessionController");

module.exports = {
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
    return res.render("session/login", { user: req.body, error: "Usuário não cadastrado!" });
    
    const passed = await compare(password, user.password);
    if (!passed)
      return res.render("session/login", {
        user: req.body,
        error: "Por favor, insira corretamente sua senha!",
      });
    
    req.user = user;
    next();
  },
  async forgot(req, res, next) {
    const { email } = req.body;
    try {
      let user = await User.findOne({ where: { email }});
      if (!user) return res.render("session/forgot-password", { user: req.body, error: "Email não cadastrado"});
      req.user = user
      next();
    } catch (err) {
      console.error(err);
    }
  },
  async reset(req, res, next) {
    const { email, password, passwordRepeat, token } = req.body;
    try {
      let user = await User.findOne({ where: { email }});
      if (!user) return res.render("session/password-reset", { user: req.body, token, error: "Email não cadastrado"});

      if (password != passwordRepeat)
      return res.render("session/password-reset", {
        user: req.body,
        token,
        error: "Senhas diferentes!",
      });

      if (token != user.reset_token) return res.render("session/password-reset", { user: req.body, token, error: "Token inválido! Solicite uma nova recuperação de senha."});

      let now = new Date();
      now = now.setHours(now.getHours());

      if (now > user.reset_token_expires) return res.render("session/password-reset", { user: req.body, token, error: "Token expirado! Solicite uma nova recuperação de senha."});

      req.user = user
      next();
    } catch (err) {
      console.error(err);
      if (err) return res.render("session/password-reset", { user: req.body, token: req.query.token, error: "Erro inesperado, tente novamente!"});
    }
  }
};
