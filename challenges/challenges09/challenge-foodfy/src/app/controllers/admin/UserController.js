const User = require("../../model/User");

module.exports = {
  async index (req, res) {
    return res.send("Ok");
  },
  show(req, res) {
    const { user } = req;
    return res.render("admin/profile/index", { user });
  },
  registerForm(req, res) {
    return res.render("admin/users/create")
  },
  async post(req, res) {
    const userId = await User.create(req.body);
    req.session.userId = userId;
    req.session.save(err => {
      if (err) throw err;
      return res.redirect("/admin/profile");
    });
  },
  async update(req, res) {
    const { user } = req;
    try {
      const { name, email } = req.body;
      await User.update(req.user.id, { name, email });
      return res.render("admin/profile", { user: req.body, success: "Usuário atualizado com sucesso!"});
    } catch (err) {
      console.error(err)
      return res.render("admin/profile/index", { user: user, success: "Erro inesperado, tente novamente!"});
    }
  }
}