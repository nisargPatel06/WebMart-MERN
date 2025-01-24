import React from "react";
import { IoBagCheck } from "../index";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="p-8 font-[Nunito] flex flex-col justify-center items-center gap-8">
      <IoBagCheck className="text-[#ff6b35] text-[10vw]" />
      <div className="text-xl">Your order has been placed successfully..</div>
      <div className="flex gap-5">
        <Link
          to="/orders"
          className="px-5 py-2 bg-[#133c55d0] text-white rounded-lg"
        >
          View Order
        </Link>
        <Link to="/" className="px-5 py-2 bg-[#ff6b35] text-white rounded-lg">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
