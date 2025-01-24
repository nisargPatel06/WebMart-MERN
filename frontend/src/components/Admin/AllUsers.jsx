import React, { useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import { MdEdit, IoClose } from "../index";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Tooltip, IconButton } from "@mui/material";
import AuthContext from "../../context/AuthContext";
import {
  useGetAllUsersQuery,
  useRemoveUserMutation,
} from "../../redux/api/userApi";

const AllUsers = () => {
  const { data, refetch } = useGetAllUsersQuery();
  const [removeUserMutation] = useRemoveUserMutation();
  const { isAuthenticated, showSnackbar } = useContext(AuthContext);
  console.log(data);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  if (data && data.users.length < 1) {
    return <div className="p-5">No User found..</div>;
  }

  const handleRemoveUser = async (id) => {
    await removeUserMutation(id).then(() => {
      refetch();
    });
    showSnackbar("User removed..", "success");
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="p-[3px] flex justify-center">
          <img
            className="h-[45px] rounded-full"
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
      flex: 0.15,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 130,
      flex: 0.2,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 130,
      flex: 0.1,
    },
    {
      field: "options",
      headerName: "Options",
      type: "number",
      minWidth: 130,
      flex: 0.1,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="h-full w-full pl-5 flex items-center justify-end gap-3">
            <Link to="">
              <Tooltip title="Edit">
                <IconButton>
                  <MdEdit className="text-xl text-[#133c55d0]" />
                </IconButton>
              </Tooltip>
            </Link>
            <Tooltip title="Remove">
              <IconButton onClick={() => handleRemoveUser(params.row.id)}>
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
    data.users.forEach((item, index) => {
      rows.push({
        id: item._id,
        image: item.avatar.url,
        name: item.name,
        email: item.email,
        role: item.role,
      });
    });

  return (
    <div className="p-5 flex font-[Nunito] gap-5">
      <Sidebar />

      <div className="p-5 w-[80%] flex flex-col bg-gradient-to-b from-[#f4f6f8] to-[#d8dee7] rounded-lg">
        <h1 className="mb-5 text-center text-xl">All Users</h1>

        <DataGrid
          className="bg-[#fff]"
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 6,
              },
            },
          }}
          pageSizeOptions={[6]}
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
              fontSize: "16px",
              color: "#000000dc",
            },
          }}
        />
      </div>
    </div>
  );
};

export default AllUsers;
