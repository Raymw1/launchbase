module.exports = {
  parseAge(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month == 0 && today.getDate() <= birthDate.getDate())) {
      age -= 1;
    }
    return age;
  },
  parseDegree(degree) {
    const degrees = {
      highschool: "Ensino Médio Completo",
      college: "Ensino Superior Completo",
      master: "Mestrado",
      doctor: "Doutorado",
    };
    return degrees[degree] || "Informação não presente!";

    // if (degree == "highschool") return `Ensino Médio Completo`;
    // if (degree == "college") return `Ensino Superior Completo`;
    // if (degree == "master") return `Mestrado`;
    // if (degree == "doctor") return `Doutorado`;
  },
  parseClasstype(classtype) {
    if (classtype == "presential") return `Presencial`;
    if (classtype == "remote") return `À distância`;
  },
  parseServices(services) {
    services = services.split(",");
    return services;
  },
  parseDate(timestamp) {
    const date = new Date(timestamp);
    const day = `0${date.getUTCDate()}`.slice(-2);
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`
  },
};
