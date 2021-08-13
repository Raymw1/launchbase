const express = require("express");
const nunjucks = require("nunjucks");
const routes = require("./routes");
const methodOverride = require("method-override");
const server = express();
const session = require("./config/session");

server.use(session);
server.use((req, res, next) => {
  res.locals.session = req.session
  next()
})
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride("_method"))
server.set("view engine", "njk");
nunjucks.configure("src/app/views", {
  express: server,
  autoescape: false, // HTML in data
  noCache: true,
});
server.use(routes); // Use routes imported

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Go to http://127.0.0.1:${PORT}`);
});
