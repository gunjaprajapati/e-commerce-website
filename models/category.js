
const mongoose = require('mongoose'); // Import mongoose at the top

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate category names
  },
  description: String, // Optional description
  
  // You can add more fields as needed (e.g., parent category for hierarchy)
}, { timestamps: true }); // Add timestamps for creation and update dates

module.exports = mongoose.model('Category', categorySchema);