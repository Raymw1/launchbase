const express = require("express");
const nunjucks = require("nunjucks");
const recipes = require("./model/recipes");

const server = express();
const path = require("path");
nunjucks.configure(path.join(__dirname, "views/"), {
  express: server,
  autoescape: false,
  noCache: true,
});
server.set("view engine", "njk");
server.use(express.static("public"));


server.get("/", function (req, res) {
  return res.render("index", { recipes });
});

server.get("/about", function (req, res) {
  return res.render("about");
});

server.get("/recipes", function (req, res) {
  return res.render("recipes", { recipes })
});

server.get("/recipes/:id", function (req, res) {
    const recipeId = req.params.id;
    const recipe = recipes.find(recipe => recipe.id == recipeId);
    if (!recipe) {
        return res.send("Recipe not found")
    }
    return res.render("recipe", {recipe});
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log(`Go to: http://127.0.0.1:${PORT}`);
});
