const Product = require("../models/Product");
const File = require("../models/File");

module.exports = {
  loginForm(req, res) {
    return res.render("session/login");
  },
  login(req, res) {
    req.session.userId = req.user.id;
    return res.redirect("/users")
  },
  logout(req, res) {
    req.session.destroy();
    res.clearCookie("sid");
    return res.redirect("/");
  },
  forgotForm(req, res) {
    return res.render("session/forgot-password");
  },
  forgot(req, res) {
    
  }
}