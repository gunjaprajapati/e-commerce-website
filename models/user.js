//for this install this...
//npm i passport
// npm i passport-local
//npm i passport-local-mongoose

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalmongoose =  require("passport-local-mongoose");


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    role: { type: String, default: "user" }  // Default role is "admin"
});

userSchema.plugin(passportLocalmongoose);

module.exports = mongoose.model("User", userSchema);