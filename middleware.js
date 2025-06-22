const { Product, productSchema } = require("./models/product.js"); 
const { productValidationSchema,reviewSchema } = require("./schema.js"); // Adjust the path as necessary
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/Review.js");


module.exports.isLoggedIn = (req, res, next) => {

    if(!req.isAuthenticated()){
    console.log(req.originalUrl)
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to Add review!");
    return res.redirect("/login/login_form");
    }
    next();
}

module.exports.isLoggedIn1 = (req, res, next) => {

    if(!req.isAuthenticated()){
    console.log(req.originalUrl)
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to website!");
    return res.redirect("/login/login_form");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    let { id } = req.params;
    let product = await Product.findById(id);
        if(!product.owner.equals(res.locals.curUser._id)){
            req.flash("error", "You are not the owner of this Product");
            return res.redirect(`/products/${id}`);
        }
    next();
}



module.exports.validateListing = (req, res, next) => {
    const { error } = productValidationSchema.validate(req.body); // Use the correct schema

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validatereview = (req,res,next) => {
    let { error } = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


module.exports.isReviewAuthor = async(req,res,next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
        if(!review.author.equals(res.locals.curUser._id)){
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/products/${id}`);
        }
    next();
}

// ✅ Middleware to check if user is an admin
module.exports.isAdmin = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in!");
        return res.redirect("/login/login_form");
    }

    try {
        const admin = await Admin.findOne({ _id: req.user._id }); // ✅ Corrected Admin Check
        if (!admin) {
            req.flash("error", "You must be an admin to access this page!");
            return res.redirect("/");
        }
        
        next(); // Proceed if user is an admin
    } catch (err) {
        console.error("Admin check error:", err);
        req.flash("error", "Something went wrong!");
        return res.redirect("/");
    }
};