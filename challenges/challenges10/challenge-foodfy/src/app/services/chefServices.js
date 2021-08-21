const Chef = require("../model/Chef");

module.exports = {
  async getChefs(rows, req) {
    const chefs = rows.map(async (chef) => {
      const path = (await Chef.getImage(chef.avatar)).rows[0].path.replace(
        "public",
        ""
      );
      const image = `${req.protocol}://${req.headers.host}${path}`;
      return {
        ...chef,
        image,
      };
    });
    return await Promise.all(chefs);
  },
};
