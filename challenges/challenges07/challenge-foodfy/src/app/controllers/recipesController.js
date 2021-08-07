const Recipe = require("../model/Recipe");
const File = require("../model/File");
const { parseToArray, verifyForm } = require("../../lib/utils");

module.exports = {
  async index(req, res) {
    let recipes = (await Recipe.all()).rows;
    return res.render("recipes/index", { recipes });
  },
  async show(req, res) {
    const recipe = (await Recipe.find(req.params.id)).rows[0];
    if (!recipe) {
      return res.send("Recipe not found");
    }
    return res.render("recipes/show", { recipe });
  },
  async create(req, res) {
    let chefs = (await Recipe.chefSelectOptions()).rows;
    return res.render("recipes/create", { chefs });
  },
  async post(req, res) {
    let error = false;
    verifyForm(req, () => {
      error = true;
    });
    if (error) {
      return res.send(`Erro, por favor insira todos os campos!`);
    }
    const id = (await Recipe.create(req.body)).rows[0].id;
    const filesPromise = req.files.map((file) => {
      File.create({ ...file, recipe_id: id });
    });
    await Promise.all(filesPromise);
    return res.redirect(`/admin/recipes/${id}`);
  },
  async edit(req, res) {
    const recipe = (await Recipe.find(req.params.id)).rows[0];
    if (!recipe) {
      return res.send("Recipe not found");
    }
    const chefs = (await Recipe.chefSelectOptions()).rows;
    return res.render("recipes/edit", { recipe, chefs });
  },
  async put(req, res) {
    let error = false;
    verifyForm(req.body, () => {
      error = true;
    });
    if (error) {
      return res.send(`Erro, por favor insira todos os campos!`);
    }
    await Recipe.update(req.body);
    return res.redirect(`/admin/recipes/${req.body.id}`);
  },
  async delete(req, res) {
    await Recipe.delete(req.body.id);
    return res.redirect(`/admin/recipes/`);
  },
};
