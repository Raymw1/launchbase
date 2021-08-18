const Recipe = require("../model/Recipe");

module.exports = {
  async recipesWithImages(rows, req) {
    const recipes = rows.map(async (recipe) => {
      const path = (await Recipe.getImage(recipe.id)).replace("public", "");
      const image = `${req.protocol}://${req.headers.host}${path}`;
      return { ...recipe, image };
    });
    return await Promise.all(recipes);
  },
  async getRecipe(req, res, id) {
    const recipe = (await Recipe.find(req.params.id || id)).rows[0];
    if (!recipe) {
      return res.render("admin/recipes/index", {user: req.user, error: "Receita não encontrada"});
    }
    let images = (await Recipe.files(req.params.id)).rows;
    images = images.map((image) => ({
      ...image,
      src: `${req.protocol}://${req.headers.host}${image.path.replace(
        "public",
        ""
      )}`,
    }));
    return { recipe, images };
  }
};
