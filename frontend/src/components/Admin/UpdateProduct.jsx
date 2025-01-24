import React, { useContext, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Sidebar from "./Sidebar";
import {
  MdSpellcheck,
  MdOutlineDescription,
  LiaRupeeSignSolid,
  TbListNumbers,
  MdOutlineCategory,
  TbLoader2,
} from "../index";
import AuthContext from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../redux/api/productApi";

const UpdateProduct = () => {
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

  const { id } = useParams();
  const { isLoading, data, refetch } = useGetProductDetailsQuery(id);
  const { showSnackbar } = useContext(AuthContext);
  const [updateProductMutation] = useUpdateProductMutation();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    if (data && data.product) {
      setProductData({
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        stock: data.product.stock,
        category: data.product.category,
      });
      setImages(
        data.product.image.map((img) => ({ file: null, url: img.url }))
      );
    }
  }, [data]);

  const { name, description, price, stock, category } = productData;

  const updateProduct = async (e) => {
    e.preventDefault();
    if (
      name === data.product.name &&
      description === data.product.description &&
      price === data.product.price &&
      stock === data.product.stock &&
      category === data.product.category &&
      images.every((img, idx) => img.url === data.product.image[idx]?.url)
    ) {
      return showSnackbar("No changes detected", "error");
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    formData.set("price", price);
    formData.set("stock", stock);
    formData.set("category", category);

    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

    try {
      setLoading(true);
      const response = await updateProductMutation({
        id,
        productData: formData,
      }).unwrap();
      setLoading(false);
      if (response.success) {
        refetch();
        showSnackbar("Product Updated Successfully", "success");
      } else {
        showSnackbar("Error updating product", "error");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating product:", error);
      showSnackbar("Something went wrong! Please try again.", "error");
    }
  };

  const imageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(
      files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
    );
  };

  if (isLoading || !data || !data.product) {
    return isLoading ? <Loader /> : <div>Product details not available</div>;
  }

  return (
    <div className="p-5 flex font-[Nunito] gap-5">
      <Sidebar />

      <div className="p-5 w-[80%] flex justify-center bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7] rounded-lg">
        <form
          encType="multipart/form-data"
          className="p-5 px-8 w-fit flex flex-col gap-4 bg-[#fff] rounded-lg"
          onSubmit={updateProduct}
        >
          <h1 className="text-center text-xl">Update Product</h1>

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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-[25vw] h-fit flex flex-col gap-2">
              <label className="select-images">
                Select images
                <input
                  className="file"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={imageChange}
                />
              </label>

              <div className="p-1 flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <img
                    key={index}
                    className="w-[50px] rounded-sm border-[1px]"
                    src={img.url}
                    alt="Product Images"
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
              {loading ? <TbLoader2 className="rotate text-lg" /> : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
