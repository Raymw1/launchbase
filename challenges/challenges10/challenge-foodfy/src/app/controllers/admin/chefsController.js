const { unlinkSync } = require("fs");

const Chef = require("../../model/Chef");
const File = require("../../model/File");

const chefServices = require("../../services/chefServices");
const recipeServices = require("../../services/recipeServices");
const { parseDate } = require("../../../lib/utils");

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
    try {
      let chef = await Chef.find(req.params.id);
      if (!chef)
        return res.render("admin/chefs/index", {
          user: req.user,
          error: "Chef não encontrado!",
        });
      chef = await chefServices.getChef(chef);
      let recipes = await recipeServices.load("getRecipes", {
        chef_id: chef.id,
      });
      return res.render("admin/chefs/show", { user: req.user, chef, recipes });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { user: req.user });
    }
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
      const id = await Chef.create({
        name: req.body.name,
        avatar: file_id,
        created_at: parseDate(Date.now()).iso,
      });
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
    try {
      let chef = await Chef.find(req.params.id);
      if (!chef)
        return res.render("admin/chefs/index", {
          user: req.user,
          error: "Chef não encontrado!",
        });
      chef = await chefServices.getChef(chef);
      const blockDelete = chef.total_recipes > 0 ? true : false;
      return res.render("admin/chefs/edit", {
        user: req.user,
        chef,
        blockDelete,
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { user: req.user });
    }
  },
  async put(req, res) {
    try {
      const avatar = { name: req.files[0]?.filename, path: req.files[0]?.path };
      let file_id = (await Chef.find(req.body.id)).avatar
      if (avatar.name && avatar.path ) {
        file_id = await File.create({
          name: avatar.name,
          path: avatar.path,
        });
      }
  
      await Chef.update(req.body.id, { name: req.body.name, avatar: file_id });
      
      if (req.body.removed_files) {
        const removed_files = req.body.removed_files.split(",");
        removed_files.pop();
        const removedFilesPromise = removed_files.map(async (id) => {
          const pathFile = (await File.find(id))?.path;
          unlinkSync(pathFile);
          await File.delete(id)
        });
        await Promise.all(removedFilesPromise);
      }
  
      return res.redirect(`/admin/chefs/${req.body.id}`);
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { user: req.user });
    }
  },
  async delete(req, res) {
    try {
      const avatar = (await Chef.find(req.body.id)).avatar;
      const pathFile = (await File.find(avatar)).path;
      unlinkSync(pathFile);
      await Chef.delete(req.body.id);
      await File.delete(avatar);
  
      return res.render(`admin/profile/index`, {
        user: req.user,
        success: "Chef deletado com sucesso!",
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", { user: req.user });
    }
  },
};
