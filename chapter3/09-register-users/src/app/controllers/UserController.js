const Product = require("../models/Product");
const File = require("../models/File");

module.exports = {
  registerForm(req, res) {
    return res.render("user/register");
  }
}