import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { ArchiveBox, CircleDashed, MagnifyingGlass, Users } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { useTheme } from "@mui/material/styles";
import Divider from '@mui/material/Divider';
import { Search } from '../../../components/Search/index';
import { StyledInputBase } from '../../../components/Search/StyledInputBase';
import { ChatList } from '../../../data';
import { scrollingStyles } from '../../../components/scrollingStyles';
import ChatElement from '../../../components/ChatElement';
import Friends from '../../../sections/Dashboard/Friend';

const Chats = () => {
    const theme = useTheme();
    const [showScrollbar, setShowScrollbar] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const handleScroll = () => {
        setShowScrollbar(true);
        // Clear previous timeout
        clearTimeout(timeoutId);
        // Set a new timeout to hide the scrollbar after 500ms
        const newTimeoutId = setTimeout(() => {
            setShowScrollbar(false);
        }, 1000);

        // Update timeoutId state
        setTimeoutId(newTimeoutId);
    };
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    useEffect(() => {
        // Clear timeout when component unmounts or when timeoutId changes
        return () => clearTimeout(timeoutId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeoutId]);

    return (
        <>
            <Box sx={{ position: "relative", width: 320, backgroundColor: theme.palette.mode === "light" ? "#F8FAFA" : "#1e252f", boxShadow: "0px 0px 2px rgba(0,0,0,0.25)" }}>

                <Stack p={4} spacing={2} sx={{ height: "100vh" }}>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} >
                        <Typography color={{ color: theme.palette.mode === "light" ? "#000" : "#fff" }} variant="h5">
                            Chats
                        </Typography>
                        <IconButton onClick={() => { handleOpenDialog() }} sx={{ width: "max-content" }} >
                            <Users />
                        </IconButton>
                        <IconButton>
                            <CircleDashed />
                        </IconButton>
                    </Stack>

                    <Stack sx={{ width: "100%" }} >
                        <Search >
                            <MagnifyingGlass color="#709ce6" style={{ marginLeft: "15px" }} />
                            <StyledInputBase placeholder='Search' inputProps={{ "ara-label": "search" }} />
                        </Search>
                    </Stack>
                    <Stack spacing={1}>
                        <Stack direction="row" alignItems={"center"} spacing={1.5}>
                            <ArchiveBox size={24} />
                            <Button>Archive</Button>
                        </Stack>
                        <Divider variant='middle' />
                    </Stack>

                    <Stack direction="column" sx={{ flexGrow: 1, height: '100%', ...scrollingStyles }} onScroll={handleScroll}   >
                        <Stack spacing={2.4}>
                            <Typography variant='subtitle2' sx={{ color: "#676767" }}>Pinned</Typography>
                            {ChatList.filter((el, _) => el.pinned).map((el, i) => {
                                return <ChatElement key={el.id} theme={theme} {...el} />
                            })}
                        </Stack>
                        <br />
                        <Stack spacing={2.4}>
                            <Typography variant='subtitle2' sx={{ color: "#676767" }}>All Chats</Typography>
                            {ChatList.filter((el, _) => !el.pinned).map((el, i) => {
                                return <ChatElement key={el.id} theme={theme} {...el} />
                            })}
                        </Stack>
                    </Stack>
                </Stack>
            </Box >
            {openDialog && (<Friends open={openDialog} handleClose={handleCloseDialog} />)}
        </>
    )
}


export default Chats

/*
    
*/