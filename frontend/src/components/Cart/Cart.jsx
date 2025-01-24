import React from "react";
import CartItems from "./CartItems";
import { useSelector } from "react-redux";
import { selectCartItemsCount } from "../../redux/slices/cartSlice";

const Cart = () => {
  const cartItemCount = useSelector(selectCartItemsCount);
  return (
    <div className="p-5 font-[Nunito] border-b-[1px] bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7]">
      <div className="pb-4 mx-[120px] text-xl flex justify-center items-center gap-[10vw] border-b-[1px] border-[#00000044]">
        {cartItemCount === 0 ? (
          <p className="flex items-center">
            Your Cart is <span className="text-[#ff6b35] mx-2">Empty</span>!
          </p>
        ) : (
          <p className="flex items-center">
            Total items in Cart :
            <span className="ml-1 text-2xl text-[#ff6b35]">
              {cartItemCount}
            </span>
          </p>
        )}
      </div>

      <div>
        <CartItems />
      </div>
    </div>
  );
};

export default Cart;
