// page 4.3

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Product = require("../models/product.js");


//(1.1) creating Wonderlust database
const mongo_url = "mongodb://127.0.0.1:27017/ecommerce_db";

//(1.2) calling main function
main()
.then( () => {
    console.log("connected to DB");
})
.catch( (err) => {
    console.log(err);
})

//1.creating database using mongoose with async function
async function main(){
    await mongoose.connect(mongo_url);
}

//creating a function to initialize the database
const initDB = async () => {
    await Product.deleteMany({});

      //to add ower in data in database  --fix owener of review
    //   initdata.data = initdata.data.map((obj) => ({
    //     ...obj,
    //     owner: "6799ac33753bd2f49de489c0",
    //     isApproved: true,
    // }));

    await Product.insertMany(initdata.data);
    console.log("data was initialized");
};

initDB();

