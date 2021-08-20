const db = require("../../config/db");
const { hash } = require("bcryptjs");
const Product = require("./Product");
const fs = require("fs");
const Base = require("./Base");

Base.init({ table: 'users' });

const User = {
  ...Base,
  async delete(id) {
    let results = await db.query("SELECT * FROM products WHERE user_id = $1", [
      id,
    ]);
    const products = results.rows;

    const allFilesPromise = products.map((product) => Product.files(product.id));
    let promiseResults = await Promise.all(allFilesPromise);

    await db.query("DELETE FROM users WHERE id = $1", [id]);

    promiseResults.map((files) => {
      files.map((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error(err);
        }
      });
    });
  },
};

module.exports = User;