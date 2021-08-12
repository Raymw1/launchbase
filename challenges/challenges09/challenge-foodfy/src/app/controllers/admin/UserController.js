module.exports = {
  registerForm(req, res) {
    return res.render("admin/users/register")
  },
  post(req, res) {
    return res.send("Alright!")
  }
}