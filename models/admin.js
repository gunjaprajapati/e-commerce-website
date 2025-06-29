const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    
});

AdminSchema.plugin(passportLocalMongoose); // Enables automatic password hashing

module.exports = mongoose.model("Admin", AdminSchema);
