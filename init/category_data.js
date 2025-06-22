// Sample Category Data (for seeding or testing)
const sampleCategories = [
    {
      name: "Personal Protection & Clothing",
      description: "Safety gear and apparel for various industries.",
      imageUrl: "https://example.com/images/personal-protection.jpg", // Replace with actual URL
      // No parentCategory, this is a top-level category
    },
    {
      name: "Hand Tools",
      description: "A wide selection of hand-operated tools.",
      imageUrl: "https://example.com/images/hand-tools.jpg", // Replace with actual URL
    },
    {
      name: "Cutting Tools",
      description: "Tools designed for cutting various materials.",
      imageUrl: "https://example.com/images/cutting-tools.jpg", // Replace with actual URL
      parentCategory: /* Insert the _id of the "Hand Tools" category here after it's created */ null, // Example:  ObjectID("65436f5ba75e29a34b2c1d3e")
    },
    {
      name: "Power Tools",
      description: "Electrically or pneumatically powered tools.",
      imageUrl: "https://example.com/images/power-tools.jpg", // Replace with actual URL
    },
    {
      name: "Abrasives",
      description: "Materials used for grinding, smoothing, or polishing.",
      imageUrl: "https://example.com/images/abrasives.jpg", // Replace with actual URL
    },
    {
      name: "Cleaning & Hygiene",
      description: "Products for maintaining cleanliness and hygiene.",
      imageUrl: "https://example.com/images/cleaning.jpg", // Replace with actual URL
    },
    {
      name: "Lubricants & Chemicals",
      description: "Substances used for lubrication or chemical processes.",
      imageUrl: "https://example.com/images/lubricants.jpg", // Replace with actual URL
    },
    {
      name: "Adhesives & Sealants",
      description: "Products used for bonding or sealing materials.",
      imageUrl: "https://example.com/images/adhesives.jpg", // Replace with actual URL
    },
    {
        name: "aaaa",
        description: "Products used for bonding or sealing materials.",
        imageUrl: "https://example.com/images/adhesives.jpg", // Replace with actual URL
      },
      {
        name: "bbbbb",
        description: "Products used for bonding or sealing materials.",
        imageUrl: "https://example.com/images/adhesives.jpg", // Replace with actual URL
      },
      {
        name: "cccc",
        description: "Products used for bonding or sealing materials.",
        imageUrl: "https://example.com/images/adhesives.jpg", // Replace with actual URL
      },
    // Add more categories as needed
  ];
  

  
module.exports = { data: sampleCategories };