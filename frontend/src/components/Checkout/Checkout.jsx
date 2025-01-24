import React, { useEffect, useState } from "react";
import axios from "axios";
import ShippingInfo from "./ShippingInfo";
import ConfirmOrder from "./ConfirmOrder";
import Payment from "./Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    try {
      console.log("Fetching Stripe API key...");
      const response = await axios.get(
        "http://localhost:4000/api/v1/stripeapikey",
        {
          withCredentials: true,
        }
      );
      console.log("Stripe API Key :", response.data.stripeApiKey);
      setStripeApiKey(response.data.stripeApiKey);
    } catch (error) {
      console.error("Error fetching Stripe API key:", error);
    }
  }
  useEffect(() => {
    getStripeApiKey();
  }, []);

  const nextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const prevStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <ShippingInfo nextStep={nextStep} />;
      case 1:
        return <ConfirmOrder nextStep={nextStep} prevStep={prevStep} />;
      case 2:
        // return <Payment prevStep={prevStep} />;
        if (!stripeApiKey) {
          return <div>Loading...</div>;
        }
        return (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Payment prevStep={prevStep} />
          </Elements>
        );
      default:
        return <ShippingInfo nextStep={nextStep} />;
    }
  };

  return (
    <div className="font-[Nunito]">
      <div>{renderStepContent(activeStep)}</div>
    </div>
  );
};

export default Checkout;

// As per Indian regulations, export transactions require a description. More info here: https://stripe.com/docs/india-exports

// Missing required param: shipping[name].
