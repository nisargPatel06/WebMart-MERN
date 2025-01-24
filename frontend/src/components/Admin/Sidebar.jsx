import React from "react";
import { BiSolidBarChartAlt2, BsHandbagFill, IoPersonSharp } from "../index";
import { NavLink } from "react-router-dom";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

const Sidebar = () => {
  return (
    <div className="p-5 w-[18vw] h-fit sticky top-[85px] bg-gray-100 rounded-lg">
      <div className="flex flex-col gap-3">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `p-1 text-lg rounded-md hover:bg-gray-200 ${
              isActive ? "bg-gray-200 text-[#ff6b35]" : "text-gray-600"
            }`
          }
        >
          <p className="flex items-center gap-2">
            <BiSolidBarChartAlt2 />
            <span className="text-gray-600">Dashboard</span>
          </p>
        </NavLink>

        <SimpleTreeView>
          <TreeItem itemId="product" label="Product">
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `${isActive ? "text-[#ff6b35]" : "text-gray-600"}`
              }
            >
              <TreeItem itemId="all" label="All" />
            </NavLink>
            <NavLink
              to="/admin/addproduct"
              className={({ isActive }) =>
                `${isActive ? "text-[#ff6b35]" : "text-gray-600"}`
              }
            >
              <TreeItem itemId="add" label="Add" />
            </NavLink>
          </TreeItem>
        </SimpleTreeView>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `p-1 text-lg rounded-md hover:bg-gray-200 ${
              isActive ? "bg-gray-200 text-[#ff6b35]" : "text-gray-600"
            }`
          }
        >
          <p className="flex items-center gap-2">
            <BsHandbagFill />
            <span className="text-gray-600">Orders</span>
          </p>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `p-1 text-lg rounded-md hover:bg-gray-200 ${
              isActive ? "bg-gray-200 text-[#ff6b35]" : "text-gray-600"
            }`
          }
        >
          <p className="flex items-center gap-2">
            <IoPersonSharp />
            <span className="text-gray-600">Users</span>
          </p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
