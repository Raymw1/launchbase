module.exports = {
  parseToArray(variable) {
    if (!Array.isArray(variable)) {
      return [variable];
    }
    return variable;
  },
  verifyForm(body) {
    const keys = Object.keys(body);
    for (key of keys) {
      if (Array.isArray(body[key])) {
        for (let subkey in key) {
          if ((body[key][subkey])?.trim() == "") {
            return { user: body, error: "Insira todos os valores!" };
          }
        }
      } else {
        if (key != "removed_files" && (body[key]).trim() == "") {
          return { user: body, error: "Insira todos os valores!" };
        }
      }
    }
    // if (req.files?.length == 0)
    //   callback();
  },
  parseDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.slice(-2);
    const day = `${date.getDate()}`.slice(-2);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return {
      day,
      month,
      year,
      hour,
      minutes,
      birthday: `${day}/${month}`,
      format: `${day}/${month}/${year}`,
      iso: `${year}/${month}/${day}`,
    };
  },
};
