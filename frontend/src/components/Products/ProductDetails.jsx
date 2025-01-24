import React, { useContext, useEffect, useState } from "react";
import "./ProductDetails.css";
import Loader from "../Loader/Loader";
import Carosel from "react-material-ui-carousel";
import ReactStars from "react-rating-stars-component";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import ReviewCard from "./ReviewCard";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from "../../redux/api/productApi";
import { addItem } from "../../redux/slices/cartSlice";
import AuthContext from "../../context/AuthContext";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { isAuthenticated, showSnackbar } = useContext(AuthContext);
  const { id } = useParams();
  const { isLoading, data, refetch } = useGetProductDetailsQuery(id);
  const [createReview] = useCreateReviewMutation();

  useEffect(() => {
    refetch();
  }, [isAuthenticated]);

  if (isLoading || !data || !data.product) {
    return isLoading ? <Loader /> : <div>Product details not available</div>;
  }
  const { product } = data;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitReview = async () => {
    try {
      await createReview({
        rating,
        comment,
        productId: id,
      }).unwrap();
      handleClose();
      showSnackbar("Review submitted!", "success");
      refetch();
    } catch (error) {
      showSnackbar("Failed to submit review!", "error");
    }
  };

  const increaseQuantity = () => {
    if (data.product.stock <= quantity) return;
    setQuantity(quantity + 1);
  };
  const decreaseQuantity = () => {
    if (1 >= quantity) return;
    setQuantity(quantity - 1);
  };
  const handleAddToCart = () => {
    const item = {
      id: id,
      name: product.name,
      price: product.price,
      image: product.image[0].url,
      stock: product.stock,
      quantity: quantity,
    };
    dispatch(addItem(item));
    showSnackbar("Item added to cart !", "info");
  };

  return (
    <div className="p-5 font-[Nunito] border-b-[1px]">
      <div className="flex justify-center items-center">
        <h2 className="text-xl w-[80vw] pb-5 text-center border-b-[1px] border-b-[#0000001f]">
          Product Details
        </h2>
      </div>

      <div className="p-details p-10 flex justify-center">
        <div className="p-images w-[40vw] flex justify-center items-center">
          <Carosel className="w-[30vw] flex flex-col justify-center">
            {product.image.map((image, index) => (
              <img
                className="w-[30vw] rounded-md"
                key={index}
                src={image.url}
                alt={`Product ${index + 1}`}
              />
            ))}
          </Carosel>
        </div>

        <div className="p-info w-[37vw] m-2 flex flex-col">
          <div className="p-top p-2 border-b-[1px] mb-2">
            <p className="text-2xl">{product.name}</p>
            <div className="flex items-center gap-7">
              <ReactStars
                edit={false}
                color="#c5c5c5"
                activeColor="#ff6b35"
                size={25} // window.innerwidth < 600 ? 20 : 25
                value={product.ratings}
                isHalf={true}
              />
              <a
                href="#reviews"
                className="text-[#478ec9] hover:text-[#ff6b35] hover:underline"
              >
                ({product.numOfReviews} reviews)
              </a>
            </div>
          </div>

          <div className="p-mid p-2 flex flex-col border-b-[1px] mb-2">
            <h2
              className={`p-stock text-xl font-bold ${
                product.stock <= 0 ? "text-[#f1582d]" : "text-[#329b30]"
              }`}
            >
              {product.stock <= 0 ? "Out of Stock" : "In Stock"}
            </h2>
            <p className="p-price pt-2">
              <span className="text-lg font-bold">Rs. </span>
              <span className="text-2xl font-bold">{product.price}</span>
            </p>

            <div className="p-q-cart pt-5 pb-2 flex items-center gap-5">
              <div className="flex gap-1">
                <button
                  className="minus w-6 h-6 bg-slate-200 flex justify-center items-center rounded"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <input
                  className="quantity w-6 h-6 flex justify-center items-center text-center focus:outline-none"
                  type="number"
                  readOnly
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={1}
                  max={product.stock}
                />
                <button
                  className="plus w-6 h-6 bg-slate-200 flex justify-center items-center rounded"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>

              <button
                className="w-[12vw] h-[6vh] bg-[#ff6b35] text-white rounded-full text-[2.2vh] flex justify-center items-center shadow-sm"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="p-bot p-2 flex flex-col gap-8">
            <div>
              <p className="text-xl mb-3">Description :</p>
              <p className="text-justify text-[1.2vw]">{product.description}</p>
            </div>
            {isAuthenticated && (
              <button
                className="w-[12vw] h-[6vh] bg-[#133c55d0] f1592d text-white rounded-full text-[2.2vh] flex justify-center items-center shadow-md"
                onClick={handleClickOpen}
              >
                Submit Review
              </button>
            )}
          </div>
        </div>
      </div>

      <div id="reviews" className="p-reviews ease-linear">
        <div className="flex justify-center items-center">
          <h2 className="text-xl w-[50vw] pb-5 text-center border-b-[1px] border-b-[#0000001f]">
            Product Reviews
          </h2>
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Review</DialogTitle>
          <DialogContent>
            <ReactStars
              count={5}
              value={rating}
              onChange={(newRating) => setRating(newRating)}
              size={35}
              activeColor="#ff6b35"
              isHalf={true}
            />
            <TextField
              className="w-[25vw]"
              id="comment"
              type="text"
              multiline
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button
              className="bg-[#ff6b35]"
              onClick={handleSubmitReview}
              autoFocus
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <div className="r-card flex justify-center items-center">
          {product.reviews && product.reviews[0] ? (
            <div className="mt-5 flex flex-wrap gap-5">
              {product.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <p className="mt-5 text-lg">No reviews yet...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
