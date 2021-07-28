module.exports = {
  parseAge(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month == 0 && today.getDate() <= birthDate.getDate())) {
      age = age - 1;
    }
    return age;
  },
  parseDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);
    return {
      day,
      month,
      year,
      birthday: `${day}/${month}`,
      iso: `${year}-${month}-${day}`,
    };
  },
  parseBlood(blood) {
    const bloods = {
      A1: "A+",
      A0: "A+",
      B1: "B+",
      B0: "B-",
      AB1: "AB+",
      AB0: "AB-",
      O1: "O+",
      O0: "O-",
    };
    return bloods[blood];
  },
};
