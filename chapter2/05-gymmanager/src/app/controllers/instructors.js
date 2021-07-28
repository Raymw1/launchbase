const { parseAge, parseDate } = require("../../lib/utils");

module.exports = {
  index(req, res) {
    return res.render("instructors/index");
  },
  show(req, res) {
    return
  },
  create(req, res) {
    return res.render("instructors/create");
  },
  post(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key] == "") {
        return res.send(`Error, please insert value in ${key}`);
      }
    });
  
    // Get only these from req.body
    let { avatar_url, birth, name, services, gender } = req.body;
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