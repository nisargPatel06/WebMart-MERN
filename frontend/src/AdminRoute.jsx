import React, { useContext, useEffect } from "react";
import { Loader } from "./components";
import { useNavigate } from "react-router-dom";
import { useGetUserDetailsQuery } from "./redux/api/userApi";
import AuthContext from "./context/AuthContext";

const AdminRoute = ({ element: Component, ...rest }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useContext(AuthContext);
  const { data, isLoading: userLoading } = useGetUserDetailsQuery();

  useEffect(() => {
    if (!authLoading && !userLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      }
    }
  }, [isAuthenticated, authLoading, userLoading]);

  if (authLoading || userLoading) {
    return <Loader />;
  }
  if (!data) {
    return <div>Only Admin can access this resource !</div>;
  }

  return data.user.role === "admin" ? (
    <Component {...rest} />
  ) : (
    <div className="p-10">
      Your role is "{data.user.role}". You cannot access this resource.
    </div>
  );
};

export default AdminRoute;
