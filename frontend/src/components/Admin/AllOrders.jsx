import React, { useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import { MdEdit, IoClose } from "../index";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Tooltip, IconButton } from "@mui/material";
import AuthContext from "../../context/AuthContext";
import {
  useGetAllOrdersQuery,
  useRemoveOrderMutation,
} from "../../redux/api/orderApi";

const AllOrders = () => {
  const { data, refetch } = useGetAllOrdersQuery();
  const [removeOrderMutation] = useRemoveOrderMutation();
  const { isAuthenticated, showSnackbar } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const handleRemoveOrder = async (id) => {
    await removeOrderMutation(id).then(() => {
      refetch();
    });
    showSnackbar("Order removed..", "success");
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 170,
      flex: 0.2,
      renderCell: (params) => {
        return <p>{params.value}</p>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 170,
      flex: 0.1,
      renderCell: (params) => {
        return (
          <span
            className={`${
              params.value === "Processing" ? "text-red-600" : "text-green-600"
            }`}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.1,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 130,
      flex: 0.15,
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
            <Link to={`/admin/orders/${params.row.id}`}>
              <Tooltip title="Edit">
                <IconButton>
                  <MdEdit className="text-xl text-[#133c55d0]" />
                </IconButton>
              </Tooltip>
            </Link>
            <Tooltip title="Remove">
              <IconButton onClick={() => handleRemoveOrder(params.row.id)}>
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
    data.orders.forEach((item, index) => {
      rows.push({
        id: item._id,
        name: item.user.name,
        status: item.orderStatus,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
      });
    });

  return (
    <div className="p-5 flex font-[Nunito] gap-5">
      <Sidebar />

      {data && data.orders.length > 0 ? (
        <div className="p-5 w-[80%] flex flex-col bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7] rounded-lg">
          <h1 className="mb-5 text-center text-xl">All Orders</h1>

          <DataGrid
            className="bg-[#fff]"
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
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
          No orders found..
        </div>
      )}
    </div>
  );
};

export default AllOrders;
