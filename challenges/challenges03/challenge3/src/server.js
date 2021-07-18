const express = require("express");
const nunjucks = require("nunjucks");
const courses = require("./model/courses");
const server = express();
const path = require("path");

nunjucks.configure(path.join(__dirname, "views"), {
  express: server,
  noCache: true,
});
server.set("view engine", "njk");
server.use(express.static("public"));

server.get("/", function (req, res) {
  const about = {
    name: "RocketSeat",
    image:
      "https://pbs.twimg.com/profile_images/1291682473592659968/sEorc6oh_400x400.jpg",
    role: "Seu ecossistema para aprender e evoluir em programação",
    description: "Suas principais tecnologias são:",
    techs: ["React", "React Native", "NodeJS", "Elixir", "Flutter"],
    links: [
      { name: "YouTube", url: "https://www.youtube.com/rocketseat" },
      {
        name: "Instagram",
        url: "https://www.instagram.com/rocketseat_oficial/",
      },
      { name: "Facebook", url: "https://pt-br.facebook.com/rocketseat/" },
      { name: "Twitter", url: "https://twitter.com/rocketseat" },
    ],
  };
  return res.render("index", { about });
});

server.get("/courses", function (req, res) {
  return res.render("courses", { courses });
});

server.get("/course", function (req, res) {
    const courseId = req.query.id;
    const course = courses.find(course => course.id == courseId);
    if (!course) {
        return res.send("Course not found");
    }
    return res.render("course", { course })
});

server.use(function (req, res) {
  res.status(404).render("apology");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Go to http://127.0.0.1:${PORT}`);
});
