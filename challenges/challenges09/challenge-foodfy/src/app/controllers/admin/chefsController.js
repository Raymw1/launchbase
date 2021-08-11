const Chef = require("../../model/Chef");
const File = require("../../model/File");
const { parseToArray, verifyForm } = require("../../../lib/utils");
const chefServices = require("../../services/chefServices");

module.exports = {
  async index(req, res) {
    const { rows } = await Chef.all();
    const chefs = await chefServices.getChefs(rows, req)
    return res.render("admin/chefs/index", { chefs });
  },
  async show(req, res) {
    const chef = (await Chef.find(req.params.id)).rows[0];
    if (!chef) return res.send("Chef not found");
    let image = (await Chef.getImage(chef.avatar)).rows[0];
    image = `${req.protocol}://${req.headers.host}${image.path.replace(
      "public",
      ""
    )}`;
    let allRecipes = (await Chef.getRecipes(req.params.id)).rows;
    let ids = [];
    let canCreateId = true;
    let recipes = [];
    allRecipes.map((recipe) => {
      for (let id of ids) {
        if ((id == recipe.id)) {
          canCreateId = false;
          break;
        } else {
          canCreateId = true;
        }
      }
      if (canCreateId) {
        ids.push(recipe.id);
        recipes.push({
          ...recipe,
          image: `${req.protocol}://${req.headers.host}${recipe.image.replace(
            "public",
            ""
          )}`,
        });
      }
    });
    return res.render("admin/chefs/show", { chef, recipes, image });
  },
  create(req, res) {
    return res.render("admin/chefs/create");
  },
  async post(req, res) {
    let error = false;
    verifyForm(req, () => {
      error = true;
    });
    if (error) {
      return res.send(`Erro, por favor insira todos os campos!`);
    }
    const avatar = { filename: req.files[0].filename, path: req.files[0].path };
    const file_id = (await File.createChef({ ...avatar })).rows[0].id;
    const { id } = (await Chef.create(req.body, file_id)).rows[0];
    return res.redirect(`chefs/${id}`);
  },
  async edit(req, res) {
    let chef = (await Chef.find(req.params.id)).rows[0];
    if (!chef) return res.send("Chef not found");
    const blockDelete = chef.total_recipes > 0 ? true : false;
    let avatar = (await Chef.getImage(chef.avatar)).rows[0];
    avatar = {
      ...avatar,
      src: `${req.protocol}://${req.headers.host}${avatar.path.replace(
        "public",
        ""
      )}`,
    };
    return res.render("admin/chefs/edit", { chef, blockDelete, avatar });
  },
  async put(req, res) {
    let error = false;
    verifyForm(req, () => {
      error = true;
    });
    if (error) {
      return res.send(`Erro, por favor insira todos os campos!`);
    }

    const avatar = {
      filename: req.files[0]?.filename,
      path: req.files[0]?.path,
    };
    file_id =
      +(await File.createChef({ ...avatar, chef_id: req.body.id }))?.rows[0]
        .id ||
      +(await File.createChef({ ...avatar, chef_id: req.body.id })).rows[0]
        .avatar;

    if (req.body.removed_files) {
      const removed_files = req.body.removed_files.split(",");
      removed_files.pop();
      const removedFilesPromise = removed_files.map((id) =>
        File.deleteChef(id)
      );
      await Promise.all(removedFilesPromise);
    }

    await Chef.update(req.body, file_id);
    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
    let chef = (await Chef.find(req.body.id)).rows[0];
    if (!chef) return res.send("Chef not found");
    let errorDelete = chef.total_recipes > 0 ? true : false,
      blockDelete = errorDelete;
    if (errorDelete) {
      return res.render("admin/chefs/edit", { chef, blockDelete, errorDelete });
    } else {
      await Chef.delete(req.body.id);
      return res.redirect(`/admin/chefs/`);
    }
  },
};
