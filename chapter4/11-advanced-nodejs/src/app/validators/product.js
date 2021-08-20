module.exports = {
  async post(req, res, next) {
    const keys = Object.keys(req.body);
    for (let key of keys) {
      if (req.body[key] == "") {
        return res.send(`Por favor, volte e preencha todos os campos!`);
      }
    }
    if (!req.files || req.files.length == 0)
      return res.send("Por favor, envie pelo menos 1 imagem!");
    next();
  },
  async put(req, res, next) {
    const keys = Object.keys(req.body);
    for (let key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.send(`Por favor, volte e preencha todos os campos!`);
      }
    }
    next();
  },
};
