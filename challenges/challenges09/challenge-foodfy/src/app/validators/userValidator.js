const { verifyForm } = require("../../lib/utils");
module.exports = {
  async post(req, res) {
    let error = false;
    verifyForm(req, () => {
      error = true;
    });
    if (error) {
      return res.render("admin/users/register", { error: `Por favor, insira todos os campos!` });
    }
  }
}