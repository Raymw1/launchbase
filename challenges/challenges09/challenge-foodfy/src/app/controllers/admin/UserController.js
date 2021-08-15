const User = require("../../model/User");

module.exports = {
  registerForm(req, res) {
    return res.render("admin/users/create")
  },
  async post(req, res) {
    
    const userId = await User.create(req.body);
    req.session.userId = userId;
    req.session.save(err => {
      if (err) throw err;
      return res.redirect("/users");
    });
  }
}