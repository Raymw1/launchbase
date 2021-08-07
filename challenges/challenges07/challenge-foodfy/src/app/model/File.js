const db = require("../../config/db");
const fs = require("fs");

module.exports = {
  async create({filename, path, recipe_id}) {    
    const query = `INSERT INTO files (name, path) VALUES ($1, $2) RETURNING id;`;
    const values = [filename, path];
    const file_id = (await db.query(query, values)).rows[0].id;
    return db.query(`INSERT INTO recipe_files (recipe_id, file_id) VALUES ($1, $2);`, [recipe_id, file_id]);
  },
  async delete(id) {
    try {
      const pathFile = (await db.query("SELECT path FROM files WHERE id = $1", [id])).rows[0]?.path;
      fs.unlinkSync(pathFile);
      await db.query("DELETE FROM recipe_files WHERE file_id = $1;", [id]);
      return await db.query("DELETE FROM files WHERE id = $1;", [id]);
    } catch (err) {
      console.error(err);
    }
  }
};
