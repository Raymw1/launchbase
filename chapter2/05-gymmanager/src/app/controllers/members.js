const { parseAge, parseDate } = require("../../lib/utils");

module.exports = {
  index(req, res) {
    return res.render("members/index");
  },
  show(req, res) {
    return
  },
  create(req, res) {
    return res.render("members/create");
  },
  post(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key] == "") {
        return res.send(`Error, please insert value in ${key}`);
      }
    });
    return
  },
  edit(req, res) {
    return
  },
  put(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key] == "") {
        return res.send(`Error, please insert value in ${key}`);
      }
    });
    return
  },
  delete(req, res) {
    return
  }
};