const express = require("express");
const nunjucks = require("nunjucks");
const server = express();
const path = require("path")

nunjucks.configure(path.join(__dirname, 'views'), {
    express: server,
    noCache: true
});
server.set('view engine', 'njk');
server.use(express.static("public"));

server.get("/", function(req, res) {
    return res.render("index");
})

server.get("/content", function(req, res) {
    return res.render("content");
})

server.use(function(req, res) {
    res.status(404).render("apology");
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Go to http://127.0.0.1:${PORT}`);
})

