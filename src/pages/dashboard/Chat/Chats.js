import { Avatar, Badge, Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { ArchiveBox, CircleDashed, MagnifyingGlass } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { useTheme } from "@mui/material/styles";
import Divider from '@mui/material/Divider';
import { Search, StyledBadge, StyledInputBase } from './constants';
import { ChatList } from '../../../data';
const ChatElement = (props) => {
    let { theme, id, name, img, msg, time, unread, online } = props
    return (
        <Box key={id} sx={{ width: "100%", borderRadius: 1, backgroundColor: theme.palette.mode === "light" ? "#F8FAFA" : "#161C24", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;" }} p={2}  >
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Stack direction={"row"} spacing={2}>
                    {online ?
                        <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                            <Avatar src={img} />
                        </StyledBadge> :
                        <Avatar src={img} />}
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                        <Typography variant="caption">{msg} </Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems={"center"}>
                    <Typography sx={{ fontWeight: 600 }} variant='caption'>{time}</Typography>
                    <Badge color='primary' badgeContent={unread} />
                </Stack>
            </Stack>
        </Box>
    )
}

const Chats = () => {
    const theme = useTheme();
    const [showScrollbar, setShowScrollbar] = useState(true);

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

    useEffect(() => {
        // Clear timeout when component unmounts or when timeoutId changes
        return () => clearTimeout(timeoutId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeoutId]);
    return (
        <Box sx={{ position: "relative", width: 320, backgroundColor: theme.palette.mode === "light" ? "#F8FAFA" : "#1e252f", boxShadow: "0px 0px 2px rgba(0,0,0,0.25)" }}>

            <Stack p={4} spacing={2} sx={{ height: "100vh" }}>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} >
                    <Typography color={{ color: theme.palette.mode === "light" ? "#000" : "#fff" }} variant="h5">
                        Chats
                    </Typography>
                    <IconButton><CircleDashed /></IconButton>
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

                <Stack
                    direction="column"
                    sx={{
                        flexGrow: 1,
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        height: '100%',
                        '&::-webkit-scrollbar': {
                            width: showScrollbar ? '4px' : '0px',  // Width of the scrollbar
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent', // Color of the scrollbar track
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#555', // Color of the scrollbar thumb
                            borderRadius: '4px', // Border radius of the scrollbar thumb
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#888', // Color of the scrollbar thumb on hover
                        },
                    }}
                    onScroll={handleScroll} // Attach the handleScroll function to the onScroll event
                >
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
    )
}


export default Chats

/*
    
*/