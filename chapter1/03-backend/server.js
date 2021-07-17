const express = require("express");
const nunjucks = require("nunjucks");

const server = express();

server.set('view engine', 'njk')
nunjucks.configure('views', {
    express: server,
    noCache: true
})
server.use(express.static("public"));

server.get("/", function(req, res) {
    return res.render("about");
});

server.get("/classes", function(req, res) {
    return res.render("classes");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Go to http://127.0.0.1:${PORT}`);
})

