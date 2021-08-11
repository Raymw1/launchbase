module.exports = {
  parseToArray(variable) {
    if (!Array.isArray(variable)) {
      return [variable];
    }
    return variable;
  },
  verifyForm(req, callback) {
    const keys = Object.keys(req.body);
    keys.forEach((key) => {
      if (key != "removed_files" && key != "photos") {
        if (Array.isArray(req.body[key])) {
          req.body[key].forEach((input) => {
            if (input.trim() === "") {
              callback();
            }
          });
        } else if (req.body[key].trim() === "") {
          callback();
        }
      }
    });
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
