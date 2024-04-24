import { Stack } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBarLayout from "./SideBarLayout";
import {  useSelector } from "react-redux";

const DashboardLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  
  if (!isLoggedIn)  return <Navigate to="/auth/login" />
  
  return (
    <Stack direction="row">
      <SideBarLayout />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
