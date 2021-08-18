const Recipe = require("../../model/Recipe");
const File = require("../../model/File");
const { parseToArray, verifyForm } = require("../../../lib/utils");
const recipeServices = require("../../services/recipeServices");

module.exports = {
  async index(req, res) {
    const { rows } = await Recipe.all(req.session.userId);
    const recipes = await recipeServices.recipesWithImages(rows, req);
    return res.render("admin/recipes/index", { user: req.user, recipes });
  },
  async show(req, res) {
    const { recipe, images } = await recipeServices.getRecipe(req);
    return res.render("admin/recipes/show", { user: req.user, recipe, images });
  },
  async create(req, res) {
    let chefs = (await Recipe.chefSelectOptions()).rows;
    return res.render("admin/recipes/create", { user: req.user, chefs });
  },
  async post(req, res) {
    // console.log("a");
    const { userId }= req.session
    const id = (await Recipe.create(req.body, userId)).rows[0].id;
    const filesPromise = req.files.map((file) => {
      File.create({ ...file, recipe_id: id });
    });
    await Promise.all(filesPromise);
    const { recipe, images } = await recipeServices.getRecipe(req, res, id);
    return res.render(`admin/recipes/show`, {recipe, images, user: req.user, success: "Receita criada com sucesso!" });
  },
  async edit(req, res) {
    const recipe = (await Recipe.find(req.params.id)).rows[0];
    if (!recipe) {
      return res.send("Recipe not found");
    }
    await Recipe.files(req.params.id);
    const chefs = (await Recipe.chefSelectOptions()).rows;
    let files = (await Recipe.files(req.params.id)).rows;
    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));
    return res.render("admin/recipes/edit", { user: req.user, recipe, chefs, files });
  },
  async put(req, res) {
    const filesPromise = req.files.map((file) => {
      File.create({ ...file, recipe_id: req.body.id });
    });
    await Promise.all(filesPromise);

    if (req.body.removed_files) {
      const removed_files = req.body.removed_files.split(",");
      removed_files.pop();
      const removedFilesPromise = removed_files.map((id) => File.delete(id));
      await Promise.all(removedFilesPromise);
    }

    await Recipe.update(req.body);
    return res.redirect(`/admin/recipes/${req.body.id}`);
  },
  async delete(req, res) {
    await Recipe.delete(req.body.id);
    return res.render(`admin/profile/index`, { success: "Receita deletada com sucesso!", user: req.user});
  },
};
