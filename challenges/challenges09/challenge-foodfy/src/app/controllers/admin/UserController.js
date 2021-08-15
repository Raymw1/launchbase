const User = require("../../model/User");

module.exports = {
  async show(req, res) {
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
  }
}