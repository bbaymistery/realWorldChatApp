import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBarLayout from "./SideBarLayout";
import { useDispatch, useSelector } from "react-redux";
import { socket, connectSocket } from "../../socket";
import { showSnackbar } from "../../redux/slices/app";
const DashboardLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };

      window.onload();

      if (!socket) connectSocket(user_id);

      socket.on("new_friend_request", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });

      socket.on("request_accepted", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }))
      });

      socket.on("request_sent", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
    }

    // Remove event listener on component unmount
    return () => {
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("request_sent");
    };
  }, [isLoggedIn, user_id, dispatch]);

  if (!isLoggedIn) return <Navigate to="/auth/login" />

  return (
    <Stack direction="row">
      <SideBarLayout />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
