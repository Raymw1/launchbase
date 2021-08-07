const db = require("../../config/db");

module.exports = {
  insertReference(filename, path) {
    const query = `INSERT INTO files (name, path) VALUES ($1, $2) RETURNING id;`;
    const values = [filename, path];
    return db.query(query, values);
  },
  async create({filename, path, recipe_id}) {
    const file_id = (await this.insertReference(filename, path)).rows[0].id;
    return db.query(`INSERT INTO recipe_files (recipe_id, file_id) VALUES ($1, $2);`, [recipe_id, file_id]);
  }
};
