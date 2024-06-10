import React from "react";
import { Avatar, Box, Divider, Fade, IconButton, Menu, MenuItem, Stack, Typography, } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from "phosphor-react";
import { faker } from "@faker-js/faker";
import { useSearchParams } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import BadgeStyled from "../BadgeStyled";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";

const Conversation_Menu = [
  {
    title: "Contact info",
  },
  {
    title: "Mute notifications",
  },
  {
    title: "Clear messages",
  },
  {
    title: "Delete chat",
  },
];

const ChatHeader = () => {

  const theme = useTheme();
  const dispatch = useDispatch()
  const {current_conversation} = useSelector((state) => state.conversation.direct_chat);
  const user_name =current_conversation?.name;
  const user_img = faker.image.avatar()

  const isMobile = useResponsive("between", "md", "xs", "sm");
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversationMenuAnchorEl, setConversationMenuAnchorEl] = React.useState(null);
  const openConversationMenu = Boolean(conversationMenuAnchorEl);
  const handleClickConversationMenu = (event) => setConversationMenuAnchorEl(event.currentTarget);
  const handleCloseConversationMenu = () => setConversationMenuAnchorEl(null);
  return (
    <Box p={2} width={"100%"} sx={{ backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background, boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)", }} >
      <Stack alignItems={"center"} direction={"row"} sx={{ width: "100%", height: "100%" }} justifyContent="space-between" >
        <Stack onClick={() => {
          searchParams.set("open", true); setSearchParams(searchParams);
          dispatch(ToggleSidebar())

        }} spacing={2} direction="row"  >
          <Box  style={{ cursor: 'pointer' }}>
            <BadgeStyled overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right", }} variant="dot"    >
              <Avatar alt={user_name} src={user_img} />
            </BadgeStyled>
          </Box>
          <Stack  style={{ cursor: 'pointer' }} spacing={0.2}>
            <Typography variant="subtitle2">{user_name}</Typography>
            <Typography variant="caption">Online</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems="center" spacing={isMobile ? 1 : 3}>
          <IconButton><VideoCamera /></IconButton>
          <IconButton><Phone /></IconButton>
          {!isMobile && (<IconButton>  <MagnifyingGlass /></IconButton>)}
          <Divider orientation="vertical" flexItem />

          <IconButton
            aria-haspopup="true"
            id="conversation-positioned-button"
            aria-controls={openConversationMenu ? "conversation-positioned-menu" : undefined}
            aria-expanded={openConversationMenu ? "true" : undefined} onClick={handleClickConversationMenu}>
            <CaretDown />
          </IconButton>
          <Menu
            MenuListProps={{ "aria-labelledby": "fade-button", }}
            TransitionComponent={Fade}
            id="conversation-positioned-menu"
            aria-labelledby="conversation-positioned-button"
            anchorEl={conversationMenuAnchorEl}
            open={openConversationMenu}
            onClose={handleCloseConversationMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}  >
            <Box p={1}>
              <Stack spacing={1}>
                {Conversation_Menu.map((el, i) => (
                  <MenuItem key={i} onClick={handleCloseConversationMenu}>
                    <Stack sx={{ minWidth: 100 }} direction="row" alignItems={"center"} justifyContent="space-between"  >
                      <span>{el.title}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Stack>
            </Box>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatHeader;
