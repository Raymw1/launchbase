const db = require("../../config/db");
const { parseToArray, verifyForm, parseDate } = require("../../lib/utils");
const File = require("./File");

module.exports = {
  all() {
    return db.query(`SELECT recipes.*, chefs.name as chef_name FROM recipes 
    LEFT JOIN chefs ON (chefs.id = recipes.chef_id)`);
  },
  find(id) {
    return db.query(`SELECT recipes.*, chefs.name as chef_name FROM recipes 
    LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    WHERE recipes.id = $1`, [id]);
  },
  findBy(filter, callback) {
    db.query(`SELECT recipes.*, chefs.name as chef_name FROM recipes 
    LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    WHERE recipes.title ILIKE '%${filter}%' ORDER BY recipes.title`, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows);      
    })
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params;
    let query = "",
      filterQuery="",
      totalQuery="(SELECT count(*) FROM recipes) AS total";
    if (filter) {
      filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;
      totalQuery = `(SELECT count(*) FROM recipes ${filterQuery}) AS total`;
    }
    query = `
    SELECT recipes.*, chefs.name as chef_name, ${totalQuery} FROM recipes 
    LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    ${filterQuery}
    GROUP BY recipes.id, chefs.name LIMIT $1 OFFSET $2
    ;`
    return db.query(query, [limit, offset])
  },
  create(data) {
    const query = `
    INSERT INTO recipes (
        chef_id, 
        title, 
        ingredients, 
        preparation,
        information,
        created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;
    const values = [
      data.chef_id,
      data.title,
      parseToArray(data.ingredients),
      parseToArray(data.preparation),
      data.information,
      parseDate(Date.now()).iso,
    ];
    return db.query(query, values)
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
};
