const db = require("../../config/db");
const fs = require("fs");
const Base = require("./Base");

Base.init({ table: "files" });

module.exports = {
  ...Base,
  async delete(id) {
    try {
      const pathFile = (await db.query("SELECT path FROM files WHERE id = $1", [id])).rows[0].path;
      fs.unlinkSync(pathFile);
      return db.query("DELETE FROM files WHERE id = $1", [id]);
    } catch (err) {
      console.error(err);
    }
  }
};

