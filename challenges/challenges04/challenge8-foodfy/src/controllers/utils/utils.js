module.exports = {
  parseToArray(variable) {
    if (!Array.isArray(variable)) {
      return [variable];
    }
    return variable;
  },
  verifyForm(req, res) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (Array.isArray(req.body[key])) {
        req.body[key].forEach((input) => {
          if (input.trim() === "") {
            return res.send(`Erro, por favor insira todos os campos!`);
          }
        });
      } else if (req.body[key].trim() === "") {
        return res.send(`Erro, por favor insira todos os campos!`);
      }
    });
  },
};
