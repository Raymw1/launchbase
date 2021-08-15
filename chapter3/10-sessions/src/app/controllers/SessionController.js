const crypto = require("crypto"); // CREATE TOKEN OF FORGOT
const mailer = require("../../lib/mailer");
const { hash } = require("bcryptjs");
const User = require("../models/User");

module.exports = {
  loginForm(req, res) {
    return res.render("session/login");
  },
  login(req, res) {
    req.session.userId = req.user.id;
    req.session.save(err => {
      if (err) throw err;
      return res.redirect("/users");
    });
  },
  logout(req, res) {
    req.session.destroy();
    res.clearCookie("sid");
    return res.redirect("/");
  },
  forgotForm(req, res) {
    return res.render("session/forgot-password");
  },
  async forgot(req, res) {
    try {
      const user = req.user;
      const token = crypto.randomBytes(20).toString("hex");

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now,
      });

      await mailer.sendMail({
        to: user.email,
        from: "no-reply@launchstore.com.br",
        subject: "Recuperação de senha",
        html: `<h2>Recupere sua senha</h2>
        <p>Não se preocupe, clicque no link abaixo para recuperar sua senha</p>
        <p><a href="http://127.0.0.1:3000/users/password-reset?token=${token}" target="_blank">RECUPERAR SENHA</a></p>`,
      });
      return res.render("session/forgot-password", {
        success: "Verifique seu email para resetar sua senha!",
      });
    } catch (err) {
      console.error(err);
      return res.render("session/forgot-password", {
        error: "Erro inseperado, tente novamente!",
      });
    }
  },
  resetForm(req, res) {
    return res.render("session/password-reset", { token: req.query.token });
  },
  async reset(req, res) {
    const { user } = req;
    const { password, token } = req.body;
    try {
      const newPassword = await hash(password, 8);
      await User.update(user.id, { password: newPassword, reset_token: '', reset_token_expires: ''});
      return res.render("session/login", { user: req.body, success: "Senha atualizada com sucesso!" })
    } catch (err) {
      console.error(err);
      return res.render("session/password-reset", {
        token,
        error: "Erro inseperado, tente novamente!",
      });
    }
  }
};
