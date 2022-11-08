const express = require("express");
const productRouter = express.Router();
//keycloak
const keycloak = require('../middlewares/keycloak-config').getKeycloak()

// const auth = require("../middlewares/auth");

const { Product } = require("../models/product");


productRouter.get("/api/products/", keycloak.protect(), async (req, res) => {
  try {
    const products = await Product.find({ category: req.query.category });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// search products
// /api/products/search/i
productRouter.get("/api/products/search/:name", keycloak.protect(), async (req, res) => {
  try {
    const products = await Product.find({
      name: { $regex: req.params.name, $options: "i" },
    });

    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// route to rate the product.
productRouter.post("/api/rate-product", keycloak.protect(), async (req, res) => {
  try {
    const { id, rating } = req.body;
    let product = await Product.findById(id);

    // check if user already rated, if so replace
    for (let i = 0; i < product.ratings.length; i++) {
      if (product.ratings[i].userId == req.user) {
        product.ratings.splice(i, 1);
        break;
      }
    }

    const ratingSchema = {
      userId: req.user,
      rating,
    };

    product.ratings.push(ratingSchema);
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/deal-of-day",keycloak.protect(), async (req, res) => {
  try {
    let products = await Product.find({});

    // bubble sort
    products = products.sort((a, b) => {
      let aSum = 0;
      let bSum = 0;

      for (let i = 0; i < a.ratings.length; i++) {
        aSum += a.ratings[i].rating;
      }

      for (let i = 0; i < b.ratings.length; i++) {
        bSum += b.ratings[i].rating;
      }
      return aSum < bSum ? 1 : -1;
    });

    res.json(products[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = productRouter;