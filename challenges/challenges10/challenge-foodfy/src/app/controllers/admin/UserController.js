const User = require("../../model/User");
const mailer = require("../../../lib/mailer");
const { hash } = require("bcryptjs");

module.exports = {
  async list(req, res) {
    try {
      const users = await User.findAll();
      return res.render("admin/users/index", { user: req.user, users });
    } catch (err) {
      console.error(err);
    }
  },
  registerForm(req, res) {
    return res.render("admin/users/create", { user: req.user });
  },
  async post(req, res) {
    try {
      let { name, email, password, is_admin } = req.body;
      password = await hash(password, 8);
      is_admin = is_admin ? true : false;
      const userId = await User.create({ name, email, password, is_admin });

      req.session.userId = req.user?.is_admin ? req.session.userId : userId;

      await mailer.sendMail({
        to: req.body.email,
        from: "no-reply@foodfy.com.br",
        subject: "Você foi registrado com sucesso!",
        html: `<h2>Acesse sua conta agora</h2>
        <p>Não se preocupe, clique no link abaixo para acessar sua conta</p>
        <p><a href="http://127.0.0.1:3000/admin/users/login" target="_blank">Acessar minha conta</a></p>`
      })

      req.session.save((err) => {
        if (err) throw err;
        if (req.user?.is_admin) {
          return res.redirect(`/admin/users/${userId}/edit`);
        }
        return res.redirect("/admin/profile");
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/users/login", { error: "Algo deu errado!" });
    }
  },
  async editForm(req, res) {
    try {
      const userData = await User.findOne({ where: { id: req.params.id } });
      return res.render("admin/users/edit", { userData, user: req.user });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { error: "Algo deu errado!", user: req.user });
    }
  },
  async update(req, res) {
    try {
      let { name, email, is_admin } = req.body;
      is_admin = is_admin ? true : false;
      await User.update(req.params.id, { name, email, is_admin });
      return res.render(`admin/users/edit`, {
        user: req.user,
        userData: { ...req.body, id: req.params.id },
        success: "Usuário atualizado com sucesso!",
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        user: req.user,
        userData: { ...req.body, id: req.params.id },
        success: "Erro inesperado, tente novamente!",
      });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      let user = await User.find(id);
      if (!user) return res.render("admin/profile", { user: req.user, error: "Usuário não encontrado!" });
      if (user.is_admin) return res.render("admin/users/edit", { user: req.user, userData: user, error: "Este usuário não pode ser deletado!" });
      await User.delete(id);
      return res.redirect(`/admin/users`);
    } catch (err) {
      console.error(err);
    }
  },
};
