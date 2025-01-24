import React from "react";
import "./CheckoutSteps.css";
import {
  MdLocalShipping,
  MdLibraryAddCheck,
  MdPayment,
  IoCheckmarkCircle,
} from "../index";
import { Stepper, Step, StepLabel } from "@mui/material";

const steps = [
  {
    icon: <MdLocalShipping />,
    label: "Shipping Information",
  },
  {
    icon: <MdLibraryAddCheck />,
    label: "Confirm Order",
  },
  {
    icon: <MdPayment />,
    label: "Payment",
  },
];

const CheckoutSteps = ({ activeStep, setActiveStep }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((item, index) => (
        <Step
          key={index}
          active={activeStep === index ? true : false}
          completed={activeStep >= index ? true : false}
        >
          <StepLabel
            icon={activeStep > index ? <IoCheckmarkCircle /> : item.icon}
            style={{ color: activeStep >= index ? "#ff6b35" : "#000000a1" }}
          >
            <span
              className={`font-[Nunito] ${
                activeStep >= index ? "text-[#000]" : "text-[#00000077]"
              }`}
            >
              {item.label}
            </span>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutSteps;
