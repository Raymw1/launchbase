const db = require("../config/db");
const { parseDate } = require("../lib/utils")

module.exports = {
  all(callback) {
    db.query(`SELECT chefs.*, count(recipes) AS total_recipes FROM chefs
    LEFT JOIN recipes ON(recipes.chef_id = chefs.id)
    GROUP BY chefs.id;`, function(err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows);      
    })
  },
  find(id, callback) {
    db.query(`SELECT chefs.*, count(recipes) AS total_recipes FROM chefs
    LEFT JOIN recipes ON(recipes.chef_id = chefs.id)
    WHERE chefs.id = $1 GROUP BY chefs.id;`, [id], function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows[0]);
    })
  },
  create(data, callback) {
    const query = `
    INSERT INTO chefs (name, avatar_url, created_at) VALUES ($1, $2, $3) RETURNING id;`;
    const values = [data.name, data.avatar_url, parseDate(Date.now()).iso];
    db.query(query, values, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows[0].id);
    });
  },
  update(data, callback) {
    const query = `
    UPDATE chefs SET name=($1), avatar_url=($2) WHERE id = $3;`;
    const values = [data.name, data.avatar_url, data.id];
    db.query(query, values, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback();
    });
  },
  delete(id, callback) {
    db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results) {
      if (err) throw `Database error! ${err}`;
      callback();
    })
  },
  getRecipes(id, callback) {
    db.query(`SELECT id, image, title FROM recipes WHERE chef_id = $1;`, [id], function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows);
    })
  }
  
};
