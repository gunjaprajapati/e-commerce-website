const express = require("express");
const router = express.Router();
const Product = require("../../models/product.js");
const Category  = require("../../models/category.js");

const defaultCategories = [
    { name: "Personal Protection & Clothing", icon: "hands-wash" },
    { name: "Hand Tools", icon: "tools" },
    { name: "Cutting Tools", icon: "cut" },
    { name: "Power Tools", icon: "bolt" },
    { name: "Abrasives", icon: "layer-group" },
    { name: "Cleaning & Hygiene", icon: "pump-soap" },
    { name: "Lubricants & Chemicals", icon: "oil-can" },
    { name: "Adhesives & Sealants", icon: "brush" },
    { name: "Automotive", icon: "car" },
    { name: "Bearings & Transmissions", icon: "cogs" },
    { name: "Electrical & Lighting", icon: "lightbulb" },
    { name: "Fasteners & Fixings", icon: "screwdriver-wrench" },
    { name: "Flow Control", icon: "tint" },
    { name: "Materials, Maintenance & Standard Parts", icon: "boxes" },
    { name: "Measuring & Test Equipment", icon: "ruler" },
    { name: "Office Supplies", icon: "pen" },
    { name: "Site Safety", icon: "bullhorn" },
    { name: "Storage, Handling & Packaging", icon: "box-open" },
    { name: "Welding, Brazing & Soldering", icon: "fire" }
];

router.get("/", async (req, res) => {
    try {
        // Fetch all categories from the Category collection
        const allCategories = await Category.find({}, "name");
        console.log("All Categories from DB:", allCategories);

        // Fetch all products and count occurrences of each category
        const products = await Product.find({}, "categories");
        console.log("Products:", products);

        const categoryCounts = {};

        products.forEach(product => {
            if (Array.isArray(product.categories)) { // Ensure categories is an array
                product.categories.forEach(category => {
                    const normalizedCategory = category.trim().toLowerCase();
                    categoryCounts[normalizedCategory] = (categoryCounts[normalizedCategory] || 0) + 1;
                });
            }
        });

        console.log("Category Counts:", categoryCounts);

        // Merge all categories with their respective counts and icons
        const categories = allCategories.map(cat => {
            // Find matching category in the defaultCategories array
            const matchingCategory = defaultCategories.find(c => c.name.toLowerCase() === cat.name.toLowerCase());

            return {
                name: cat.name,
                icon: matchingCategory ? matchingCategory.icon : "box", // Use default icon if not found
                itemCount: categoryCounts[cat.name.toLowerCase()] || 0 // Show 0 if no products
            };
        });

        console.log("Final Categories:", categories);

        res.render("./userside/all_category.ejs", { categories });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// 🟦 Category search by query string
router.get("/search-category", async (req, res) => {
    const searchQuery = req.query.q.trim().toLowerCase();

    try {
        const category = await Category.findOne({
            name: { $regex: new RegExp(`^${searchQuery}$`, 'i') }
        });

        if (category) {
            return res.redirect(`/allcategory/${category.name}`);
        } else {
            return res.send("Category not found.");
        }
    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/:name", async (req, res) => {
    try {
        const categoryName = req.params.name.trim().toLowerCase();
        console.log("Requested Category (URL):", req.params.name);
        console.log("Requested Category (Normalized):", categoryName);

        const products = await Product.find({
            categories: { $elemMatch: { $regex: new RegExp("^" + categoryName + "$", "i") } }
        });

        console.log("Found Products:", products);

        res.render("./userside/category_wise_product.ejs", { products, categoryName: req.params.name });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
module.exports = router;