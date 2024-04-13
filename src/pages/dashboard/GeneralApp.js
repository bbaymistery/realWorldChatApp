import React from "react";
import Chats from "./Chat/Chats";
import { Box, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import Conversation from "../../components/Conversation";
import ContactDashboardSection from "../../sections/Dashboard/ContactDashboardSection";
import { useSelector } from "react-redux";

const GeneralApp = () => {
  const theme = useTheme()
  const { sideBar, room_id, chat_type } = useSelector((state) => state.app);

  const sidebarTypeComponent = (sideBar) => {
    switch (sideBar.type) {
      case "CONTACT": return <ContactDashboardSection />
      case "STARRED": return <></>;
      case "SHARED": return <></>;
      default: break;
    }
  }
  const boxWidth = sideBar.open ? `calc(100vw - 740px )` : "calc(100vw - 420px )"
  const bgBox = theme.palette.mode === "light" ? "#F0F4FA" : theme.palette.background.paper
  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>
      {/* //!Chats */}
      <Chats />
      {/* //!Coversation  430 sidebar+en soldaki logolu olan yer +320de contact info (ContactDashboardSectionOlan Yer) */}
      <Box sx={{ height: "100%", width: boxWidth, backgroundColor: bgBox }}>
        <Conversation />
      </Box>

      {sideBar.open && sidebarTypeComponent(sideBar)}

    </Stack>
  );
};

export default GeneralApp;
