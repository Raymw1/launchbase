const db = require("../../config/db");

const Base = require("./Base");

Base.init({ table: "categories" });

module.exports = {
  ...Base,
};

