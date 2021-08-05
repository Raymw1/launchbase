const Recipe = require("../model/Recipe");
const Chef = require("../model/Chef");
const { parseToArray, verifyForm } = require("../../lib/utils");

module.exports = {
  async index(req, res) {
    let chefs = (await Chef.all()).rows;
    return res.render("chefs/index", { chefs });
  },
  async show(req, res) {
    let chef = (await Chef.find(req.params.id)).rows[0];
    if (!chef) return res.send("Chef not found");
    let recipes = (await Chef.getRecipes(req.params.id)).rows;
    return res.render("chefs/show", { chef, recipes });
  },
  create(req, res) {
    return res.render("chefs/create");
  },
  async post(req, res) {
    let error = false;
    verifyForm(req.body, () => {
      error = true;
    });
    if (error) {
      return res.send(`Erro, por favor insira todos os campos!`);
    }
    await Chef.create(req.body);
    const { id } = (await Chef.create(req.body)).rows[0];
    return res.redirect(`chefs/${id}`);
  },
  async edit(req, res) {
    let chef = (await Chef.find(req.params.id)).rows[0];
    if (!chef) return res.send("Chef not found");
    const blockDelete = chef.total_recipes > 0 ? true : false;
    return res.render("chefs/edit", { chef, blockDelete });
  },
  async put(req, res) {
    let error = false;
    verifyForm(req.body, () => {
      error = true;
    });
    if (error) {
      return res.send(`Erro, por favor insira todos os campos!`);
    }
    await Chef.update(req.body);
    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
    let chef = (await Chef.find(req.body.id)).rows[0];
    if (!chef) return res.send("Chef not found");
    let errorDelete = chef.total_recipes > 0 ? true : false,
      blockDelete = errorDelete;
    if (errorDelete) {
      return res.render("chefs/edit", { chef, blockDelete, errorDelete });
    } else {
      await Chef.delete(req.body.id);
      return res.redirect(`/admin/chefs/`);
    }
  },
};
