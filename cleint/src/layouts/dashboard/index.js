import { Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import SideBarLayout from "./SideBarLayout";
// const isAuthenticated = false

const DashboardLayout = () => {
  // if (!isAuthenticated) {
  //   return <Navigate to="/auth/login" />
  // }
  return (
    <Stack direction="row">
      <SideBarLayout />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
