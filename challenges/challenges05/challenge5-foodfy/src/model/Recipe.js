const db = require("../config/db");
const { parseToArray, verifyForm, parseDate } = require("../lib/utils");

module.exports = {
  all(callback) {
    db.query(`SELECT recipes.*, chefs.name as chef_name FROM recipes 
    LEFT JOIN chefs ON (chefs.id = recipes.chef_id)`, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows);      
    })
  },
  find(id, callback) {
    db.query(`SELECT recipes.*, chefs.name as chef_name FROM recipes 
    LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    WHERE recipes.id = $1`, [id], function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows[0]);
    })
  },
  findBy(filter, callback) {
    db.query(`SELECT recipes.*, chefs.name as chef_name FROM recipes 
    LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    WHERE recipes.title ILIKE '%${filter}%' ORDER BY recipes.title`, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows);      
    })
  },
  create(data, callback) {
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
    db.query(query, values, function (err, results) {
        if (err) throw `Database error! ${err}`;
        callback(results.rows[0].id)
    })
  },
  chefSelectOptions(callback) {
    db.query(`SELECT id, name FROM chefs;`, function (err, results) {
      if (err) throw `Database Error! ${err}`;
      callback(results.rows);
    })
  },
  update(data, callback) {
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
    db.query(query, values, function (err, results) {
        if (err) throw `Database error! ${err}`;
        callback()
    });
  },
  delete(id, callback) {
    db.query(`DELETE FROM recipes WHERE id = $1`, [id], function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback()
    })
  }
};
