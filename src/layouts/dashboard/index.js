import { Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import SideBarLayout from "./SideBarLayout";

const DashboardLayout = () => {
  return (
    <Stack direction="row">
      <SideBarLayout />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
