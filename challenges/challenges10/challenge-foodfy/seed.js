const { hash } = require("bcryptjs");
const faker = require("faker");

const User = require("./src/app/model/User");
const File = require("./src/app/model/File");
const Chef = require("./src/app/model/Chef");
const Recipe = require("./src/app/model/Recipe");
const RecipeFiles = require("./src/app/model/RecipeFiles");

let userIds = [],
  totalRecipeFiles = 30,
  totalRecipes = 10,
  totalChefs = 5,
  totalUsers = 3;

async function createUsers() {
  const users = [];
  const password = await hash("a", 8);

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      is_admin: Math.round(Math.random()),
    });
  }
  const usersPromise = users.map((user) => User.create(user));
  userIds = await Promise.all(usersPromise);
}

async function createChefs() {
  const chefs = [];
  const files = [];

  while (files.length < totalChefs) {
    files.push({
      name: "avatar",
      path: `https://source.unsplash.com/collection/10858240/250x250`,
    });
    chefs.push({
      name: faker.name.findName(),
      avatar: files.length,
    });
  }

  const filesPromise = files.map((file) => File.create(file));
  await Promise.all(filesPromise);

  const chefsPromise = chefs.map((chef) => Chef.create(chef));
  await Promise.all(chefsPromise);
}

async function createRecipes() {
  const recipes = [],
    files = [],
    recipeFiles = []

  while (recipes.length < totalRecipes) {
    const ingredients = [], preparation = [];
    for (let i = 0; i < 5; i++) {
      ingredients.push(faker.commerce.productName());
      preparation.push(faker.commerce.productName());
    }
    recipes.push({
      chef_id: Math.ceil(Math.random() * totalChefs),
      title: faker.commerce.productName(),
      ingredients,
      preparation,
      information: faker.lorem.words(20),
      user_id: Math.ceil(Math.random() * totalUsers)
    });
  }

  while (files.length < totalRecipeFiles) {
    files.push({
      name: `recipe${files.length}`,
      path: `https://source.unsplash.com/collection/35749100/250x250`,
    });
    recipeFiles.push({
      recipe_id: Math.ceil(Math.random() * totalRecipes),
      file_id: files.length
    })
  }


  const filesPromise = files.map((file) => File.create(file));
  await Promise.all(filesPromise);
  
  const recipesPromise = recipes.map((recipe) => Recipe.create(recipe));
  await Promise.all(recipesPromise);

  const recipeFilesPromise = recipeFiles.map((file) => RecipeFiles.create(file));
  await Promise.all(recipeFilesPromise);
}

async function init() {
  await createUsers();
  await createChefs();
  await createRecipes();
}

init();
