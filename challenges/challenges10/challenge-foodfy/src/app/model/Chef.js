const db = require("../../config/db");
const { parseDate } = require("../../lib/utils");
const File = require("./File");
const Base = require("./Base");

Base.init({ table: "chefs" });



module.exports = {
  ...Base,
  async findAll() {
    const results = await db.query(`SELECT chefs.*, count(recipes) AS total_recipes FROM chefs
    LEFT JOIN recipes ON(recipes.chef_id = chefs.id)
    GROUP BY chefs.id;`);
    return results.rows;
  },
  find(id) {
    return db.query(
      `SELECT chefs.*, count(recipes) AS total_recipes, files.path AS image FROM chefs
    LEFT JOIN recipes ON(recipes.chef_id = chefs.id)
    RIGHT JOIN files ON(chefs.avatar = files.id)
    WHERE chefs.id = $1 GROUP BY chefs.id, files.path;`,
      [id]
    );
  },
  create(data, file_id) {
    const query = `
    INSERT INTO chefs (name, avatar, created_at) VALUES ($1, $2, $3) RETURNING id;`;
    const values = [data.name, file_id, parseDate(Date.now()).iso];
    return db.query(query, values);
  },
  update(data, file_id) {
    const query = `
    UPDATE chefs SET name=($1), avatar=($2) WHERE id = $3;`;
    const values = [data.name, file_id, data.id];
    return db.query(query, values);
  },
  async delete(id) {
    const avatar = (await db.query(`SELECT avatar FROM chefs WHERE id = $1;`, [id])).rows[0].avatar;
    await db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
    return File.deleteChef(avatar);
  },
  getRecipes(id) {
    return db.query(
      `SELECT recipes.id, recipes.title, (SELECT path FROM files WHERE id = recipe_files.file_id) AS image
      FROM recipes 
      INNER JOIN recipe_files 
      ON (recipes.id = recipe_files.recipe_id)
      WHERE chef_id = $1 GROUP BY recipes.id, recipe_files.file_id`,
      [id]
    );
  }
};
