const Member = require("../models/Member");
const { parseAge, parseDate, parseBlood } = require("../../lib/utils");

module.exports = {
  index(req, res) {
    let { filter, page, limit } = req.query;
    page = page || 1;
    limit = limit || 2;
    let offset = limit * (page - 1);
    const params = {
      filter,
      page,
      limit,
      offset,
      callback(members) {
        const pagination = {
          total: Math.ceil(members[0].total / limit),
          page
        }
        return res.render("members/index", { members, filter, pagination });
      },
    };
    Member.paginate(params);
  },
  show(req, res) {
    const { id } = req.params
    Member.find(id, function (member) {
      if (!member) return res.send("Member not found!");
      member.birth = parseDate(member.birth).birthday;
      member.blood = parseBlood(member.blood);
      return res.render(`members/show`, { member });
    })
  },
  create(req, res) {
    Member.instructorsSelectOptions(function (options) {
      return res.render("members/create", { instructors: options });
    })
  },
  post(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key] == "") {
        return res.send(`Error, please insert value in ${key}`);
      }
    });

    Member.create(req.body, function(id) {
      return res.redirect(`/members/${id}`);
    })
  },
  edit(req, res) {
    const { id } = req.params
    Member.find(id, function (member) {
      if (!member) return res.send("Member not found!");
      member.birth = parseDate(member.birth).iso;
      Member.instructorsSelectOptions(function (options) {
        return res.render(`members/edit`, { member, instructors: options });
      })
    })
  },
  put(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (req.body[key] == "") {
        return res.send(`Error, please insert value in ${key}`);
      }
    });
    Member.update(req.body, function () {
      return res.redirect(`/members/${req.body.id}`);
    })
  },
  delete(req, res) {
    Member.delete(req.body.id, function() {
      return res.redirect("/members")
    })
  },
};
