const fs = require("fs"); // File system
const data = require("../data.json");
const { parseAge, parseDate, parseBlood } = require("../utils");

exports.index = function (req, res) {
  return res.render("members/index", { members: data.members });
};

exports.create = function (req, res) {
  return res.render("members/create");
};

exports.show = function (req, res) {
  const { id } = req.params; // const id = req.params.id;
  const foundMember = data.members.find((member) => member.id == id);
  if (!foundMember) return res.send("Member not found!");

  const member = {
    ...foundMember,
    // birth: parseDate(foundMember.birth).split("-").reverse().join("/"),
    birth: parseDate(foundMember.birth).birthday,
    blood: parseBlood(foundMember.blood)
  };
  return res.render("members/show", { member });
};

exports.post = function (req, res) {
  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    if (req.body[key] == "") {
      return res.send(`Error, please insert value in ${key}`);
    }
  });

  // Get only these from req.body

  const lastId = data.members[data.members.length - 1]?.id;
  const id = lastId + 1 || 1;
  

  birth = Date.parse(req.body.birth);

  data.members.push({
    id,
    ...req.body,
    birth,
  });
  // Create and write in file converting to JSON
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write file error!");
  });
  return res.redirect("/members");
  //   return res.send(req.body);
};

exports.edit = function (req, res) {
  const { id } = req.params;
  const foundMember = data.members.find((member) => member.id == id);
  if (!foundMember) return res.send("Member not found!");
  const member = {
    ...foundMember,
    birth: parseDate(foundMember.birth).iso,
  };
  return res.render("members/edit", { member });
};

exports.put = function (req, res) {
  const { id } = req.body;
  let index = 0;
  const foundMember = data.members.find((member, foundIndex) => {
    if (member.id == id) {
      index = foundIndex;
      return true;
    }
  });
  if (!foundMember) return res.send("Member not found!");
  const member = {
    ...foundMember,
    ...req.body,
    id: Number(id),
    birth: Date.parse(req.body.birth),
  };
  data.members[index] = member;
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Wite error");
    return res.redirect(`/members/${id}`);
  });
};

exports.delete = function (req, res) {
  const { id } = req.body;
  const members = data.members.filter((member) => member.id != id);
  data.members = members;
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write file error!");
    return res.redirect(`/members`);
  });
};
