import React from 'react'
import { useDispatch } from 'react-redux'
import { UpdateSidebarType } from '../../redux/slices/app'
import useResponsive from '../../hooks/useResponsive';
import { useTheme } from '@emotion/react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft, } from 'phosphor-react';
import Conversation from '../../components/Conversation';
import Messages from '../../components/Chat/Messages';
import { scrollingStyles } from '../../components/scrollingStyles';

const ContactDashboardSectionStarredMessages = () => {
    const dispatch = useDispatch();

    const theme = useTheme();

    const isDesktop = useResponsive("up", "md");

    return (
        <Box sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh", }}>
            <Stack sx={{ height: "100%", }}>
                <Box sx={{ boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)", width: "100%", backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background, }}   >
                    <Stack sx={{ height: "100%", p: 2 }} direction="row" alignItems={"center"} spacing={3}   >
                        <IconButton onClick={() => { dispatch(UpdateSidebarType("CONTACT")) }}> <ArrowLeft /> </IconButton>
                        <Typography variant="subtitle2">Starred Messages</Typography>
                    </Stack>
                </Box>
                <Stack sx={{ height: "100%", position: "relative", flexGrow: 1, ...scrollingStyles }} spacing={3}     >
                    {/* <Conversation /> */}
                    <Messages />
                </Stack>
            </Stack>
        </Box>
    );
}

export default ContactDashboardSectionStarredMessages