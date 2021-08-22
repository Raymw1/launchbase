const Recipe = require("../../model/Recipe");
const File = require("../../model/File");
const Chef = require("../../model/Chef");
const RecipeFiles = require("../../model/RecipeFiles");

const recipeServices = require("../../services/recipeServices");

const { parseToArray } = require("../../../lib/utils");


module.exports = {
  async index(req, res) {
    try {
      recipes = await recipeServices.load("getRecipes", { is_admin: req.user.is_admin, id: req.session.userId });
      return res.render("admin/recipes/index", { user: req.user, recipes });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { user: req.user, error: "Algo deu errado!" });
    }
  },
  async show(req, res) {
    try {
      const recipe = await recipeServices.load("getRecipe", { id: req.params.id });
      return res.render("admin/recipes/show", { user: req.user, recipe });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { user: req.user, error: "Algo deu errado!" });
    }
  },
  async create(req, res) {
    try {
      let chefs = await Chef.findAll();
      return res.render("admin/recipes/create", { user: req.user, chefs });
    } catch (err) {
      console.error(err);
      return res.render("admin/recipes/create", { user: req.user, error: "Algo deu errado!" });
    }
  },
  async post(req, res) {
    try {
      const { userId }= req.session
      let { chef_id, title, ingredients, preparation, information } = req.body;
      ingredients = parseToArray(ingredients);
      preparation = parseToArray(preparation);
      const recipe_id = await Recipe.create({ chef_id, title, ingredients, preparation, information, user_id: userId });
      const filesPromise = req.files.map(async (file) => {
        const file_id = await File.create({ name: file.name, path: file.path });
        await RecipeFiles.create({ recipe_id, file_id });
      });
      await Promise.all(filesPromise);
      const recipe = await recipeServices.load("getRecipe", { id: recipe_id });
      return res.render(`admin/recipes/show`, {recipe, user: req.user, success: "Receita criada com sucesso!" });
    } catch (err) {
      console.error(err);
      return res.render("admin/recipes/create", { user: req.user, error: "Algo deu errado!" });
    }
  },
  async edit(req, res) {
    try {
      const recipe = await recipeServices.load("getRecipe", { id: req.params.id});
      if (!recipe) {
        return res.send("Recipe not found");
      }
      const chefs = await Chef.findAll();
      return res.render("admin/recipes/edit", { user: req.user, recipe, chefs });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { user: req.user, error: "Algo deu errado!" })
    }
  },
  async put(req, res) {
    try {
      const filesPromise = req.files.map(async (file) => {
        const file_id = await File.create({ name: file.name, path: file.path });
        console.log(file_id, req.params.recipe_id)
        await RecipeFiles.create({ recipe_id: req.body.id, file_id });
      });
      await Promise.all(filesPromise);
  
      if (req.body.removed_files) {
        const removed_files = req.body.removed_files.split(",");
        removed_files.pop();
        const removedFilesPromise = removed_files.map((id) => File.delete(id));
        await Promise.all(removedFilesPromise);
      }
      let { id, chef_id, title, ingredients, preparation, information } = req.body;
      ingredients = parseToArray(ingredients);
      preparation = parseToArray(preparation);
      await Recipe.update(id, { chef_id, title, ingredients, preparation, information });
      return res.redirect(`/admin/recipes/${req.body.id}`);
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { user: req.user})
    }
  },
  async delete(req, res) {
    try {
      const recipe_id = req.body.id;
      const files = (await RecipeFiles.findAll({ where: { recipe_id } }));
  
      await Recipe.delete(recipe_id);
      await RecipeFiles.deleteIf({ where: { recipe_id } });
      const filesPromise = files.map(file => File.delete(file.file_id));
      await Promise.all(filesPromise);
      return res.render(`admin/profile/index`, { success: "Receita deletada com sucesso!", user: req.user});
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { user: req.user})
    }
  },
};
