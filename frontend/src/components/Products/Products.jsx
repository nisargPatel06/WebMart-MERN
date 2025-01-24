import React, { useContext, useState } from "react";
import ProductCard from "./ProductCard";
import Slider from "@mui/material/Slider";
import AuthContext from "../../context/AuthContext";

const categories = [
  "All",
  "Smartphone",
  "Laptop",
  "Mobile Accessories",
  "Men's Fashion",
  "Women's Fashion",
  "Healthcare and Beauty",
  "Furniture",
  "Homedecor",
];

const Products = () => {
  const { activeCategory, setActiveCategory } = useContext(AuthContext);
  const [priceRange, setPriceRange] = useState([200, 70000]);
  const [rating, setRating] = useState(0);

  return (
    <div className="w-full p-5 font-[Nunito]">
      <div className="w-full flex gap-5">
        <div className="sidebar sticky top-[84px] p-4 flex flex-col gap-7 w-[22%] h-fit items-center bg-gray-100 rounded-xl">
          <div className="price-div w-full">
            <p className="text-lg">Price Range :</p>
            <div className="w-full">
              <Slider
                value={priceRange}
                onChange={(event, value) => setPriceRange(value)}
                valueLabelDisplay="auto"
                min={0}
                max={80000}
                step={200}
              />
            </div>
          </div>

          <div className="categories-div w-full">
            <p className="text-lg">All Categories :</p>
            <ul className="category-box mt-2">
              {categories.map((category) => (
                <li
                  className={`w-fit hover:cursor-pointer ${
                    activeCategory === category
                      ? "text-[#ff6b35]"
                      : "text-gray-500"
                  }`}
                  key={category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="ratings-div w-full">
            <p className="text-lg">Ratings Above :</p>
            <div className="w-[80%]">
              <Slider
                value={rating}
                onChange={(event, value) => setRating(value)}
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </div>
          </div>
        </div>

        <div className="product-list w-[77%]">
          <div className="bg-gray-100 rounded-lg">
            <h2 className="text-xl pt-5 pl-5">
              Products Category :{" "}
              <span className="text-[#ff6b35]">{`${activeCategory}`}</span>
            </h2>

            <ProductCard
              priceRange={priceRange}
              activeCategory={activeCategory}
              rating={rating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
