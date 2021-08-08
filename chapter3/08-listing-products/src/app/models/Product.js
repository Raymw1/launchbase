const db = require("../../config/db");
const { parseAge, parseDate } = require("../../lib/utils");

module.exports = {
  all() {
    return db.query(`SELECT * FROM products ORDER BY updated_at DESC;`)
  },
  find(id) {
    return db.query(`SELECT * FROM products WHERE id = $1`, [id]);
  },
  create(data) {
    const query = `
    INSERT INTO products ( category_id, user_id, name, description, old_price, price, quantity, status) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`;

    data.price = data.price.replace(/\D/g, ""); // Get only digits/numbers
    const values = [
      data.category_id,
      data.user_id || 1,
      data.name,
      data.description,
      data.old_price || data.price,
      data.price,
      data.quantity,
      data.status || 1
    ];

    return db.query(query, values);
  },
  update(data) {
    const query = `
      UPDATE products SET
        category_id=($1),
        user_id=($2),
        name=($3),
        description=($4),
        old_price=($5),
        price=($6),
        quantity=($7),
        status=($8)
      WHERE id = $9;
    `;
    const values =[
      data.category_id,
      data.user_id,
      data.name,
      data.description,
      data.old_price,
      data.price,
      data.quantity,
      data.status,
      data.id
    ];
    return db.query(query, values)
  },
  async delete(id) {
    await db.query("DELETE FROM files WHERE product_id = $1", [id]);
    return db.query("DELETE FROM products WHERE id = $1", [id]);
  },
  files(id) {
    return db.query("SELECT * FROM files WHERE product_id = $1;", [id]);
  }
};
