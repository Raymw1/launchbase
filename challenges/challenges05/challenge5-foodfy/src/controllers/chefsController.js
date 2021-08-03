const Recipe = require("../model/Recipe");
const Chef = require("../model/Chef");
const { parseToArray, verifyForm } = require("../lib/utils");

module.exports = {
  index(req, res) {
    Chef.all(function (chefs) {
      return res.render("chefs/index", { chefs });
    });
  },
  show(req, res) {
    Chef.find(req.params.id, function (chef) {
      if (!chef) return res.send("Chef not found");
      Chef.getRecipes(req.params.id, function (recipes) {
        return res.render("chefs/show", { chef, recipes });
      })
    });
  },
  create(req, res) {
    return res.render("chefs/create");
  },
  post(req, res) {
    verifyForm(req, res);
    Chef.create(req.body, function (id) {
      return res.redirect(`chefs/${id}`);
    });
  },
  edit(req, res) {
    Chef.find(req.params.id, function (chef) {
      if (!chef) return res.send("Chef not found");
      return res.render("chefs/edit", { chef });
    });
  },
  put(req, res) {
    verifyForm(req, res);
    Chef.update(req.body, function () {
      return res.redirect(`/admin/chefs/${req.body.id}`);
    });
  },
  delete(req, res) {
    Chef.delete(req.body.id, function () {
      return res.redirect(`/admin/chefs/`);
    });
  },
};
