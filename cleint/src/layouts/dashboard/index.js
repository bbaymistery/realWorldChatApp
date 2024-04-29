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
  const { conversations, current_conversation } = useSelector((state) => state.conversation.direct_chat);
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
      //we will cpntinue on next episode
      socket.on("start_chat", (data) => {
        console.log(data);
        // add / update to conversation list
        const existing_conversation = conversations.find(el => el?.id === data._id)
        if (existing_conversation) {
          // update direct conversation

        } else {
          // add direct conversation

        }
      });
      socket.on("new_friend_request", () => {
        dispatch(showSnackbar({ severity: "success", message: "New friend request received" }))
      });

      socket.on("request_accepted", () => {
        dispatch(showSnackbar({ severity: "success", message: "Friend Request Accepted" }))
      });

      socket.on("request_sent", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }))
      });

    }

    // Remove event listener on component unmount
    return () => {
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("request_sent");
      socket?.off("request_sent");
      socket?.off("start_chat");
    };
  }, [isLoggedIn, user_id, dispatch, conversations]);

  if (!isLoggedIn) return <Navigate to="/auth/login" />

  return (
    <Stack direction="row">
      <SideBarLayout />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
