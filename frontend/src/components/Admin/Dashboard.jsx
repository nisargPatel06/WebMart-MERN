import React, { useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import { CiShoppingTag, LiaRupeeSignSolid } from "../index";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Loader from "../Loader/Loader";
import { useGetAllOrdersQuery } from "../../redux/api/orderApi";
import AuthContext from "../../context/AuthContext";
import { useGetAdminProductsQuery } from "../../redux/api/productApi";
import { useGetAllUsersQuery } from "../../redux/api/userApi";

// Register all necessary chart components
Chart.register(...registerables);

const Dashboard = () => {
  const { data: orderData, refetch: refetchOrderData } = useGetAllOrdersQuery();
  const { data: productData, refetch: refetchProductData } =
    useGetAdminProductsQuery();
  const { data: userData, refetch: refetchUserData } = useGetAllUsersQuery();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      refetchOrderData();
      refetchProductData();
      refetchUserData();
    }
  }, [isAuthenticated, refetchOrderData, refetchProductData, refetchUserData]);
  if (orderData && orderData.orders.length < 1) {
    return <Loader />;
  }

  let amount = 0;
  orderData &&
    orderData.orders.forEach((item, index) => {
      amount += item.totalPrice;
    });
  let totalOrders = 0;
  let totalProducts = 0;
  let totalUsers = 0;
  totalOrders = orderData ? orderData.orders.length : 0;
  totalProducts = productData ? productData.products.length : 0;
  totalUsers = userData ? userData.users.length : 0;

  const lineChartData = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "Total Amount",
        data: [0, amount],
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };
  const lineChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutChartData = {
    labels: ["Products", "Orders", "Users"],
    datasets: [
      {
        label: "Distribution",
        data: [totalProducts, totalOrders, totalUsers],
        backgroundColor: ["#38bdf8", "#a78bfa", "#fb923c"],
        hoverBackgroundColor: ["#0ea5e9", "#8b5cf6", "#f97316"],
      },
    ],
  };

  return (
    <div className="p-5 flex font-[Nunito] gap-5">
      <Sidebar />

      <div className="w-[80%] flex flex-col gap-8  rounded-lg">
        <h1 className="text-center text-2xl">Dashboard</h1>

        <div className="mx-20 flex justify-center bg-gray-100 shadow rounded-lg">
          <h1 className="h-[9vh] text-xl flex justify-center gap-2 bg-[#f7d1d1">
            <span className="flex items-center gap-1">
              <CiShoppingTag className="text-[#ff6b35]" />
              Order Total -
            </span>
            <span className="flex items-center 3185b9">
              <LiaRupeeSignSolid className="text-xl" />
              {amount}
            </span>
          </h1>
        </div>

        <div className="flex justify-center gap-5">
          <div className="w-[10vw] h-[10vw] text-lg flex flex-col justify-center items-center rounded-full bg-blue-300">
            <p>Products</p>
            <p className="text-xl">{totalProducts}</p>
          </div>
          <div className="w-[10vw] h-[10vw] text-lg flex flex-col justify-center items-center rounded-full bg-purple-400">
            <p>Orders</p>
            <p className="text-xl">{totalOrders}</p>
          </div>
          <div className="w-[10vw] h-[10vw] text-lg flex flex-col justify-center items-center rounded-full bg-orange-400">
            <p>Users</p>
            <p className="text-xl">{totalUsers}</p>
          </div>
        </div>

        <div className="py-5 flex flex-col items-center gap-8">
          <div className="chart w-[80%]">
            <h2 className="text-center text-xl">Orders Over Time</h2>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>

          <div className="chart w-[23vw] mt-5">
            <h2 className="text-center text-xl">Distribution</h2>
            <Doughnut data={doughnutChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
