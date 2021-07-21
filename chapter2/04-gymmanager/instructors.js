const fs = require("fs"); // File system
const data = require("./data.json");

exports.post = function (req, res) {
  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    if (req.body[key] == "") {
      return res.send(`Error, please insert value in ${key}`);
    }
  });
  req.body.birth = Date.parse(req.body.birth);
  req.body.created_at = Date.now()
  data.instructors.push(req.body);
  // Create and write in file converting to JSON
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write file error!");
    return res.redirect("/instructors");
  });
  //   return res.send(req.body);
};
