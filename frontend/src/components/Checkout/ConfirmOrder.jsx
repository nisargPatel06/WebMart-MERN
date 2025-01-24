import React from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector } from "react-redux";
import { CiShoppingTag, LiaRupeeSignSolid, IoClose } from "../index";
import { useGetUserDetailsQuery } from "../../redux/api/userApi";
import { selectCartTotalAmount } from "../../redux/slices/cartSlice";

const ConfirmOrder = ({ nextStep, prevStep }) => {
  const { data: userDetails } = useGetUserDetailsQuery();
  const { items, shippingInfo } = useSelector((state) => state.cart);
  const cartTotalAmount = useSelector(selectCartTotalAmount);

  const orderTotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCharges = orderTotal <= 2000 ? 0 : 200;
  const tax = orderTotal * 0.08;
  const grossTotal = orderTotal + shippingCharges + tax;
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}.`;

  const proceedToPayment = async () => {
    const data = {
      orderTotal,
      shippingCharges,
      tax,
      grossTotal,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    nextStep();
  };

  return (
    <div className="p-4 bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7]">
      <CheckoutSteps activeStep={1} />

      <div className="p-5 flex justify-center gap-5">
        <div className="left flex flex-col gap-5">
          <div className="ship-info p-4 w-[55vw] bg-[#fff] flex flex-col gap-5 shadow-md rounded-lg">
            <h2 className="text-xl text-[#ff6b35]">Shipping Details</h2>

            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                <p className="w-[130px] text-[#2d7fb3] text-lg">Name</p>
                <span className="w-[40vw]">{userDetails.user.name}</span>
              </div>
              <div className="flex items-center">
                <p className="w-[130px] text-[#2d7fb3] text-lg">Phone no.</p>
                <span className="w-[40vw]">{shippingInfo.phoneNo}</span>
              </div>
              <div className="flex items-center">
                <p className="w-[130px] text-[#2d7fb3] text-lg">Address</p>
                <span className="w-[40vw]">{address}</span>
              </div>
              <div className="flex items-center">
                <p className="w-[130px] text-[#2d7fb3] text-lg">Pincode</p>
                <span className="w-[40vw]">{shippingInfo.pinCode}</span>
              </div>
            </div>

            <button
              className="w-[10vw] h-[6vh] bg-[#133c55d0] text-white rounded-lg hover:bg-[#133c55e8]"
              onClick={prevStep}
            >
              Edit
            </button>
          </div>

          <div className="c-items p-5 w-[55vw] bg-[#fff] flex flex-col gap-3 shadow-md rounded-lg">
            <h2 className="text-xl text-[#ff6b35]">Your Cart Items </h2>

            {items.map((item) => (
              <div
                key={item.id}
                className="p-2 flex justify-between items-center bg-gradient-to-br from-[#f1f1f1] to-[#fff] rounded shadow"
              >
                <div className="flex gap-4 items-center rounded-md">
                  <img
                    src={item.image}
                    className="w-[5vw] rounded-sm"
                    alt={item.name}
                  />
                  <div className="w-[22vw]">{item.name}</div>
                </div>

                <div className="flex">
                  <p className="w-[10vw] flex justify-start items-center bg-blue-20">
                    <LiaRupeeSignSolid />
                    <span className="flex gap-1 items-center">
                      {item.price} <IoClose className="text-[#ff8d35]" />{" "}
                      {item.quantity}
                    </span>
                  </p>
                  <p>=</p>
                  <p className="w-[8vw] text-lg flex justify-center items-center bg-blue-20">
                    <LiaRupeeSignSolid className="text-[#ff8d35]" />
                    {item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="right sticky top-[80px] p-4 w-[28vw] h-fit bg-[#fff] flex flex-col gap-4 shadow-md rounded-lg">
          <h3 className="text-xl">
            <div className="text-[#ff6b35]">Order Summary</div>
          </h3>

          <div className="border-b-[1px]"></div>

          <div className="py-2 flex flex-col gap-3">
            <div className="flex justify-between">
              <p className="w-[15vw] text-lg text-[#000000cb] flex items-center gap-2">
                <CiShoppingTag className="text-[#ff6b35]" /> Order Total :
              </p>
              <p className="flex justify-center items-center">
                <LiaRupeeSignSolid className="text-[#ff6b35]" />
                <span className="text-lg">{cartTotalAmount.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex justify-between">
              <p className="w-[15vw] text-lg text-[#000000cb] flex items-center gap-2">
                <CiShoppingTag className="text-[#ff6b35]" /> Shipping Charges :
              </p>
              <p className="flex justify-center items-center">
                <LiaRupeeSignSolid className="text-[#ff6b35]" />
                <span className="text-lg">{shippingCharges.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex justify-between">
              <p className="w-[15vw] text-lg text-[#000000cb] flex items-center gap-2">
                <CiShoppingTag className="text-[#ff6b35]" /> GST :
              </p>
              <p className="flex justify-center items-center">
                <span className="text-lg">8 %</span>
              </p>
            </div>

            <div className="flex justify-between">
              <p className="w-[15vw] text-lg text-[#000000cb] flex items-center gap-2">
                <CiShoppingTag className="text-[#ff6b35]" /> Gross Total :
              </p>
              <p className="flex justify-center items-center border-t-[1px] h-[8vh]">
                <LiaRupeeSignSolid className="text-[#ff6b35]" />
                <span className="text-xl">{grossTotal.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <button
            className="h-[6vh] relative bg-[#ff6b35] text-white rounded-lg gap-10 hover:bg-[#f1582d] overflow-hidden"
            onClick={proceedToPayment}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
