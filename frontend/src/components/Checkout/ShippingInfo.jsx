import React, { useContext, useEffect, useState } from "react";
import "./ShippingInfo.css";
import CheckoutSteps from "./CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import {
  IoHome,
  FaPhoneAlt,
  BiWorld,
  CiMapPin,
  MdLocationCity,
  MdPinDrop,
} from "../index";
import AuthContext from "../../context/AuthContext";
import { saveShippingInfo } from "../../redux/slices/cartSlice";

const countries = {
  India: ["Delhi", "Gujarat", "Maharashtra", "Karnataka"],
};
const states = {
  Delhi: ["New Delhi", "Dwarka"],
  Gujarat: ["Ahmedabad", "Anand", "Surat", "Vadodara"],
  Maharashtra: ["Mumbai", "Pune"],
  Karnataka: ["Bangalore", "Mysore"],
};

const ShippingInfo = ({ nextStep }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useContext(AuthContext);
  const { shippingInfo } = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    address: shippingInfo.address || "",
    phone: shippingInfo.phoneNo || "",
    country: "India",
    state: shippingInfo.state || "",
    city: shippingInfo.city || "",
    pincode: shippingInfo.pinCode || "",
  });
  const [stateOptions, setStateOptions] = useState(countries[formData.country]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (formData.state) {
      setCityOptions(states[formData.state]);
    }
  }, [formData.state]);

  const handleShippingInfo = (e) => {
    e.preventDefault();
    if (formData.phone.length < 10 || formData.phone.length > 10) {
      showSnackbar("Phone number should be 10 digit", "error");
      return;
    }
    dispatch(
      saveShippingInfo({
        address: formData.address,
        phoneNo: formData.phone,
        country: "IN",
        state: formData.state,
        city: formData.city,
        pinCode: formData.pincode,
      })
    );
    nextStep();
  };

  return (
    <div className="p-4 flex flex-col gap-5 bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7]">
      <CheckoutSteps activeStep={0} />

      <div className="flex justify-center items-center">
        <form
          className="p-7 flex flex-col justify-center items-center gap-5 bg-[#fff] rounded-lg shadow"
          onSubmit={handleShippingInfo}
        >
          <h2 className="text-xl">Shipping Information</h2>

          <div className="flex flex-col justify-center items-center gap-2">
            <div className="si-input">
              <IoHome className="text-xl text-[#ff6b35]" />
              <input
                type="text"
                placeholder="Address"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div className="si-input">
              <FaPhoneAlt className="text-xl text-[#ff6b35]" />
              <input
                type="number"
                placeholder="Phone No."
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.slice(0, 10),
                  })
                }
              />
            </div>

            <div className="si-input">
              <BiWorld className="text-xl text-[#ff6b35]" />
              <select
                value={formData.country}
                required
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              >
                <option value="India">India</option>
              </select>
            </div>

            <div className="si-input">
              <CiMapPin className="font-extrabold text-xl text-[#ff6b35]" />
              <select
                value={formData.state}
                required
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              >
                <option value="">Select State</option>
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="si-input">
              <MdLocationCity className="font-extrabold text-xl text-[#ff6b35]" />
              <select
                value={formData.city}
                required
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              >
                <option value="">Select City</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="si-input">
              <MdPinDrop className="text-xl text-[#ff6b35]" />
              <input
                type="number"
                placeholder="Pin code"
                required
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pincode: e.target.value.slice(0, 6),
                  })
                }
              />
            </div>
          </div>

          <div>
            <button
              className="w-[22vw] h-[6vh] bg-[#ff6b35] text-white rounded-lg hover:bg-[#f1582dda]"
              type="submit"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingInfo;
