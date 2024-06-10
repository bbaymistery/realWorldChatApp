import React from "react";
import { Avatar, Box, Fade, Menu, MenuItem, Stack } from "@mui/material";
import { Profile_Menu } from "../../data";
import { faker } from '@faker-js/faker'
import { useNavigate } from "react-router-dom";
import { LogoutUser } from "../../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
//Ui menu constants
const arOrigin = { vertical: "bottom", horizontal: "right", }
const trOrigin = { vertical: "bottom", horizontal: "left", }
const labelId = "profile-positioned-button"
const ctrlId = "profile-positioned-menu"
const menuProp = { "aria-labelledby": "fade-button", }

const ProfileMenu = () => {
    const {user} = useSelector((state) => state.app);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => setAnchorEl(null);
    const user_name =`${user.firstName} ${user.lastName}`;
    const user_img = faker.image.avatar()
    const user_id = window.localStorage.getItem("user_id");
    const onClickFunctionStack = (idx) => {
        if (idx === 0) navigate("/profile")
        else if (idx === 1) navigate("/settings")
        else {
            dispatch(LogoutUser());
            socket.emit("end", { user_id });
        }

    }

    return (
        <>
            <Avatar id={labelId} aria-controls={openMenu ? ctrlId : undefined} aria-haspopup="true" aria-expanded={openMenu ? "true" : undefined} alt={user_name} src={user_img} onClick={handleClick} />
            <Menu MenuListProps={menuProp} TransitionComponent={Fade} id={ctrlId} aria-labelledby={labelId} anchorEl={anchorEl} open={openMenu} onClose={handleClose} anchorOrigin={arOrigin} transformOrigin={trOrigin}  >
                <Box p={1}>
                    <Stack spacing={1}>
                        {Profile_Menu.map((el, idx) => (
                            <MenuItem key={idx} onClick={handleClose}>
                                <Stack onClick={() => onClickFunctionStack(idx)} sx={{ width: 100 }} direction="row" alignItems={"center"} justifyContent="space-between"  >
                                    <span>{el.title}</span>
                                    {el.icon}
                                </Stack>
                            </MenuItem>
                        ))}
                    </Stack>
                </Box>
            </Menu>
        </>
    );
};

export default ProfileMenu;