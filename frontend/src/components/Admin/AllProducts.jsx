import React, { useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import { MdEdit, IoClose } from "../index";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Tooltip, IconButton } from "@mui/material";
import {
  useGetAdminProductsQuery,
  useRemoveProductMutation,
} from "../../redux/api/productApi";
import AuthContext from "../../context/AuthContext";

const AllProducts = () => {
  const { data, refetch } = useGetAdminProductsQuery();
  const [removeProductMutation] = useRemoveProductMutation();
  const { isAuthenticated, showSnackbar } = useContext(AuthContext);
  console.log(data);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const handleRemoveProduct = async (id) => {
    await removeProductMutation(id).then(() => {
      refetch();
    });
    showSnackbar("Product removed..", "success");
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="p-[2px] flex justify-center">
          <img
            className="h-[45px] rounded-sm"
            src={params.value}
            alt={params.row.name}
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 170,
      flex: 0.25,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 130,
      flex: 0.1,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 130,
      flex: 0.1,
    },
    {
      field: "options",
      headerName: "Options",
      type: "number",
      minWidth: 130,
      flex: 0.15,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="h-full w-full pl-5 flex items-center justify-end gap-3">
            <Link to={`/admin/products/${params.row.id}`}>
              <Tooltip title="Edit">
                <IconButton>
                  <MdEdit className="text-xl text-[#133c55d0]" />
                </IconButton>
              </Tooltip>
            </Link>
            <Tooltip title="Remove">
              <IconButton onClick={() => handleRemoveProduct(params.row.id)}>
                <IoClose className="text-xl text-[#ff6b35]" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const rows = [];
  data &&
    data.products.forEach((item, index) => {
      rows.push({
        id: item._id,
        image: item.image[0].url,
        name: item.name,
        stock: item.stock,
        price: item.price,
      });
    });

  return (
    <div className="p-5 flex font-[Nunito] gap-5">
      <Sidebar />

      {data && data.products.length > 0 ? (
        <div className="p-5 w-[80%] flex flex-col bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7] rounded-lg">
          <h1 className="mb-5 text-center text-xl">All Products</h1>
          <DataGrid
            className="bg-[#fff]"
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                fontFamily: "Nunito",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#000",
              },
              "& .MuiDataGrid-cell": {
                fontFamily: "Nunito",
                fontSize: "15px",
                color: "#000000dc",
              },
            }}
          />
        </div>
      ) : (
        <div className="p-5 w-[80%] h-[50vh] text-xl flex justify-center items-center bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7] rounded-lg">
          No products found..
        </div>
      )}
    </div>
  );
};

export default AllProducts;
