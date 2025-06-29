import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (currentUser && currentUser.isAdmin) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminRoute;
