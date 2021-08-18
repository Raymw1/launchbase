module.exports = {
  loginForm(req, res) {
    return res.render("admin/users/login");
  },
  async login(req, res) {
    req.session.userId = req.user.id;
    req.session.is_admin = req.user.is_admin;
    req.session.save(err => {
      if (err) throw err;
      return res.redirect("/admin/profile");
    });
  },
  logout(req, res) {
    req.session.destroy();
    res.clearCookie("sid");
    return res.redirect("/");
  },
  forgotForm(req, res) {
    
  }
}