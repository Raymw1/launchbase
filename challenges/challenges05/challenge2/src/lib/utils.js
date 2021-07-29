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
  parseEducation_level(education_levels, education_level) {
    return education_levels[education_level] || "Informação não presente!";

    // if (education_level == "highschool") return `Ensino Médio Completo`;
    // if (education_level == "college") return `Ensino Superior Completo`;
    // if (education_level == "master") return `Mestrado`;
    // if (education_level == "doctor") return `Doutorado`;
  },
  parseClass_type(class_type) {
    if (class_type == "presential") return `Presencial`;
    if (class_type == "remote") return `À distância`;
  },
  parseSubjects_taught(subjects_taught) {
    subjects_taught = subjects_taught.split(",");
    return subjects_taught;
  },
  parseDate(timestamp) {
    const date = new Date(timestamp);
    const day = `0${date.getUTCDate()}`.slice(-2);
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const year = date.getUTCFullYear();
    return {
      day,
      month,
      year,
      iso: `${year}-${month}-${day}`,
      birthday: `${day}/${month}`,
    };
  },
};
