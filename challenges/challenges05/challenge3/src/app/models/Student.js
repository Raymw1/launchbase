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
    INSERT INTO students ( avatar_url, name, email, birth_date, education_level, weektime, teacher_id)
    VALUES ( $1, $2, $3, $4, $5, $6, $7) RETURNING id;
    `;

    const values = [
      data.avatar_url,
      data.name,
      data.email,
      parseDate(data.birth_date).iso,
      data.education_level,
      data.weektime,
      data.teacher
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows[0].id);
    });
  },
  find(id, callback) {
    db.query(
      `SELECT students.*, teachers.name AS teacher_name FROM students 
        LEFT JOIN teachers ON (students.teacher_id = teachers.id)
        WHERE students.id = ${id}`,
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
      weektime=($6),
      teacher_id=($7)
    WHERE id = $8;
    `;

    const values = [
      data.avatar_url,
      data.name,
      data.email,
      parseDate(data.birth_date).iso,
      data.education_level,
      data.weektime,
      data.teacher,
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
  teachersSelectOptions(callback) {
    db.query(`SELECT id, name FROM teachers`, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows);
    })
  }
};
