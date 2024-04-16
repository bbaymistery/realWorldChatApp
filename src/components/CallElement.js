import React from "react";
import { Box, Badge, Stack, Avatar, Typography, IconButton, } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { ArrowDownLeft, ArrowUpRight, VideoCamera, Phone, } from "phosphor-react";
import { useDispatch } from "react-redux";

import { faker } from "@faker-js/faker";
import BadgeStyled from "./BadgeStyled";

const StyledChatBox = styled(Box)(() => ({
    "&:hover": {
        cursor: "pointer",
    },
}));



const CallLogElement = ({ img, name, incoming, missed, online, id }) => {
    const theme = useTheme();

    return (
        <StyledChatBox sx={{ width: "100%", borderRadius: 1, backgroundColor: theme.palette.background.paper, }} p={2}>
            <Stack direction="row" alignItems={"center"} justifyContent="space-between"   >
                <Stack direction="row" spacing={2}>
                    {online ? (
                        <BadgeStyled overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot" >
                            <Avatar alt={name} src={faker.image.avatar()} />
                        </BadgeStyled>
                    ) : (<Avatar alt={name} src={faker.image.avatar()} />)}
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                        <Stack spacing={1} alignItems="center" direction={"row"}>
                            {incoming ? <ArrowDownLeft color={missed ? "red" : "green"} /> : <ArrowUpRight color={missed ? "red" : "green"} />}
                            <Typography variant="caption">Yesterday 21:24</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <Phone color="green"  />
                    <VideoCamera />
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

const CallElement = ({ img, name, id, handleClose }) => {
    const dispatch = useDispatch();
    const theme = useTheme();

    return (
        <StyledChatBox sx={{ width: "100%", borderRadius: 1, backgroundColor: theme.palette.background.paper, }} p={2}>
            <Stack direction="row" alignItems={"center"} justifyContent="space-between"   >
                <Stack direction="row" spacing={2}>

                    <Avatar alt={name} src={faker.image.avatar()} />
                    <Stack spacing={0.3} alignItems="center" direction={"row"}>
                        <Typography variant="subtitle2">{name}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <IconButton onClick={() => { handleClose(); }}  >
                        <Phone style={{ color: theme.palette.primary.main }} />
                    </IconButton>
                    <IconButton onClick={() => { handleClose(); }}   >
                        <VideoCamera style={{ color: theme.palette.primary.main }} />
                    </IconButton>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

export { CallLogElement, CallElement };