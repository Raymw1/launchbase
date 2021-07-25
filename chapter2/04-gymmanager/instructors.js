const fs = require("fs"); // File system
const data = require("./data.json");
const { parseAge, parseDate } = require("./utils");

exports.index = function (req, res) {
  return res.render("instructors/index", { instructors: data.instructors })
}

exports.show = function (req, res) {
  const { id } = req.params; // const id = req.params.id;
  const foundInstructor = data.instructors.find(
    (instructor) => instructor.id == id
  );
  if (!foundInstructor) return res.send("Instructor not found!");

  const instructor = {
    ...foundInstructor,
    age: parseAge(foundInstructor.birth),
    services: foundInstructor.services.split(","),
    created_at: Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
  };
  return res.render("instructors/show", { instructor });
};

exports.post = function (req, res) {
  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    if (req.body[key] == "") {
      return res.send(`Error, please insert value in ${key}`);
    }
  });

  // Get only these from req.body
  let { avatar_url, birth, name, services, gender } = req.body;

  const id = Number(data.instructors.length + 1);
  birth = Date.parse(req.body.birth);
  const created_at = Date.now();

  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at,
  });
  // Create and write in file converting to JSON
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write file error!");
  });
  return res.redirect("/instructors");
  //   return res.send(req.body);
};

exports.edit = function (req, res) {
  const { id } = req.params;
  const foundInstructor = data.instructors.find(
    (instructor) => instructor.id == id
  );
  if (!foundInstructor) return res.send("Instructor not found!");
  const instructor = {
    ...foundInstructor,
    birth: parseDate(foundInstructor.birth),
  };
  return res.render("instructors/edit", { instructor });
};

exports.put = function (req, res) {
  const { id } = req.body;
  let index = 0;
  const foundInstructor = data.instructors.find((instructor, foundIndex) => {
    if (instructor.id == id) {
      index = foundIndex;
      return true;
    }
  });
  if (!foundInstructor) return res.send("Instructor not found!");
  const instructor = {
    ...foundInstructor,
    ...req.body,
    id: Number(id),
    birth: Date.parse(req.body.birth),
  };
  data.instructors[index] = instructor;
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Wite error");
    return res.redirect(`/instructors/${id}`)
  });
};

exports.delete = function (req, res) {
  const { id } = req.body;
  const instructors = data.instructors.filter(instructor => instructor.id != id)
  data.instructors = instructors;
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write file error!");
    return res.redirect(`/instructors`)
  })
}
