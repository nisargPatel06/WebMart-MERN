import React, { useContext, useState } from "react";
import "./AddProduct.css";
import {
  MdSpellcheck,
  MdOutlineDescription,
  LiaRupeeSignSolid,
  TbListNumbers,
  MdOutlineCategory,
  TbLoader2,
} from "../index";
import Sidebar from "./Sidebar";
import { useCreateProductMutation } from "../../redux/api/productApi";
import AuthContext from "../../context/AuthContext";

const AddProduct = () => {
  const categories = [
    "Smartphone",
    "Laptop",
    "Mobile Accessories",
    "Men's Fashion",
    "Women's Fashion",
    "Healthcare and Beauty",
    "Furniture",
    "Homedecor",
  ];

  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: [],
    imgPrev: [],
  });
  const { name, description, price, stock, category, image, imgPrev } =
    productData;
  const { showSnackbar } = useContext(AuthContext);

  const [createProductMutation] = useCreateProductMutation();

  const addProductHandler = async (e) => {
    e.preventDefault();
    if (image.length === 0) {
      showSnackbar("Please select at least one image.", "warning");
      return;
    }
    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    formData.set("price", price);
    formData.set("stock", stock);
    formData.set("category", category);
    image.forEach((img) => {
      formData.append("image", img);
    });

    try {
      setLoading(true);
      const { data } = await createProductMutation(formData);
      setLoading(false);
      if (data) {
        console.log("Product added successfully :", data);
        showSnackbar("Product added successfully..", "success");
        setProductData({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "",
          image: [],
          imgPrev: [],
        });
      } else {
        console.log("Error");
        showSnackbar("Error creating product !", "error");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error creating product :", error);
      showSnackbar("Something went wrong! Plz try again..", "error");
    }
  };

  const imageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData({
      ...productData,
      image: [],
      imgPrev: [],
    });
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setProductData((prevData) => ({
            ...prevData,
            imgPrev: [...prevData.imgPrev, reader.result],
            image: [...prevData.image, reader.result],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="p-5 flex font-[Nunito] gap-5">
      <Sidebar />

      <div className="p-5 w-[80%] flex justify-center bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7] rounded-lg">
        <form
          encType="multipart/form-data"
          className="p-5 px-8 w-fit flex flex-col gap-4 bg-[#fff] rounded-lg"
          onSubmit={addProductHandler}
        >
          <h1 className="text-center text-xl">Add Product</h1>

          <div className="flex flex-col justify-center items-center gap-2">
            <div className="ap-input">
              <MdSpellcheck className="text-xl text-[#ff6b35]" />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                name="name"
                onChange={(e) =>
                  setProductData({ ...productData, name: e.target.value })
                }
              />
            </div>

            <div className="ta-input">
              <MdOutlineDescription className="mt-1 text-xl text-[#ff6b35]" />
              <textarea
                placeholder="Description"
                required
                value={description}
                name="description"
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="ap-input">
              <LiaRupeeSignSolid className="text-xl text-[#ff6b35]" />
              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                name="price"
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    price: e.target.value.slice(0, 6),
                  })
                }
              />
            </div>

            <div className="ap-input">
              <TbListNumbers className="text-xl text-[#ff6b35]" />
              <input
                type="number"
                placeholder="Stock"
                required
                value={stock}
                name="stock"
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    stock: e.target.value.slice(0, 2),
                  })
                }
              />
            </div>

            <div className="ap-input">
              <MdOutlineCategory className="text-xl text-[#ff6b35]" />
              <select
                value={category}
                name="category"
                required
                onChange={(e) =>
                  setProductData({ ...productData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className={`w-[25vw] h-fit flex flex-col gap-2`}>
              <label className="select-images">
                Select images
                <input
                  className="file"
                  type="file"
                  accept="image/*"
                  name="avatar"
                  multiple
                  onChange={imageChange}
                />
              </label>

              <div className="p-1 flex gap-2 overflow-x-auto">
                {imgPrev.map((image, index) => (
                  <img
                    key={index}
                    className="w-[50px] rounded-sm border-[1px]"
                    src={image}
                    alt="product Images"
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full h-[6vh] bg-[#ff6b35e7] flex justify-center items-center text-white cursor-pointer rounded-lg hover:bg-[#f1582dda]"
              disabled={loading}
            >
              {loading ? (
                <TbLoader2 className="rotate text-lg" />
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
