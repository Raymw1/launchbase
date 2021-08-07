module.exports = {
  parseToArray(variable) {
    if (!Array.isArray(variable)) {
      return [variable];
    }
    return variable;
  },
  verifyForm(data, callback) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].forEach((input) => {
          if (input.trim() === "") {
            callback();
          }
        });
      } else if (data[key].trim() === "") {
        callback();
      }
    });
  },
  parseDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = `${date.getUTCMonth() + 1}`.slice(-2);
    const day = `${date.getUTCDate()}`.slice(-2);
    return {
      day,
      month,
      year,
      birthday: `${day}/${month}`,
      format: `${day}/${month}/${year}`,
      iso: `${year}/${month}/${day}`,
    };
  },
};
