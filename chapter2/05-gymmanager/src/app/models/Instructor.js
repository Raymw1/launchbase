const db = require("../../config/db");
const { parseAge, parseDate } = require("../../lib/utils");

module.exports = {
  all(callback) {
    db.query("SELECT * FROM instructors;", function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows);
    });
  },
  create(data, callback) {
    const query = `
    INSERT INTO instructors ( name, avatar_url, gender, services, birth, created_at) VALUES (
      $1, $2, $3, $4, $5, $6
    ) RETURNING id;
  `;

    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.services,
      parseDate(data.birth).iso,
      parseDate(Date.now()).iso,
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Databese error! ${err}`;
      callback(results.rows[0].id);
    });
  },
  find(id, callback) {
    db.query(
      `SELECT * FROM instructors WHERE id = ${id}`,
      function (err, results) {
        if (err) throw `Database error! ${err}`;
        callback(results.rows[0]);
      }
    );
  },
  update(data, callback) {
    const query = `
    UPDATE instructors SET 
      avatar_url=($1),
      name=($2),
      birth=($3),
      gender=($4),
      services=($5)
    WHERE id = $6
    `;

    const values = [
      data.avatar_url,
      data.name,
      parseDate(data.birth).iso,
      data.gender,
      data.services,
      data.id,
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback();
    });
  },
  delete(id, callback) {
    db.query(`DELETE FROM instructors WHERE id = ${id}`, function (err) {
      if (err) throw `Database error! ${err}`;
      callback();
    })
  }
};
