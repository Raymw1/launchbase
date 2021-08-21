const db = require("../../config/db");
const { parseToArray, verifyForm, parseDate } = require("../../lib/utils");
const File = require("./File");
const Base = require("./Base");

Base.init({ table: "recipes" });


module.exports = {
  ...Base,
  async all() {
    // ORDER BY recipes.created_at DESC
    return;
  },
  allOfUser(userId) {
    return db.query(`SELECT recipes.*, chefs.name as chef_name FROM recipes 
    LEFT JOIN chefs ON (chefs.id = recipes.chef_id) WHERE user_id = $1 
    ORDER BY recipes.created_at DESC`, [userId]);
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
  async create(data, userId) {
    const query = `
    INSERT INTO recipes (
        chef_id, 
        title, 
        ingredients, 
        preparation,
        information,
        user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;
    const values = [
      data.chef_id,
      data.title,
      parseToArray(data.ingredients),
      parseToArray(data.preparation),
      data.information,
      userId
    ];
    return await db.query(query, values)
  },
  chefSelectOptions() {
    return db.query(`SELECT id, name FROM chefs;`);
  },
  update(data) {
    const query = `
    UPDATE recipes SET 
      chef_id=($1), 
      title=($2),
      ingredients=($3),
      preparation=($4),
      information=($5) 
    WHERE id = $6;`;
    const values = [
      data.chef_id,
      data.title,
      parseToArray(data.ingredients),
      parseToArray(data.preparation),
      data.information,
      data.id,
    ];
    return db.query(query, values);
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
  files(recipe_id) {
    const query = `SELECT files.* FROM files 
    LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
    WHERE recipe_files.recipe_id = $1 GROUP BY files.id`;
    return db.query(query, [recipe_id]);
  },
  async getImage(id) {
    const image_id = (await db.query(`SELECT file_id FROM recipe_files WHERE recipe_id = $1;`, [id])).rows[0]?.file_id;
    return (await db.query(`SELECT path FROM files WHERE id = $1`, [image_id])).rows[0]?.path;

  }
};
