const db = require("../../config/db");

function find(filters, table) {
  let query = `SELECT * FROM ${table}`;
  if (filters) {
    Object.keys(filters).map((key) => {
      query += ` ${key}`;
      Object.keys(filters[key]).map((field) => {
        query += ` ${field} = '${filters[key][field]}'`;
      });
    });
  }
  return db.query(query);
}

const Base = {
  init({ table }) {
    if (!table) throw new Error("Invalid params! No database");
    this.table = table;
    return this;
  },
  async find(id) {
    const results = await find({ where: {id} }, this.table);
    return results.rows[0];
  },
  async findOne(filters) {
    const results = await find(filters, this.table);
    return results.rows[0];
  },
  async findAll(filters) {
    const results = await find(filters, this.table);
    return results.rows;
  },
  async create(fields) {
    try {
      let keys = [],
        values = [];
      Object.keys(fields).map(key => {
        keys.push(key);
        values.push(fields[key]);
      })
      keys = keys.join(",");
      values = values.join(",");
      const query = `INSERT INTO ${this.table} (${keys}) VALUES (${values}) RETURNING id`;
      const results = await db.query(query);
      return results.rows[0].id;
    } catch (err) {
      console.log(err);
    }
  },
  async updete(id, fields) {
    try {
      let values = [];
      Object.keys(fields).map(key => {
        values.push(`${key} = '${fields[key]}'`);
      })
      values = values.join(",");
      const query = `UPDATE ${this.table} SET ${values} WHERE id = ${id} RETURNING id`;
      const results = await db.query(query);
      return results.rows[0].id;
    } catch (err) {
      console.log(err);
    }
  },
  async delete(id) {
    return db.query(`DELETE FROM ${this.table} WHERE id = $1;`, [id]);
  },
};

module.exports = Base;
