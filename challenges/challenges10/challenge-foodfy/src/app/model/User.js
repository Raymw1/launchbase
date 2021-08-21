const db = require("../../config/db");
const { hash } = require("bcryptjs");
const Base = require("./Base");

Base.init({ table: "users" });



module.exports = {
  ...Base,
  // async all() {
  //   const users = await db.query(`SELECT id, name, email, is_admin FROM users;`);
  //   return users.rows;
  // },
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
  },
}