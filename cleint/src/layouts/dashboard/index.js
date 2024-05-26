import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBarLayout from "./SideBarLayout";
import { useDispatch, useSelector } from "react-redux";
import { socket, connectSocket } from "../../socket";
import { FetchUserProfile, SelectConversation, showSnackbar } from "../../redux/slices/app";
import { AddDirectConversation, AddDirectMessage, UpdateDirectConversation } from "../../redux/slices/conversation";
const DashboardLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const user_id = window.localStorage.getItem("user_id");
  const { conversations, current_conversation } = useSelector((state) => state.conversation.direct_chat);

  
  useEffect(() => {
    dispatch(FetchUserProfile());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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

      socket.on("new_message", (data) => {
        const message = data.message;
        // check if msg we got is from currently selected conversation
        if (current_conversation?.id === data.conversation_id) {
          
          dispatch(
            AddDirectMessage({
              // id: message._id,
              type: "msg",
              subtype: message.type,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
            })
          );
        }
      });
      //we will cpntinue on next episode
      socket.on("start_chat", (data) => {
        console.log(data);
        // add / update to conversation list
        const existing_conversation = conversations.find(el => el?.id === data._id)
        if (existing_conversation) {
          // update direct conversation
          dispatch(UpdateDirectConversation({ conversation: data }));
        } else {
          // add direct conversation
          dispatch(AddDirectConversation({ conversation: data }));
        }
        dispatch(SelectConversation({ room_id: data._id }));
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
      socket?.off("new_message");
      socket?.off("start_chat");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn,socket]);



  if (!isLoggedIn) return <Navigate to="/auth/login" />

  return (
    <Stack direction="row">
      <SideBarLayout />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
