const db = require("../../config/db");
const { parseDate } = require("../../lib/utils");

module.exports = {
  all() {
    return db.query(`SELECT chefs.*, count(recipes) AS total_recipes FROM chefs
    LEFT JOIN recipes ON(recipes.chef_id = chefs.id)
    GROUP BY chefs.id;`);
  },
  find(id) {
    return db.query(
      `SELECT chefs.*, count(recipes) AS total_recipes FROM chefs
    LEFT JOIN recipes ON(recipes.chef_id = chefs.id)
    WHERE chefs.id = $1 GROUP BY chefs.id;`,
      [id]
    );
  },
  create(data, file_id) {
    const query = `
    INSERT INTO chefs (name, avatar, created_at) VALUES ($1, $2, $3) RETURNING id;`;
    const values = [data.name, file_id, parseDate(Date.now()).iso];
    return db.query(query, values);
  },
  update(data) {
    const query = `
    UPDATE chefs SET name=($1), avatar_url=($2) WHERE id = $3;`;
    const values = [data.name, data.avatar_url, data.id];
    return db.query(query, values);
  },
  delete(id) {
    return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
  },
  getRecipes(id) {
    return db.query(
      `SELECT id, title FROM recipes WHERE chef_id = $1;`,
      [id]
    );
  },
  getImage(id) {
    return db.query(`SELECT * FROM files WHERE id = $1`, [id]);
  }
};
