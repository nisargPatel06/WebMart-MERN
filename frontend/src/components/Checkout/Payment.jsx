import React, { useContext, useRef } from "react";
import "./Payment.css";
import CheckoutSteps from "./CheckoutSteps";
import { BsCreditCardFill, MdEvent, MdVpnKey } from "../index";
import axios from "axios";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import AuthContext from "../../context/AuthContext";
import { useGetUserDetailsQuery } from "../../redux/api/userApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreateOrderMutation } from "../../redux/api/orderApi";

const Payment = ({ prevStep }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);
  const { data: userDetails } = useGetUserDetailsQuery();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { items, shippingInfo } = useSelector((state) => state.cart);
  const { showSnackbar } = useContext(AuthContext);

  const orderTotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCharges = orderTotal <= 2000 ? 0 : 200;
  const tax = orderTotal * 0.08;
  const grossTotal = orderTotal + shippingCharges + tax;

  const [createOrder] = useCreateOrderMutation();
  const orderItems = items.map((item) => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    product: item.id,
  }));
  const order = {
    shippingInfo,
    orderItems,
    itemsPrice: orderTotal,
    taxPrice: tax,
    shippingPrice: shippingCharges,
    totalPrice: grossTotal,
  };

  const paymentData = {
    amount: Math.round(grossTotal * 100),
    description: `Order by ${userDetails.user.name}`,
  };
  const config = {
    withCredentials: true,
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/payment/process",
        paymentData,
        config
      );

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: userDetails.user.name,
            email: userDetails.user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: shippingInfo.country,
              postal_code: shippingInfo.pinCode,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        showSnackbar(result.error.message, "error");
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          try {
            // Calling the mutation function with the order object
            const result = await createOrder(order);
            console.log("Order created successfully:", result);
            navigate("/success");
            showSnackbar("Your payment is successfull", "success");
          } catch (error) {
            console.error("Failed to create order:", error);
          }
        } else {
          showSnackbar("There's some issue while proccessing payment", "error");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      showSnackbar(error.response.data.message, "error");
    }
  };

  const cardStyle = {
    style: {
      base: {
        "::placeholder": {
          color: "#00000077",
        },
      },
    },
  };

  return (
    <div className="p-4 flex flex-col gap-5 bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7]">
      <CheckoutSteps activeStep={2} />

      <div className="py-5 flex justify-center items-center">
        <form
          className="p-7 flex flex-col justify-center items-center gap-5 bg-[#fff] rounded-lg shadow"
          onSubmit={(e) => handlePayment(e)}
        >
          <h2 className="text-xl text-[#00000077]">Card Details</h2>

          <div className="flex flex-col justify-center items-center gap-2">
            <div className="p-input">
              <BsCreditCardFill className="text-xl text-[#ff6b35]" />
              <CardNumberElement className="input-field" options={cardStyle} />
            </div>

            <div className="p-input">
              <MdEvent className="text-xl text-[#ff6b35]" />
              <CardExpiryElement className="input-field" options={cardStyle} />
            </div>

            <div className="p-input">
              <MdVpnKey className="text-xl text-[#ff6b35]" />
              <CardCvcElement className="input-field" options={cardStyle} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              className="w-[22vw] h-[6vh] bg-[#133c55d0] text-white rounded-lg hover:bg-[#133c55e8]"
              onClick={prevStep}
            >
              Back
            </button>
            <input
              value={`Pay - Rs. ${orderInfo && orderInfo.grossTotal}`}
              className="w-[22vw] h-[6vh] bg-[#ff6b35] text-white rounded-lg cursor-pointer hover:bg-[#f1582dda]"
              type="submit"
              ref={payBtn}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
