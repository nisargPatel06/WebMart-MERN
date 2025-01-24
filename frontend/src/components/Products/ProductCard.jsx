import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import ReactStars from "react-rating-stars-component";
import Pagination from "@mui/material/Pagination";
import { Link, useLocation } from "react-router-dom";
import { useGetAllProductsQuery } from "../../redux/api/productApi";

const ProductCard = ({ priceRange, activeCategory, rating }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const [page, setPage] = useState(1);

  const { isLoading, data } = useGetAllProductsQuery({
    keyword: keyword || "",
    page,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    activeCategory,
    rating,
  });

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, page, activeCategory]);

  useEffect(() => {
    setPage(1);
  }, [keyword, priceRange, activeCategory]);

  if (isLoading || !data || !data.products || data.products.length === 0) {
    return isLoading ? (
      <Loader />
    ) : (
      <div className="w-full h-[60vh] font-[Nunito] text-lg flex justify-center items-center">
        No products available !
      </div>
    );
  }
  const { products, productsCount, resultPerPage, filteredProductsCount } =
    data;

  return (
    <div className="product-card-container p-5 font-[Nunito] flex flex-col">
      <div className="flex flex-wrap gap-7">
        {products.map((product) => (
          <Link key={product._id} to={product._id}>
            <div className="p-card w-[16vw] bg-[#fff] rounded-[4px] overflow-hidden">
              <img
                className="w-full border-b-[1px]"
                src={product.image[0].url}
                alt={product.name}
              />

              <div className="p-2 flex flex-col justify-center items-center">
                <p>{product.name}</p>
                <div>
                  <div className=" flex justify-center items-center">
                    <ReactStars
                      edit={false}
                      color="#a3a3a3"
                      activeColor="#ff6b35"
                      size={25} // window.innerwidth < 600 ? 20 : 25
                      value={product.ratings}
                      isHalf={true}
                    />
                  </div>

                  <div className="flex justify-center">
                    {product.reviews && product.reviews.length > 0 ? (
                      <span className="text-green-600">
                        {product.reviews.length} reviews
                      </span>
                    ) : (
                      <span>No reviews available</span>
                    )}
                  </div>
                </div>
                <span>Rs. {product.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="w-full flex justify-center items-center">
        {resultPerPage < filteredProductsCount && (
          <div className="flex justify-center mt-10">
            <Pagination
              count={Math.ceil(productsCount / resultPerPage)} // totalPages
              page={page}
              onChange={(event, value) => setPage(value)}
              shape="rounded"
              variant="outlined"
              color="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
