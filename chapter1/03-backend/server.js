const express = require("express");
const nunjucks = require("nunjucks");
const videos = require("./data");

const server = express();

server.set("view engine", "njk");
nunjucks.configure("views", {
  express: server,
  autoescape: false,    // HTML in data
  noCache: true,
});
server.use(express.static("public"));

server.get("/", function (req, res) {
  const about = {
    avatar_url: "https://github.com/raymw1.png",
    name: "Rayan Wilbert",
    role: "Desenvolvedor FullStack",
    description: `Desenvolvedor FullStack de 17 anos, procurando desafios que melhore sua rotina e também a dos outros. Aluno da <a href="https://rocketseat.com.br/" target="_blank">RocketSeat</a>`,
    links: [
      { name: "Gitub", url: "https://github.com/Raymw1/" },
      { name: "Instagram", url: "https://www.instagram.com/ray.coding/" },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/rayanwilbert/" }
    ]
  };
  return res.render("about", { about });
});

server.get("/classes", function (req, res) {
  return res.render("classes", { videos });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Go to http://127.0.0.1:${PORT}`);
});
