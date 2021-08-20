const { unlinkSync } = require("fs");

const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");

const { formatPrice, parseDate } = require("../../lib/utils");

module.exports = {
  async show(req, res) {
    try {
      let product = await Product.find(req.params.id);
      if (!product) return res.send("Product not found!");
      // IMAGES
      let files = await Product.files(product.id);
      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      product.old_price = formatPrice(product.old_price);
      product.price = formatPrice(product.price);
      const { day, month, hour, minutes } = parseDate(product.updated_at);
      product.published = {
        day: `${day}/${month}`,
        hour: `${hour}h${minutes}`,
      };
      return res.render("products/show", { product, files });
    } catch (err) {
      console.error(err);
    }
  },
  async create(req, res) {
    try {
      const categories = await Category.findAll();
      return res.render("products/create", { categories });
    } catch (err) {
      console.error(err);
    }
    // Category.all()
    //   .then(function (results) {
    //     const categories = results.rows;
    //     return res.render("products/create.njk", { categories });
    //   })
    //   .catch((err) => {
    //     throw new Error(err);
    //   });
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body);
      keys.forEach((key) => {
        if (req.body[key] == "") {
          return res.send(`Error, please insert value in ${key}`);
        }
      });
      if (req.files.length == 0)
        return res.send("Please, send at least one image!");
      let {
        category_id,
        name,
        description,
        old_price,
        price,
        quantity,
        status,
      } = req.body;
      price = price.replace(/\D/g, "");
      const product_id = await Product.create({
        category_id,
        user_id: req.session.userId,
        name,
        description,
        old_price: old_price || price,
        price,
        quantity,
        status: status || 1,
      });
      const filesPromise = req.files.map((file) =>
        File.create({ name: file.filename, path: file.path, product_id })
      );
      await Promise.all(filesPromise);

      return res.redirect(`products/${product_id}`);
    } catch (err) {
      console.error(err);
    }
  },
  async edit(req, res) {
    try {
      let product = await Product.find(req.params.id);
      if (!product) return res.send("Product not found!");
      // CATEGORIES
      const categories = await Category.findAll();
      // IMAGES
      let files = await Product.files(product.id);
      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));
      product.old_price = formatPrice(product.old_price);
      product.price = formatPrice(product.price);
      return res.render("products/edit", { categories, product, files });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);
      keys.forEach((key) => {
        if (req.body[key] == "" && key != "removed_files") {
          return res.send(`Error, please insert value in ${key}`);
        }
      });

      // if (req.files.length == 0) return res.send("Please, send at least one image!");
      const newFilesPromise = req.files.map((file) => {
        File.create({ ...file, product_id: req.body.id });
      });
      await Promise.all(newFilesPromise);

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",");
        removedFiles.pop();
        const removedFilesPromise = removedFiles.map((id) => File.delete(id));
        await Promise.all(removedFilesPromise);
      }

      req.body.price = req.body.price.replace(/\D/g, ""); // Get only digits/numbers
      if (req.body.old_price != req.body.price) {
        const oldProduct = await Product.find(req.body.id);
        req.body.old_price = oldProduct.rows[0].price;
      }
      await Product.update(req.body.id, {
        category_id: req.body.category_id,
        name: req.body.name,
        description: req.body.description,
        old_price: req.body.old_price,
        price: req.body.price,
        quantity: req.body.quantity,
        status: req.body.status,
      });
      return res.redirect(`/products/${req.body.id}`);
    } catch (err) {
      console.error(err);
    }
  },
  async delete(req, res) {
    const files = await Product.files(req.body.id);
    await Product.delete(req.body.id);
    files.map((file) => {
      try {
        unlinkSync(file.path);
      } catch (err) {
        console.error(err);
      }
    });

    return res.redirect("/products");
  },
};
