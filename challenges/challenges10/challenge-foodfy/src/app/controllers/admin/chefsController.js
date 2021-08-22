const Chef = require("../../model/Chef");
const File = require("../../model/File");
const { parseToArray, verifyForm } = require("../../../lib/utils");
const chefServices = require("../../services/chefServices");

module.exports = {
  async index(req, res) {
    try {
      let chefs = await Chef.findAll();
      chefs = await chefServices.getChefs(chefs);
      return res.render("admin/chefs/index", { user: req.user, chefs });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        user: req.user,
        error: "Algo deu errado!",
      });
    }
  },
  async show(req, res) {
    let chef = (await Chef.find(req.params.id)).rows[0];
    if (!chef)
      return res.render("admin/chefs/index", {
        user: req.user,
        error: "Chef não encontrado!",
      });
    chef = await chefServices.getChef(chef);
    let allRecipes = (await Chef.getRecipes(req.params.id)).rows;
    let ids = [];
    let canCreateId = true;
    let recipes = [];
    allRecipes.map((recipe) => {
      for (let id of ids) {
        if (id == recipe.id) {
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
          image: recipe.image.replace("public", ""),
        });
      }
    });
    return res.render("admin/chefs/show", { user: req.user, chef, recipes });
  },
  create(req, res) {
    return res.render("admin/chefs/create", { user: req.user });
  },
  async post(req, res) {
    try {
      const avatar = { name: req.files[0].filename, path: req.files[0].path };
      const file_id = await File.create({
        name: avatar.name,
        path: avatar.path,
      });
      const { id } = (await Chef.create(req.body, file_id)).rows[0];
      return res.redirect(`chefs/${id}`);
    } catch (err) {
      console.error(err);
      return res.render("admin/chefs/create", {
        user: req.user,
        error: "Algo deu errado!",
      });
    }
  },
  async edit(req, res) {
    let chef = (await Chef.find(req.params.id)).rows[0];
    if (!chef)
      return res.render("admin/chefs/index", {
        user: req.user,
        error: "Chef não encontrado!",
      });
    const blockDelete = chef.total_recipes > 0 ? true : false;
    let avatar = (await Chef.getImage(chef.avatar)).rows[0];
    avatar = {
      ...avatar,
      src: `${req.protocol}://${req.headers.host}${avatar.path.replace(
        "public",
        ""
      )}`,
    };
    return res.render("admin/chefs/edit", {
      user: req.user,
      chef,
      blockDelete,
      avatar,
    });
  },
  async put(req, res) {
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
    if (!chef)
      return res.render("admin/chefs/index", {
        user: req.user,
        error: "Chef não encontrado",
      });
    let errorDelete = chef.total_recipes > 0 ? true : false,
      blockDelete = errorDelete;
    if (errorDelete) {
      return res.render("admin/chefs/edit", { chef, blockDelete, errorDelete });
    } else {
      await Chef.delete(req.body.id);
      return res.render(`admin/chefs/index`, {
        user: req.user,
        success: "Chef deletado com sucesso!",
      });
    }
  },
};
