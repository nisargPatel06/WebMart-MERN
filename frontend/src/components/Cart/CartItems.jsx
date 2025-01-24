import React, { useContext } from "react";
import "./CartItems.css";
import emptyCart from "../assets/emptyCart.webp";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  IoClose,
  HiMinusSm,
  HiPlus,
  LiaRupeeSignSolid,
  CiShoppingTag,
  IoBagCheckOutline,
} from "../index";
import { Tooltip, IconButton } from "@mui/material";
import {
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  selectCartTotalAmount,
} from "../../redux/slices/cartSlice";
import AuthContext from "../../context/AuthContext";

const CartItems = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const cartTotalAmount = useSelector(selectCartTotalAmount);

  if (items.length === 0) {
    return (
      <div className="p-5 flex flex-col gap-8">
        <div className="flex justify-center items-center">
          <img src={emptyCart} className="w-[200px]" alt="Empty Cart Icon" />
        </div>

        <div className="flex justify-center items-center">
          <span className="text-[#ff6b35] text-2xl">"</span>
          <span className="mx-1 text-lg">
            Empowering Your Every Purchase, One Click at a Time!
          </span>
          <span className="text-[#ff6b35] text-2xl">"</span>
        </div>
      </div>
    );
  }

  const handleCheckOut = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login?redirect=/checkout");
    }
  };

  return (
    <div className="px-4 py-5 flex justify-around">
      <div className="w-[67%] flex flex-col gap-4">
        <div className="flex pl-[11vw]">
          <p className="w-[23vw] text-[#5c5c5c]">Name</p>
          <p className="w-[7.5vw] text-[#5c5c5c]">Price</p>
          <p className="w-[9vw] text-[#5c5c5c]">Quantity</p>
          <p className="w-[8vw] text-[#5c5c5c]">Sub Total</p>
        </div>

        {items.map((item) => (
          <div
            key={item.id}
            className="p-2 flex justify-between items-center bg-[#fff] rounded-lg shadow hover:shadow-lg"
          >
            <Link
              to={`/products/${item.id}`}
              className="p-2 flex gap-6 items-center bg-gradient-to-tr from-[#f1f1f1] to-[#fff] rounded-md"
            >
              <img
                src={item.image}
                className="w-[7vw] rounded"
                alt={item.name}
              />
              <div className="w-[20vw] text-lg text-[#363636]">{item.name}</div>
            </Link>

            <div className="flex gap-[2vw]">
              <div className="w-[8vw] bg-[#dab5b500] text-lg flex justify-center items-center">
                <LiaRupeeSignSolid className="text-sm" />
                {item.price}
              </div>

              <div className="w-[5vw] flex justify-center items-center">
                <button
                  className="text-[#919191] hover:text-[#000] text-lg"
                  onClick={() => dispatch(decreaseQuantity(item.id))}
                >
                  <HiMinusSm />
                </button>
                <input
                  className="w-6 h-6 text-lg text-[#ff6b35] text-center focus:outline-none"
                  type="number"
                  readOnly
                  value={item.quantity}
                  min={1}
                  max={item.stock}
                />
                <button
                  className="text-[#919191] hover:text-[#000] text-lg"
                  onClick={() => dispatch(increaseQuantity(item.id))}
                >
                  <HiPlus />
                </button>
              </div>

              <div className="w-[9vw] text-xl flex justify-center items-center">
                <LiaRupeeSignSolid className="text-sm" />
                {item.price * item.quantity}
              </div>
            </div>

            <Tooltip title="Remove">
              <IconButton onClick={() => dispatch(removeItem(item))}>
                <IoClose className="text-xl text-[#ff6b35]" />
              </IconButton>
            </Tooltip>
          </div>
        ))}
      </div>

      <div className="cart-totals sticky top-[80px] p-5 mt-10 w-[28%] h-fit flex flex-col gap-5 bg-[#fff] rounded-lg shadow-md hover:shadow-md">
        <h3 className="text-xl">
          <div className="font-black text-[#000000bd]">Order Summary</div>
        </h3>
        <div className="border-b-[1px] border-[#ff8d35]"></div>
        <div className="py-5 flex flex-col gap-5">
          <div className="flex justify-between">
            <p className="w-[15vw] text-lg text-[#000000cb] flex items-center gap-2">
              <CiShoppingTag className="text-[#ff6b35]" /> Order Total :
            </p>
            <p className="flex justify-center items-center">
              <LiaRupeeSignSolid className="text-[#ff6b35]" />
              <span className="text-xl">{cartTotalAmount.toFixed(2)}</span>
            </p>
          </div>

          <div className="flex justify-between">
            <p className="w-[15vw] text-lg text-[#000000cb] flex items-center gap-2">
              <CiShoppingTag className="text-[#ff6b35]" /> GST :
            </p>
            <p className="flex justify-center items-center">
              <span className="text-xl">0.08 %</span>
            </p>
          </div>
        </div>

        <button
          className="h-[6vh] relative bg-[#ff6b35e7] text-white rounded-lg gap-10 hover:bg-[#f1582dda] overflow-hidden"
          onClick={handleCheckOut}
        >
          Check Out
          <IoBagCheckOutline className="icon absolute right-[-20px] top-[9px] text-xl" />
        </button>
      </div>
    </div>
  );
};

export default CartItems;
