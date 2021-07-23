const fs = require("fs");
const data = require("./model/data.json");

exports.post = function (req, res) {
    const keys = Object.keys(req.body);
    keys.forEach(key => {
        if ((req.body[key]).trim() === "") return res.send(`Error, please insert value in ${key}`);
    });
    
    let { avatar_url, name, birth, degree, classtype, services } = req.body;

    const id = data.teachers.length + 1;
    birth = Date.parse(birth);
    const created_at = Date.now()

    data.teachers.push({ id, avatar_url, name, birth, degree, classtype, services, created_at });
    fs.writeFile("src/model/data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send("Write file error!");
    });
    return res.redirect("/teachers");

};
