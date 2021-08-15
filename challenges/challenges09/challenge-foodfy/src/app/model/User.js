const db = require("../../config/db");
const { hash } = require("bcryptjs");

module.exports = {
  async findOne(fields) {
    try {
      let query = "SELECT * FROM users";
      Object.keys(fields).map(key => {
        query = `${query} ${key}`;
        Object.keys(fields[key]).map(field => {
          query = `${query} ${field} = '${fields[key][field]}'`;
        });
      });
      const results = await db.query(query);
      return results.rows[0];
    } catch (err) {
      console.error(err)
    }
  },
  async create(data) {
    try {
      const query = `INSERT INTO users (name, email, password, is_admin) 
      VALUES ($1, $2, $3, $4) RETURNING id;`;
      const hashPassword = await hash(data.password, 8);
      const is_admin = data.is_admin ? true : false
      const values = [
        data.name,
        data.email,
        hashPassword,
        is_admin
      ]
      const results = await db.query(query, values);
      return results.rows[0].id;
    } catch (err) {
      console.log(err);
    }
  }
}