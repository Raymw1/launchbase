module.exports = {
  registerForm(req, res) {
    return res.render("admin/users/register")
  },
  post(req, res) {
    // return res.render("admin/users/users", { success: "Sucesssso!"});
    return res.send("Alright!")
  }
}