const db = require("../../config/db");
const {
  parseAge,
  parseClassType,
  parseDate,
  parseEducationLevel,
  parseSubjectsTaught,
} = require("../../lib/utils");

module.exports = {
  all(callback) {
    db.query(
      "SELECT * FROM students ORDER BY name ASC;",
      function (err, results) {
        if (err) throw `Database error! ${err}`;
        callback(results.rows);
      }
    );
  },
  create(data, callback) {
    const query = `
    INSERT INTO students ( avatar_url, name, email, birth_date, education_level, weektime)
    VALUES ( $1, $2, $3, $4, $5, $6) RETURNING id;
    `;

    const values = [
      data.avatar_url,
      data.name,
      data.email,
      parseDate(data.birth_date).iso,
      data.education_level,
      data.weektime
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows[0].id);
    });
  },
  find(id, callback) {
    db.query(
      `SELECT * FROM students WHERE id = ${id}`,
      function (err, results) {
        if (err) throw `Database error! ${err}`;
        callback(results.rows[0]);
      }
    );
  },
  update(data, callback) {
    const query = `
    UPDATE students SET
      avatar_url=($1),
      name=($2),
      email=($3),
      birth_date=($4),
      education_level=($5),
      weektime=($6)
    WHERE id = $7;
    `;

    const values = [
      data.avatar_url,
      data.name,
      data.email,
      parseDate(data.birth_date).iso,
      data.education_level,
      data.weektime,
      data.id
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback();
    });
  },
  delete(id, callback) {
    db.query(`DELETE FROM students WHERE id = ${id}`, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback();
    });
  },
};
