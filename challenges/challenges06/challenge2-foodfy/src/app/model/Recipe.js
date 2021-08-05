const db = require("../../config/db");
const { parseToArray, verifyForm, parseDate } = require("../../lib/utils");

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
        image, 
        title, 
        ingredients, 
        preparation,
        information,
        created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`;
    const values = [
      data.chef_id,
      data.image_url,
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
      image=($2),
      title=($3),
      ingredients=($4),
      preparation=($5),
      information=($6) 
    WHERE id = $7;`;
    const values = [
      data.chef_id,
      data.image_url,
      data.title,
      parseToArray(data.ingredients),
      parseToArray(data.preparation),
      data.information,
      data.id,
    ];
    return db.query(query, values);
  },
  delete(id) {
    return db.query(`DELETE FROM recipes WHERE id = $1`, [id]);
  }
};
