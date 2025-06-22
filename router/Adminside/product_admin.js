const express = require("express");
const router = express.Router();
const Product = require("../../models/product.js");
const {validateListing} = require("../../middleware.js");
const Review = require("../../models/Review.js");



// 5.Index Route
router.get("/", async (req,res) => {
    const allproducts = await Product.find({});
    res.render("./Adminside/allproducts.ejs", {allproducts});
 });

// 7.New route --- to fill up form
router.get("/new", (req, res) => {
    const product = {};
    res.render("./Adminside/new_product.ejs", { product });
});



//7.create route
router.post('/', async (req, res) => {
  try {
      const { name, description, price, stock, sku, brand, imageUrl, categories, tags, attributes, specifications } = req.body;

      // 1. Convert comma-separated strings to arrays:
      const categoriesArray = categories ? categories.split(',').map(cat => cat.trim()) : []; // Handle if categories are empty
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : []; // Handle if tags are empty

      // 2. Parse JSON strings:
      const attributesObject = attributes ? JSON.parse(attributes) : {}; // Handle if attributes are empty or invalid
      const specificationsObject = specifications ? JSON.parse(specifications) : {}; // Handle if specifications are empty or invalid


      const newProduct = new Product({
          name,
          description,
          price,
          stock,
          sku,
          brand,
          imageUrl,
          categories: categoriesArray,  // Use the array here
          tags: tagsArray,          // Use the array here
          attributes: attributesObject,  // Use the parsed object
          specifications: specificationsObject, // Use the parsed object
          // ... other fields
      });

      await newProduct.save();
      res.redirect('/products'); // Or wherever you want to redirect after creating a product
  } catch (error) {
      console.error("Error creating product:", error);
      // Handle errors appropriately, e.g., send an error response or render an error page.
      res.status(500).send("Error creating product."); // Example error handling
  }
});



//8.Edit route
router.get("/:id/edit", async(req,res) => {
    let {id} = req.params;
    const product = await Product.findById(id);
    res.render("Adminside/Edit.ejs", { product })
});

//9. Update route
router.put("/:id", async (req, res) => {
    // Log the received body to check the data format
    console.log(req.body.product);
    let { id } = req.params;

    // Ensure attributes and specifications are objects
    if (typeof req.body.product.attributes === 'string') {
        req.body.product.attributes = JSON.parse(req.body.product.attributes);
    }
    if (typeof req.body.product.specifications === 'string') {
        req.body.product.specifications = JSON.parse(req.body.product.specifications);
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body.product, { new: true });

    if (!updatedProduct) {
        req.flash("error", "Product not found");
        return res.redirect("/products"); // Redirect to products list if not found
    }

    res.redirect(`/products`); // Redirect to the updated product page
});

//10.Delete Route
router.delete("/:id", async (req,res) => {
    let {id} = req.params;
    let deletedProduct = await Product.findByIdAndDelete(id);
    console.log(deletedProduct);
    req.flash("success", "Listing Deleted!");
    res.redirect("/products");
});




// Show Route (Corrected and improved)
router.get("/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).send("Product not found");
      }
  
      const productData = product.toObject(); // Convert to plain object (important!)
  
      // Correctly convert Maps to plain objects (using async/await and handling nulls)
      productData.attributes = await convertMapToObject(productData.attributes);
      productData.specifications = await convertMapToObject(productData.specifications);
  
  
      console.log("Product Data:", productData); // Keep this for debugging
  
      res.render("userside/view_cart.ejs", { product: productData });
  
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
  async function convertMapToObject(map) {
      if (map instanceof Map) {
        return Object.fromEntries(map);
      }
      return map || {}; // Handle null or undefined
  }

module.exports = router;