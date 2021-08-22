const db = require("../../config/db");
const { parseToArray, verifyForm, parseDate } = require("../../lib/utils");
const File = require("./File");
const Base = require("./Base");

Base.init({ table: "recipes" });


module.exports = {
  ...Base,
  async allOfUser(userId) {
    const results = await db.query(`SELECT * FROM recipes WHERE user_id = $1 
    ORDER BY recipes.created_at DESC`, [userId]);
    return results.rows;
  },
  findBy(filter, callback) {
    db.query(`SELECT recipes.*, chefs.name as chef_name FROM recipes 
    LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    WHERE recipes.title ILIKE '%${filter}%' ORDER BY recipes.title`, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows);      
    })
  },
  async paginate(params) {
    const { filter, limit, offset } = params;
    let query = "",
      filterQuery="",
      totalQuery="(SELECT count(*) FROM recipes) AS total";
    if (filter) {
      filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;
      totalQuery = `(SELECT count(*) FROM recipes ${filterQuery}) AS total`;
    }
    query = `
    SELECT recipes.*, ${totalQuery} FROM recipes 
    ${filterQuery}
    ORDER BY recipes.updated_at DESC LIMIT $1 OFFSET $2
    ;`
    const results = await db.query(query, [limit, offset]);
    return results.rows;
  },
  async delete(id) {
    const files = (await db.query(`SELECT file_id FROM recipe_files WHERE recipe_id = $1;`, [id])).rows;
    await db.query(`DELETE FROM recipe_files WHERE recipe_id = $1`, [id]);
    const filesPromise = files.map(async (file) => {
      db.query(`DELETE FROM files WHERE id = $1`, [file.file_id])
      File.delete(file.file_id);
    });
    await Promise.all(filesPromise);
    return db.query(`DELETE FROM recipes WHERE id = $1`, [id]);
  },
  async getImage(id) {
    const image_id = (await db.query(`SELECT file_id FROM recipe_files WHERE recipe_id = $1;`, [id])).rows[0]?.file_id;
    return (await db.query(`SELECT path FROM files WHERE id = $1`, [image_id])).rows[0]?.path;

  }
};
