const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const paginateService = {
  load(table, fields) {
    if (!table || !fields) throw new Error("Invalida Params!");
    this.table = table;
    return this.paginate(fields);
  },
  async paginate(fields) {
    let { filter, page, limit } = fields;
    page = page || 1;
    limit = limit || 2;
    const offset = limit * (page - 1);
    const params = {
      filter,
      page,
      limit,
      offset,
    };
    return params;
  },
};

module.exports = paginateService;