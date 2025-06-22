import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";

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
    
     // Replace with actual logo
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

  

const ProductGrid = () => {
  return (
    <div className="container mt-4">
      {/* First Row (Products) */}
      <div className="row mb-4">
        {firstRowImages.map((product) => (
          <div key={product.id} className="col-md-3">
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image}
                className="img-fluid"
                alt="Product"
                style={{ width: "100%", height: "auto" }}
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Second Row (Logos) */}
      <div className="row justify-content-center mb-4">
        {secondRowLogos.map((logo) => (
          <div key={logo.id} className="col-2 text-center">
            <img
              src={logo.image}
              className="img-fluid"
              alt="Brand Logo"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        ))}
      </div>
     {/* Third Row (Different Set of Product Images) */}
     <div className="row mb-4">
        {thirdRowImages.map((product) => (
          <div key={product.id} className="col-md-3">
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image}
                className="img-fluid"
                alt="Product"
                style={{ width: "100%", height: "auto" }}
              />
            </Link>
          </div>
        ))}
      </div>
      
      {/* Fourth Row (Promotional Banners) */}
      <div className="row mb-4">
        {fourthRowBanners.map((banner) => (
          <div key={banner.id} className="col-md-4">
            <img
              src={banner.image}
              className="img-fluid"
              alt={banner.alt}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
