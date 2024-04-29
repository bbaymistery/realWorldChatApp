import React from "react";
import Chats from "./Chat/Chats";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import Conversation from "../../components/Conversation";
import ContactDashboardSection from "../../sections/Dashboard/ContactDashboardSection";
import { useSelector } from "react-redux";
import ContactDashboaredSectionSharedMessages from "../../sections/Dashboard/ContactDashboaredSectionSharedMessages";
import ContactDashboardSectionStarredMessages from "../../sections/Dashboard/ContactDashboardSectionStarredMessages";
import NoChat from "../../assets/Illustration/NoChat";
import { Link } from "react-router-dom";
const GeneralApp = () => {
  const theme = useTheme()
  const { sideBar, room_id, chat_type } = useSelector((state) => state.app);

  const sidebarTypeComponent = (sideBar) => {
    switch (sideBar.type) {
      case "CONTACT": return <ContactDashboardSection />
      case "STARRED": return <ContactDashboardSectionStarredMessages />;
      case "SHARED": return <ContactDashboaredSectionSharedMessages />;
      default: break;
    }
  }
  const boxWidth = sideBar.open ? `calc(100vw - 740px )` : "calc(100vw - 420px )"
  const bgBox = theme.palette.mode === "light" ? "#F0F4FA" : theme.palette.background.paper
  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>

      <Chats />

      {/* //!Coversation  430 sidebar+en soldaki logolu olan yer +320de contact info (ContactDashboardSectionOlan Yer) */}
      <Box sx={{ height: "100%", width: boxWidth, backgroundColor: bgBox }}>
        {chat_type === "individual" && room_id !== null ? <Conversation /> :
          (<Stack spacing={2} sx={{ height: "100%", width: "100%" }} alignItems="center" justifyContent={"center"}   >
            <NoChat />
            <Typography variant="subtitle2">
              Select a conversation or start a{" "}
              <Link style={{ color: theme.palette.primary.main, textDecoration: "none" }} to="/"  >
                new one
              </Link>
            </Typography>
          </Stack>)}
      </Box>
      {sideBar.open && sidebarTypeComponent(sideBar)}

    </Stack>
  );
};

export default GeneralApp;
