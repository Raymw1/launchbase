const Chef = require("../model/Chef");
const File = require("../model/File");

module.exports = {
  async getChef(chef) {
    return {
      ...chef,
      image: (await File.find(chef.avatar)).path.replace("public", ""),
    };
  },
  async getChefs(chefs) {
    const chefsPromise = chefs.map(async (chef) => {
      return {
        ...chef,
        image: (await File.find(chef.avatar)).path.replace("public", ""),
      };
    });
    return await Promise.all(chefsPromise);
  },
};
