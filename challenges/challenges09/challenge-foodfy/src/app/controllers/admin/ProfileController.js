const User = require("../../model/User");

module.exports = {
  show(req, res) {
    const { user } = req;
    return res.render("admin/profile/index", { user });
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