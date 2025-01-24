import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import { Loader } from "./components/index";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
