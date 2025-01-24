import React, { useContext, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { MdOpenInNew } from "../index";
import AuthContext from "../../context/AuthContext";
import { useGetMyOrdersQuery } from "../../redux/api/orderApi";
import { useGetUserDetailsQuery } from "../../redux/api/userApi";

const MyOrders = () => {
  const { data, refetch } = useGetMyOrdersQuery();
  const { data: userDetails } = useGetUserDetailsQuery();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  if (data && data.orders.length < 1) {
    return (
      <div className="py-10 text-center text-xl">
        You have not ordered anything yet..
      </div>
    );
  }

  const columns = [
    { field: "id", headerName: "ID", minWidth: 250, flex: 0.7 },
    {
      field: "items",
      headerName: "Items",
      minWidth: 150,
      flex: 0.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 170,
      flex: 0.4,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
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
      field: "details",
      headerName: "See Details",
      minWidth: 130,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link
            className="h-full w-full pl-5 flex items-center"
            to={`/orders/${params.row.id}`}
          >
            <MdOpenInNew className="text-xl text-[#000000be]" />
          </Link>
        );
      },
    },
  ];

  const rows = [];

  data &&
    data.orders.forEach((item, index) => {
      rows.push({
        id: item._id,
        items: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="p-5 py-10 bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7]">
      <h1 className="mb-5 text-xl text-center">
        {userDetails.user.name}'s Orders
      </h1>
      <DataGrid
        className="mx-10 bg-[#fff]"
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
            fontSize: "17px",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            fontFamily: "Nunito",
            fontSize: "15px",
            color: "#000000dc",
          },
        }}
      />
    </div>
  );
};

export default MyOrders;
