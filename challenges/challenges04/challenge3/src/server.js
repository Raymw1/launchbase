const express = require("express");
const nunjucks = require("nunjucks");
const routes = require("./routes");
const server = express();
const path = require("path");

server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "njk");
nunjucks.configure(path.join(__dirname, "views"), {
  express: server,
  noCache: true,
});
server.use(routes);

server.use(function (req, res) {
  res.status(404).render("apology");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Go to http://127.0.0.1:${PORT}`);
});
