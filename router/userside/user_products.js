const express = require("express");
const router = express.Router();
const Product = require("../../models/product.js");


// Show Route (Corrected and improved)
// ✅ Show Product with Populated Reviews and Author
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const productData = product.toObject();

    // Convert Map fields
    productData.attributes = await convertMapToObject(productData.attributes);
    productData.specifications = await convertMapToObject(productData.specifications);

    console.log("Product Data:", productData);

    // ✅ Send the user object too for EJS `curUser`
    res.render("userside/view_paje.ejs", { product: productData, curUser: req.user });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;