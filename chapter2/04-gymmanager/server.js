const express = require("express");
const nunjucks = require("nunjucks");
const routes = require("./routes");
const server = express();

server.use(express.static("public"));
server.use(routes); // Use routes imported
server.set("view engine", "njk");
nunjucks.configure("views", {
  express: server,
  autoescape: false, // HTML in data
  noCache: true,
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Go to http://127.0.0.1:${PORT}`);
});