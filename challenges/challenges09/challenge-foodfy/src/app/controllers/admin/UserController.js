const User = require("../../model/User");

module.exports = {
  async list(req, res) {
    const users = await User.all();
    return res.render("admin/users/index", { user: req.user, users });
  },
  registerForm(req, res) {
    return res.render("admin/users/create", { user: req.user });
  },
  async post(req, res) {
    const userId = await User.create(req.body);
    req.session.userId = req.user?.is_admin ? req.session.userId : userId;
    req.session.save((err) => {
      if (err) throw err;
      if (req.user?.is_admin) {
        return res.redirect(`/admin/users/${userId}/edit`);
      }
      return res.redirect("/admin/profile");
    });
  },
  async editForm(req, res) {
    const userData = await User.findOne({ where: { id: req.params.id } });
    return res.render("admin/users/edit", { userData, user: req.user });
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
      let user = (await User.findOne({ where: { id } }));
      if (!user) return res.render("admin/profile", { user: req.user, error: "Usuário não encontrado!" });
      if (user.is_admin) return res.render("admin/users/edit", { user: req.user, userData: user, error: "Este usuário não pode ser deletado!" });
      await User.delete({ where: { id } });
      return res.redirect(`/admin/users`);
    } catch (err) {
      console.error(err);
    }
  },
};
