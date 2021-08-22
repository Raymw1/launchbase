const Chef = require("../model/Chef");
const File = require("../model/File");
const Recipe = require("../model/Recipe");
const RecipeFiles = require("../model/RecipeFiles");

async function getImages(file_id) {
  image = await File.find(file_id);
  return {
    id: image.id,
    name: image.name,
    src: image.path.replace("public", ""),
  }
}

async function getChefAndImage(recipe) {
  let file_id = (await RecipeFiles.findOne({ where: { recipe_id: recipe.id } }))?.file_id;
  recipe.image = file_id ? await getImages(file_id) : null;
  recipe.chef_name = (await Chef.findOne({ where: { id: recipe.chef_id } })).name;
  return recipe;
}

module.exports = {
  load(service, filters) {
    this.filters = filters;
    return this[service]();
  },
  async getRecipes() {
    try {
      let recipes = [];
      if (this.filters?.is_admin || this.filters?.all) {
        recipes = await Recipe.findAll();
      } else if (this.filters?.chef_id) {
        recipes = await Recipe.findAll({ where: { chef_id: this.filters.chef_id } });
      } else {
        await Recipe.findAll({ where: { user_id: this.filters.id } });
      }
      const recipesPromise = recipes.map(getChefAndImage);
      return Promise.all(recipesPromise);
    } catch (err) {
      console.error(err);
    }
  },
  async paginate() {
    try {
      let { page, filter, limit } = this.filters;
      page = page || 1;
      limit = limit || 6;
      offset = limit * (page - 1);
      const params = {
        filter,
        page,
        limit,
        offset,
      };
      let recipes = await Recipe.paginate(params);
      let total = recipes[0]?.total || 0;
      const pagination = {
        total: Math.ceil(total / limit),
        page,
      };
      const recipesPromise = recipes.map(getChefAndImage);
      recipes = await Promise.all(recipesPromise);
      return { recipes, pagination };
    } catch (err) {
      console.error(err);
    }
  },
  async getRecipe() {
    const recipe = await Recipe.find(this.filters.id);
    if (!recipe)
      return res.render("admin/profile/index", {
        user: req.user,
        error: "Receita não encontrada",
      });
    let images = await RecipeFiles.findAll({ where: { recipe_id: this.filters.id } });
    const imagesPromise = images.map(image => getImages(image.file_id));
    recipe.images = await Promise.all(imagesPromise);;
    recipe.chef_name = (await Chef.findOne({ where: { id: recipe.chef_id } })).name;
    return recipe;
  },
};
