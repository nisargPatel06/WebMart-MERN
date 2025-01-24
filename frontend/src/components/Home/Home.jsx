import React, { useContext } from "react";
import "./Home.css";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const Home = () => {
  const { activeCategory, setActiveCategory } = useContext(AuthContext);
  const navigate = useNavigate();

  const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "450px",
  };
  const slideImages = [
    {
      url: "https://res.cloudinary.com/dfllnkw9t/image/upload/v1718967945/E-commerce/images/tl2b4wm6rrhliz1s7vyo.jpg",
      category: "Men's Fashion",
    },
    {
      url: "https://res.cloudinary.com/dfllnkw9t/image/upload/v1718967944/E-commerce/images/b7zlh40jr9xuexfh4yoe.jpg",
      category: "Laptop",
    },
  ];
  return (
    <div className="home bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7] p-2">
      <div className="hero py-5 px-8 mt flex items-center justify-between">
        <div
          className="relative banner w-[auto] cursor-pointer"
          onClick={() => {
            setActiveCategory("Women's Fashion");
            navigate("/products");
          }}
        >
          {/* <p className="absolute h-8 w-20 top-[15px] left-[15px] flex justify-center items-center font-semibold text-white text-center bg-[#ff6b35] rounded-md shadow-md">
            30% Off
          </p> */}
          <img
            className="h-[450px] w-[310px] rounded-lg overflow-hidden shadow-md"
            src="https://res.cloudinary.com/dfllnkw9t/image/upload/v1718967943/E-commerce/images/dykxqo6kukthcoqex2wl.avif"
            alt=""
          />
        </div>

        <div className="slide-container h-[450px] w-[73%] rounded-lg overflow-hidden bg-center bg-cover shadow-md">
          <Slide>
            {slideImages.map((slideImage, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  setActiveCategory(slideImage.category);
                  navigate("/products");
                }}
              >
                <div
                  style={{
                    ...divStyle,
                    backgroundImage: `url(${slideImage.url})`,
                  }}
                ></div>
              </div>
            ))}
          </Slide>
        </div>
      </div>

      <div className="card-container m-3 mb-6 flex flex-wrap justify-center gap-7 font-[Nunito]">
        <div
          className="cards card-1 p-4 bg-[#ffffff] flex flex-col gap-2 rounded-md shadow-md cursor-pointer"
          onClick={() => {
            setActiveCategory("Smartphone");
            navigate("/products");
          }}
        >
          <h4 className="text-xl font-bold">Smartphones</h4>
          <div className="box box-1 rounded-md" />
          <p className="text-blue-700">See More</p>
        </div>

        <div
          className="cards card-2 p-4 bg-[#ffffff] flex flex-col gap-2 rounded-md shadow-md cursor-pointer"
          onClick={() => {
            setActiveCategory("Men's Fashion");
            navigate("/products");
          }}
        >
          <h4 className="text-xl font-bold">Men's Fashion</h4>
          <div className="box box-2 rounded-md" />
          <p className="text-blue-700">See More</p>
        </div>

        <div
          className="cards card-3 p-4 bg-[#ffffff] flex flex-col gap-2 rounded-md shadow-md cursor-pointer"
          onClick={() => {
            setActiveCategory("Women's Fashion");
            navigate("/products");
          }}
        >
          <h4 className="text-xl font-bold">Women's Fashion</h4>
          <div className="box box-3 rounded-md" />
          <p className="text-blue-700">See More</p>
        </div>

        <div
          className="cards card-4 p-4 bg-[#ffffff] flex flex-col gap-2 rounded-md shadow-md cursor-pointer"
          onClick={() => {
            setActiveCategory("Furniture");
            navigate("/products");
          }}
        >
          <h4 className="text-xl font-bold">Furniture</h4>
          <div className="box box-4 rounded-md" />
          <p className="text-blue-700">See More</p>
        </div>

        <div
          className="cards card-5 p-4 bg-[#ffffff] flex flex-col gap-2 rounded-md shadow-md cursor-pointer"
          onClick={() => {
            setActiveCategory("Healthcare and Beauty");
            navigate("/products");
          }}
        >
          <h4 className="text-xl font-bold">Beauty Picks</h4>
          <div className="box box-5 rounded-md" />
          <p className="text-blue-700">See More</p>
        </div>

        <div
          className="cards card-6 p-4 bg-[#ffffff] flex flex-col gap-2 rounded-md shadow-md cursor-pointer"
          onClick={() => {
            setActiveCategory("Homedecor");
            navigate("/products");
          }}
        >
          <h4 className="text-xl font-bold">Home Decor</h4>
          <div className="box box-6 rounded-md" />
          <p className="text-blue-700">See More</p>
        </div>

        <div
          className="cards card-7 p-4 bg-[#ffffff] flex flex-col gap-2 rounded-md shadow-md cursor-pointer"
          onClick={() => {
            setActiveCategory("Laptop");
            navigate("/products");
          }}
        >
          <h4 className="text-xl font-bold">Laptops</h4>
          <div className="box box-7 rounded-md" />
          <p className="text-blue-700">See More</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
