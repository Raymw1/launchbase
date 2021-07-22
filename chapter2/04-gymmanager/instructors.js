const fs = require("fs"); // File system
const data = require("./data.json");

exports.post = function (req, res) {
  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    if (req.body[key] == "") {
      return res.send(`Error, please insert value in ${key}`);
    }
  });
  
  // Get only these from req.body
  let { avatar_url, birth, name, services, gender } = req.body;
  
  const id = Number(data.instructors.length + 1);
  birth = Date.parse(req.body.birth);
  const created_at = Date.now()


  data.instructors.push({ id, avatar_url, name, birth, gender, services, created_at });
  // Create and write in file converting to JSON
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write file error!");
  });
  return res.redirect("/instructors");
  //   return res.send(req.body);
};
