import React from "react";
import Chats from "./Chat/Chats";
import { Box, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import Conversation from "../../components/Conversation";

const GeneralApp = () => {
  const theme = useTheme()

  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>
      {/* //!Chats */}
      <Chats />
      {/* //!Coversation */}
      <Box sx={{ height: "100%", width: "calc(100vw - 420px)", backgroundColor: theme.palette.background.paper, }}>
        <Conversation />
      </Box>
    </Stack>
  );
};

export default GeneralApp;
