const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../../models/Review.js");
const Product = require("../../models/product.js");
const User = require("../../models/user.js");

const { isLoggedIn, validatereview, isReviewAuthor } = require("../../middleware.js");
const { isLoggedIn1 } = require("../../middleware.js"); // Ensure this is middleware that checks admin or login



// Route to show all reviews to admin
router.get("/admin_review", async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate("author", "username email")
            .sort({ createdAt: -1 });
  
        res.render("Adminside/admin_review.ejs", { reviews });
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).send("Internal Server Error");
    }
  });
  



// ✅ CREATE REVIEW
router.post("/", isLoggedIn, validatereview, async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        req.flash("error", "Product not found!");
        return res.redirect("/products");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    product.reviews.push(newReview);

    await newReview.save();
    await product.save();

    // **Refetch the product and populate reviews with author**
    const updatedProduct = await Product.findById(product._id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    });

    if (!updatedProduct) {
        req.flash("error", "Error fetching updated product!");
        return res.redirect("/products");
    }

    req.flash("success", "Review Added!");

    res.redirect(`/products/${product._id}/cart/add_cart`); 
    // res.render("userside/view_cart.ejs", { product: updatedProduct, curUser: req.user });
});



// ✅ DELETE REVIEW
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
    let { id, reviewId } = req.params;

    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    // **Refetch the product and populate reviews with author**
    const updatedProduct = await Product.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    });

    if (!updatedProduct) {
        req.flash("error", "Error fetching updated product!");
        return res.redirect(`/products/${id}`); // Redirect even if refetch fails, but with an error message
    }

    req.flash("success", "Review Deleted!");
    res.redirect(`/products/${updatedProduct._id}/cart/add_cart`); // **Use updatedProduct._id here**

    // res.render("userside/view_cart.ejs", { product: updatedProduct, curUser: req.user });
});

// ✅ SHOW PRODUCT WITH REVIEWS (and author)
router.get("/products/:id", async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        });

    if (!product) {
        req.flash("error", "Product not found!");
        return res.redirect("/products");
    }

    res.render("userside/view_cart.ejs", { product, curUser: req.user });
});





module.exports = router;
