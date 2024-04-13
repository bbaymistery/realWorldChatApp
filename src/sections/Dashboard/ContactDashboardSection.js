import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Button, Divider, IconButton, Stack, Typography, Slide, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from "@mui/material";
import { faker } from "@faker-js/faker";
import { Bell, CaretRight, Phone, Prohibit, Star, Trash, VideoCamera, X, } from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import AntSwitch from "../../components/AntSwitchStyled";
import { ToggleSidebar, UpdateSidebarType } from "../../redux/slices/app";
import { useDispatch } from "react-redux";
import { scrollingStyles } from "../../components/scrollingStyles";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BlockDialog = ({ open, handleClose }) => {
    return (
        <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description"  >
            <DialogTitle>Block this contact</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Are you sure you want to block this Contact?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Yes</Button>
            </DialogActions>
        </Dialog>
    );
};

const DeleteChatDialog = ({ open, handleClose }) => {
    return (
        <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description" >
            <DialogTitle>Delete this chat</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Are you sure you want to delete this chat?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Yes</Button>
            </DialogActions>
        </Dialog>
    );
};

const ContactDashboardSection = () => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const isDesktop = useResponsive("up", "md");
    const [openBlock, setOpenBlock] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const handleCloseBlock = () => setOpenBlock(false);
    const handleCloseDelete = () => setOpenDelete(false);

    const bgBox = theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background
    return (
        <Box sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
            <Stack sx={{ height: "100%" }}>
                <Box sx={{ boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)", width: "100%", backgroundColor: bgBox }} >
                    <Stack sx={{ height: "100%", p: 2 }} direction="row" alignItems={"center"} justifyContent="space-between" spacing={3}>
                        <Typography variant="subtitle2">Contact Info</Typography>
                        <IconButton onClick={() => { dispatch(ToggleSidebar()); }} >  <X /> </IconButton>
                    </Stack>
                </Box>
                <Stack sx={{ height: "100%", position: "relative", flexGrow: 1, ...scrollingStyles }} p={2} spacing={3}>
                    <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={faker.image.avatar()} sx={{ height: 64, width: 64 }} />
                        <Stack spacing={0.5}>
                            <Typography variant="article" fontWeight={600}> {"Elgun"}</Typography>
                            <Typography variant="body2" fontWeight={500}>{"+91 62543 28 739"} </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" justifyContent={"space-evenly"}  >
                        <Stack alignItems={"center"} spacing={1}>
                            <IconButton><Phone /></IconButton>
                            <Typography variant="overline">Voice</Typography>
                        </Stack>
                        <Stack alignItems={"center"} spacing={1}>
                            <IconButton><VideoCamera /></IconButton>
                            <Typography variant="overline">Video</Typography>
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack spacing={0.5}>
                        <Typography variant="article" fontWeight={600}>  About </Typography>
                        <Typography variant="body2" fontWeight={500}>  {"I am Developer"}  </Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" alignItems="center" justifyContent={"space-between"}    >
                        <Typography variant="subtitle2">Media, Links..</Typography>
                        <Button onClick={() => { dispatch(UpdateSidebarType("SHARED")) }} endIcon={<CaretRight />} > SharedMessages </Button>
                    </Stack>
                    <Stack direction={"row"} alignItems="center" spacing={2}>
                        {[1, 2, 3].map((el, i) => (<Box key={i}>  <img src={faker.image.city()} alt={faker.internet.userName()} />   </Box>))}
                    </Stack>
                    <Divider />
                    <Stack direction="row" alignItems="center" justifyContent={"space-between"}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Star size={21} />
                            <Typography variant="subtitle2">Starred Messages</Typography>
                        </Stack>
                        <IconButton onClick={() => { dispatch(UpdateSidebarType("STARRED")) }}><CaretRight /></IconButton>
                    </Stack>
                    <Divider />
                    <Stack direction="row" alignItems="center" justifyContent={"space-between"}  >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Bell size={21} />
                            <Typography variant="subtitle2">Mute Notifications</Typography>
                        </Stack>
                        <AntSwitch />
                    </Stack>
                    <Divider />
                    <Typography variant="body2">1 group in common</Typography>
                    <Stack direction="row" alignItems={"center"} spacing={2}>
                        <Avatar src={faker.image.imageUrl()} alt={faker.name.fullName()} />
                        <Stack direction="column" spacing={0.5}>
                            <Typography variant="subtitle2">Camel’s Gang</Typography>
                            <Typography variant="caption">   Owl, Parrot, Rabbit , You      </Typography>
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack direction="row" alignItems={"center"} spacing={2}>
                        <Button onClick={() => { setOpenBlock(true); }} fullWidth startIcon={<Prohibit />} variant="outlined">
                            Block
                        </Button>
                        <Button onClick={() => { setOpenDelete(true); }} fullWidth startIcon={<Trash />} variant="outlined">
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
            {openBlock && <BlockDialog open={openBlock} handleClose={handleCloseBlock} />}
            {openDelete && <DeleteChatDialog open={openDelete} handleClose={handleCloseDelete} />}
        </Box>
    );
};

export default ContactDashboardSection;
