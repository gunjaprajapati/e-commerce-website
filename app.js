const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/product.js");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override"); //9.1
const ejsMate = require("ejs-mate"); //11. for this write this command in terminal(npm i ejs-mate)
// const {productgSchema , reviewSchema} = require("./schema.js");
// const Review = require("./models/Review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const productRouter = require("./router/Adminside/product_admin.js");
const categoryRouter = require("./router/Adminside/category.js");
const user_categoryRouter = require("./router/userside/allcategorys.js");
const AdminRouter = require("./models/admin.js");
const signupRouter  = require ("./router/signup.js");
const Category = require("./models/category.js"); // Adjust path if needed

const session = require("express-session");  //npm i express-session --install this
const flash = require("connect-flash");  //npm i connect-flash    ---install this


//for this install this...
//npm i passport
// npm i passport-local
//npm i passport-local-mongoose
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const logOutRouter = require("./router/logout.js");
const loginRouter = require("./router/login.js");
const userRouter = require("./router/Adminside/user.js");
const cartRouter = require ("./router/userside/user_cart.js");
const AddressRouter = require ("./router/userside/address.js");       
const paymentRouter = require ("./router/userside/payment.js");   
const OrderRouter = require ("./router/userside/conform_order.js"); 
const reviewsRouter = require ("./router/userside/user_review_route.js"); 
const myaccountRouter = require ("./router/userside/My_account.js"); 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

//(3.1) creating Wonderlust database
const mongo_url = "mongodb+srv://ecom_user:yourpassword123@cluster0.ikum9.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

//(3.2) calling main function
main()
.then( () => {
    console.log("connected to DB");
})
.catch( (err) => {
    console.log(err);
})

//3.creating database using mongoose with async function
async function main(){
    await mongoose.connect(mongo_url);
}

// 5.1 when we create views folder add this 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views directory is set
app.use(express.urlencoded({extended: true}));//6.1
app.use(methodOverride("_method")); // 9.2  for this write this command in terminal ( npm i method-override)
app.engine('ejs', ejsMate); // 11.1
app.use(express.static(path.join(__dirname, "/public"))); // for public folder
app.use(express.json());


const sessionOptions =  {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration date
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
});

app.use(async (req, res, next) => {
    try {
        const categories = await Category.find(); // Fetch categories from DB
        res.locals.categories = categories; // Make it available globally in EJS
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
});


app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/category_user",user_categoryRouter);

// app.use("/products/:id/reviews", reviewsRouter);
app.use("/signup",signupRouter);
app.use("/login",loginRouter); 
app.use("/logout",logOutRouter);
app.use("/user",userRouter);
app.use("/address",AddressRouter); 
app.use("/products/:id/cart",cartRouter); 
app.use("/cart/:id/payment",paymentRouter);
app.use("/order",OrderRouter); 
app.use("/products/:id/reviews", reviewsRouter);     
app.use("/account", myaccountRouter);    

const allCategoryRoutes = require("./router/userside/allcategorys");
app.use("/allcategory", allCategoryRoutes);


const adminOrderRoutes = require('./router/Adminside/adminOrderRoutes');
app.use('/', adminOrderRoutes);

const adminRoutes = require('./router/Adminside/admin.js');
app.use('/admin', adminRoutes);

const userRoutes = require("./router/userside/userRoutes.js");
app.use("/", userRoutes);

const searchRoutes = require("./router/userside/searchRoutes");
app.use("/",searchRoutes);

//2.creating basic APIs
app.get("/Admin", (req,res) => {
    res.render("./Adminside/dashboard.ejs");
});


app.get("/", async (req, res) => {
    try {
        const featuredProducts = await Product.find().limit(6); // Fetch 6 products for display

        const firstRowImages = [
            { id: 1, image: "/images/image1.png" },
            { id: 2, image: "/images/image2.png" },
            { id: 3, image: "/images/image3.png" },
            { id: 4, image: "/images/image4.png" },
        ];

        const secondRowLogos = [
            { id: 5, image: "/images/brand1.jpg" },
            { id: 6, image: "/images/brand2.jpg" },
            { id: 7, image: "/images/brand3.jpg" },
            { id: 8, image: "/images/brand4.jpg" },
            { id: 9, image: "/images/brand5.jpg" },
            { id: 10, image: "/images/brand6.png" },
        ];

        const thirdRowImages = [
            { id: 14, image: "/images/2img.png" },
            { id: 15, image: "/images/2img2.png" },
            { id: 16, image: "/images/2img3.png" },
            { id: 17, image: "/images/2img4.png" },
        ];

        const fourthRowBanners = [
            { id: 18, image: "/images/sale1.png", alt: "Christmas Sale" },
            { id: 19, image: "/images/sale2.png", alt: "Unbeatable Offers" },
            { id: 20, image: "/images/sale3.png", alt: "Big Discounts" },
        ];

        res.render("home", { featuredProducts, firstRowImages, secondRowLogos, thirdRowImages, fourthRowBanners });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});






//1.staring server with port 8080
app.listen(7777, () => {
    console.log("server is listening to port 7777");
});

