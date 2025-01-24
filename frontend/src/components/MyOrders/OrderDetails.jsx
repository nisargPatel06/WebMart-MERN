import React, { useContext, useEffect } from "react";
import "./OrderDetails.css";
import { useParams } from "react-router-dom";
import {
  CiShoppingTag,
  LiaRupeeSignSolid,
  IoClose,
  IoCheckmarkCircle,
  TbLoader2,
  Loader,
} from "../index";
import { useGetOrderDetailsQuery } from "../../redux/api/orderApi";
import { useGetUserDetailsQuery } from "../../redux/api/userApi";
import AuthContext from "../../context/AuthContext";

const OrderDetails = () => {
  const { data: userDetails } = useGetUserDetailsQuery();
  const { id } = useParams();
  const {
    data: orderDetails,
    isLoading,
    refetch,
  } = useGetOrderDetailsQuery(id);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  if (isLoading) {
    return <Loader />;
  }
  const { order } = orderDetails;

  const address = `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country}.`;

  return (
    <div className="p-5 font-[Nunito] bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7]">
      <div className="text-2xl text-center">Order Details</div>

      <div className="p-5 flex flex-col items-center gap-5">
        <div className="top flex justify-center gap-5">
          <div className="p-5 w-[52vw] bg-[#fff] flex flex-col gap-5 shadow-md rounded-lg">
            <h2 className="text-xl text-[#ff6b35]">Shipping Details</h2>

            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <p className="w-[100px] text-[#2d7fb3]">Name</p>
                <span>{userDetails.user.name}</span>
              </div>
              <div className="flex items-center">
                <p className="w-[100px] text-[#2d7fb3]">Phone no.</p>
                <span>{order.shippingInfo.phoneNo}</span>
              </div>
              <div className="flex items-center">
                <p className="w-[100px] text-[#2d7fb3]">Address</p>
                <span>{address}</span>
              </div>
              <div className="flex items-center">
                <p className="w-[100px] text-[#2d7fb3]">Pincode</p>
                <span>{order.shippingInfo.pinCode}</span>
              </div>
            </div>
          </div>

          <div className="p-5 w-[23vw] h-fit bg-[#fff] flex flex-col gap-3 shadow-md rounded-lg">
            <h3 className="text-xl">
              <div className="text-[#ff6b35]">Order Summary</div>
            </h3>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="text-[#2d7fb3] flex items-center gap-2">
                  <CiShoppingTag className="text-[#ff6b35]" /> Order Total :
                </p>
                <p className="flex justify-center items-center">
                  <span>{order.itemsPrice.toFixed(2)}</span>
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-[#2d7fb3] flex items-center gap-2">
                  <CiShoppingTag className="text-[#ff6b35]" /> Shipping Charges
                  :
                </p>
                <p className="flex justify-center items-center">
                  <span>{order.shippingPrice.toFixed(2)}</span>
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-[#2d7fb3] flex items-center gap-2">
                  <CiShoppingTag className="text-[#ff6b35]" /> GST :
                </p>
                <p className="flex justify-center items-center">
                  <span>{order.taxPrice.toFixed(2)}</span>
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-[#2d7fb3] flex items-center gap-2">
                  <CiShoppingTag className="text-[#ff6b35]" /> Gross Total :
                </p>
                <p className="flex justify-center items-center border-t-[1px] h-[6vh]">
                  <LiaRupeeSignSolid className="text-[#ff6b35]" />
                  <span className="text-lg">{order.totalPrice.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom flex justify-center gap-5">
          <div className="p-5 w-[52vw] bg-[#fff] flex flex-col gap-3 shadow-md rounded-lg">
            <h2 className="text-xl text-[#ff6b35]">Order Items </h2>

            {order.orderItems.map((item) => (
              <div
                key={item._id}
                className="p-2 flex justify-between items-center bg-gradient-to-br from-[#f1f1f1] to-[#fff] rounded shadow"
              >
                <div className="flex gap-4 items-center rounded-md">
                  <img
                    src={item.image}
                    className="w-[5vw] rounded-sm"
                    alt={item.name}
                  />
                  <div className="w-[19vw]">{item.name}</div>
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

          <div className="p-5 w-[23vw] h-fit bg-[#fff] flex flex-col gap-3 shadow-md rounded-lg">
            <h3 className="text-xl">
              <div className="text-[#ff6b35]">Status</div>
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <p className="w-[140px] text-[#2d7fb3]">Payment Status :</p>
                <p className="flex items-center gap-3 text-lg">
                  Paid <IoCheckmarkCircle className="text-green-600 text-2xl" />
                </p>
              </div>

              <div className="flex items-center">
                <p className="w-[140px] text-[#2d7fb3]">Order Status :</p>
                <p
                  className={`flex items-center gap-3 text-lg ${
                    order.orderStatus === "Processing"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {order.orderStatus}{" "}
                  <span>
                    {order.orderStatus === "Processing" ? (
                      <TbLoader2 className="rotate text-[#00000091] text-xl" />
                    ) : (
                      <IoCheckmarkCircle className="text-green-600 text-2xl" />
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
