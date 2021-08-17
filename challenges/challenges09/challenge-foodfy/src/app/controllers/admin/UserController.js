const User = require("../../model/User");

module.exports = {
  async list (req, res) {
    const users = await User.all();
    return res.render("admin/users/index", { user: req.user, users });
  },
  registerForm(req, res) {
    return res.render("admin/users/create", { user: req.user })
  },
  async post(req, res) {
    const userId = await User.create(req.body);
    req.session.userId = req.user?.is_admin ? req.session.userId : userId;
    req.session.save(err => {
      if (err) throw err;
      if (req.user?.is_admin) {
        return res.send("Ok!");
      }
      return res.redirect("/admin/profile");
    });
  },
  async editForm (req, res) {
    const userData = await User.findOne({ where: { id: req.params.id }})
    return res.render("admin/users/edit", { userData, user: req.user })
  }
  // async update(req, res) {
  //   const { user } = req;
  //   try {
  //     const { name, email } = req.body;
  //     await User.update(req.user.id, { name, email });
  //     return res.render("admin/profile", { user: req.body, success: "Usuário atualizado com sucesso!"});
  //   } catch (err) {
  //     console.error(err)
  //     return res.render("admin/profile/index", { user: user, success: "Erro inesperado, tente novamente!"});
  //   }
  // }
}