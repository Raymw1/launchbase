const db = require("../../config/db");
const { parseAge, parseDate, parseBlood } = require("../../lib/utils");

module.exports = {
  all(callback) {
    db.query("SELECT * FROM members ORDER BY name ASC;", function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback(results.rows);
    });
  },
  create(data, callback) {
    const query = `
    INSERT INTO members ( name, avatar_url, gender, email, birth, blood, weight, height, instructor_id) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    ) RETURNING id;
  `;

    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.email,
      parseDate(data.birth).iso,
      data.blood,
      data.weight,
      data.height,
      data.instructor
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Databese error! ${err}`;
      callback(results.rows[0].id);
    });
  },
  find(id, callback) {
    db.query(
      `SELECT members.*, instructors.name AS instructor_name FROM members
        LEFT JOIN instructors ON (members.instructor_id = instructors.id)
        WHERE members.id = ${id}`,
      function (err, results) {
        if (err) throw `Database error! ${err}`;
        callback(results.rows[0]);
      }
    );
  },
  update(data, callback) {
    const query = `
    UPDATE members SET 
      avatar_url=($1),
      name=($2),
      birth=($3),
      gender=($4),
      email=($5),
      blood=($6),
      weight=($7),
      height=($8),
      instructor_id=($9)
    WHERE id = $10
    `;

    const values = [
      data.avatar_url,
      data.name,
      parseDate(data.birth).iso,
      data.gender,
      data.email,
      data.blood,
      data.weight,
      data.height,
      data.instructor,
      data.id,
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Database error! ${err}`;
      callback();
    });
  },
  delete(id, callback) {
    db.query(`DELETE FROM members WHERE id = ${id}`, function (err) {
      if (err) throw `Database error! ${err}`;
      callback();
    })
  },
  instructorsSelectOptions(callback) {
    db.query(`SELECT id, name FROM instructors;`, function (err, results) {
      if (err) throw `Read database error! ${err}`;
      callback(results.rows);
    });
  }
};
