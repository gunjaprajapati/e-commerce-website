import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";


const categories = [
  { name: "Personal Protection & Clothing", items: 13, icon: "🛡️" },
  { name: "Hand Tools", items: 6, icon: "🛠️" },
  { name: "Cutting Tools", items: 5, icon: "🔪" },
  { name: "Power Tools", items: 0, icon: "⚡" },
  { name: "Abrasives", items: 0, icon: "🪵" },
  { name: "Cleaning & Hygiene", items: 5, icon: "🧴" },
  { name: "Lubricants & Chemicals", items: 1, icon: "🛢️" },
  { name: "Adhesives & Sealants", items: 3, icon: "🖌️" },
  { name: "Automotive", items: 0, icon: "🚗" },
  { name: "Bearings & Transmissions", items: 0, icon: "⚙️" },
  { name: "Electrical & Lighting", items: 0, icon: "🔌" },
  { name: "Fasteners & Fixings", items: 1, icon: "🔩" },
  { name: "Flow Control", items: 0, icon: "💧" },
  { name: "Materials, Maintenance & Standard Parts", items: 0, icon: "📦" },
  { name: "Measuring & Test Equipment", items: 0, icon: "📏" },
  { name: "Office Supplies", items: 0, icon: "✒️" },
  { name: "Site Safety", items: 0, icon: "🚧" },
  { name: "Storage, Handling & Packaging", items: 0, icon: "📦" }
];

const AllCategories = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center bg-light py-5" style={{ backgroundImage: "banner.png", backgroundSize: "cover" }}>
        <h1 className="text-black">All Categories</h1>
        <p className="text-black">Home / Page</p>
      </div>
      
      {/* Categories Grid */}
      <div className="container mt-4">
        <div className="row">
          {categories.map((category, index) => (
            <div key={index} className="col-lg-2 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch">
              <div className="border p-3 text-center bg-white w-100 d-flex flex-column justify-content-center" style={{ height: "150px" }}>
                <h2 className="fs-4">{category.icon}</h2>
                <h5 className="fs-5">{category.name}</h5>
                <p className="fs-6">{category.items} items</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategories;
