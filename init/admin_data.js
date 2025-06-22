const mongoose = require("mongoose");
const Admin = require("../models/admin.js"); // Ensure correct path

const mongo_url = "mongodb://127.0.0.1:27017/ecommerce_db"; // Database URL

// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

// Initialize Admin Data
const initAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "Jiya" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      return mongoose.connection.close();
    }

    // Create a new Admin instance (WITHOUT password)
    const admin = new Admin({
      username: "admin",
      email: "solankijiya1105@gmail.com",
    });

    // Register Admin (Hashing Password Automatically)
    await Admin.register(admin, "admin"); // Hashing will be handled by passport-local-mongoose

    console.log("Admin created successfully!");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

initAdmin();
