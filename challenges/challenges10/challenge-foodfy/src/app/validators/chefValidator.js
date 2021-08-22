const { verifyForm } = require("../../lib/utils");
const Chef = require("../model/Chef");

module.exports = {
  post(req, res, next) {
    const emptyFields = verifyForm(req.body);
    const data = { chef: emptyFields?.user, error: emptyFields?.error};
    const noImage = req.files.length == 0;
    if (emptyFields) return res.render("admin/chefs/create", { user: req.user, ...data});
    if (noImage) return res.render("admin/chefs/create", { user: req.user, chef: req.body, error: "Insira pelo menos uma imagem!"});
    next();
  },
  put(req, res, next) {
    const emptyFields = verifyForm(req.body);
    const data = { chef: emptyFields?.user, error: emptyFields?.error};
    if (emptyFields) return res.render("admin/chefs/edit", { user: req.user, ...data});
    next();
  },
  async delete(req, res, next) {
    let chef = await Chef.find(req.body.id);
    if (!chef)
      return res.render("admin/chefs/index", {
        user: req.user,
        error: "Chef não encontrado",
      });
    let errorDelete = chef.total_recipes > 0 ? true : false,
      blockDelete = errorDelete;
    if (errorDelete) return res.render("admin/chefs/edit", { user: req.user, chef, blockDelete, errorDelete });
    next();
  }
}