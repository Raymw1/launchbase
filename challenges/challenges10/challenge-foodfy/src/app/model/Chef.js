const db = require("../../config/db");
const { parseDate } = require("../../lib/utils");
const File = require("./File");
const Base = require("./Base");

Base.init({ table: "chefs" });

function find(select, joins, filters, group_by) {
  let query = `SELECT chefs.*, count(recipes) AS total_recipes`;
      query += select ? `, ${select}` : ``;
      query += ` FROM chefs LEFT JOIN recipes ON(recipes.chef_id = chefs.id)`
      query += joins ? ` ${joins}` : ``;
      query += filters ? ` ${filters} GROUP BY chefs.id` : ` GROUP BY chefs.id` ;
      query += group_by ? `, ${group_by}` : ``
  return db.query(query);
}


module.exports = {
  ...Base,
  async findAll() {
    const results = await find();
    return results.rows;
  },
  async find(id) {
    const select = `files.path AS image`,
      joins = `RIGHT JOIN files ON(chefs.avatar = files.id)`,
      filters = `WHERE chefs.id = ${id}`,
      group_by = `files.path`;
    const results = await find(select, joins, filters, group_by);
    return results.rows[0];
  },
};
