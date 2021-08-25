const db = require("../../config/db");
const {
  parseDate,
} = require("../../lib/utils");
const Base = require("./Base");

Base.init({ table: "teachers" });

module.exports = {
  ...Base,
  findBy(filter, callback) {
    db.query(
      `SELECT teachers.*, count(students) AS total_students FROM teachers 
        LEFT JOIN students ON (students.teacher_id = teachers.id) 
        WHERE teachers.name ILIKE '%${filter}%' OR 
        teachers.subjects_taught ILIKE '%${filter}%'
        GROUP BY teachers.id ORDER BY total_students DESC;`,
      function (err, results) {
        if (err) throw `Database error! ${err}`;
        callback(results.rows);
      }
    );
  },
};
