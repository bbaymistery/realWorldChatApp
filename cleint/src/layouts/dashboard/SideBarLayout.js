import { useTheme } from '@emotion/react'
import { Box, Divider, IconButton, Stack, } from '@mui/material'
import React, { useState } from 'react'
import useSettings from '../../hooks/useSettings'
import Logo from '../../assets/Images/logo.ico'
import { Nav_Buttons, Nav_Setting } from '../../data'
import AntSwitch from '../../components/AntSwitchStyled'
import ProfileMenu from './ProfileMenu'
import { useNavigate } from 'react-router-dom'
const getPath = (index) => {
    switch (index) {
        case 0:
            return "/app";

        case 1:
            return "/group";

        case 2:
            return "/call";

        case 3:
            return "/settings";

        default:
            break;
    }
};
const SideBarLayout = () => {
    const theme = useTheme()
    const [selected, setSelected] = useState(0)
    const { onToggleMode } = useSettings()
    const navigate = useNavigate()
    const handleChangeTab = (index) => {
        // dispatch(UpdateTab({ tab: index }));
        navigate(getPath(index));
    };

    return (
        <Box p={2} sx={{ backgroundColor: theme.palette.background.paper, height: "100vh", width: 100, boxShadow: "0px 0px 2px rgba(0,0,0,0.25)" }}>
            <Stack spacing={3} direction={"column"} sx={{ height: "100%" }} alignItems={"center"} justifyContent={"space-between"}>
                <Stack alignItems="center" spacing={4} >
                    <Box sx={{ backgroundColor: theme.palette.primary.main, height: 64, width: 64, boxShadow: "0px 0px 2px rgba(0,0,0,0.25)", borderRadius: 1.5 }}  >
                        <img src={Logo} alt="Chat App Logo" />
                    </Box>
                    <Stack sx={{ width: "max-content" }} alignItems={"center"} spacing={3}>
                        {Nav_Buttons.map((el, i) => (el.index === selected ?
                            <Box key={i + 10000} sx={{ backgroundColor: theme.palette.primary.main, borderRadius: 1.5, }} p={1}>
                                <IconButton onClick={() => { handleChangeTab(el.index) }} sx={{ width: "max-content", color: 'white' }} key={el.index}>   {el.icon}  </IconButton>
                            </Box> :
                            <IconButton key={i + 200} onClick={() => { setSelected(el.index); handleChangeTab(el.index) }} sx={{ width: "max-content", color: theme.palette.mode === "light" ? "#000" : theme.palette.text.primary }} >   {el.icon}  </IconButton>
                        ))}
                        <Divider sx={{ width: "48px" }} />

                        {Nav_Setting.map((el, i) => (el.index === selected ?
                            <Box key={i + 100} sx={{ backgroundColor: theme.palette.primary.main, borderRadius: 1.5, }} p={1}>
                                <IconButton onClick={() => { handleChangeTab(el.index) }} sx={{ width: "max-content", color: 'white' }} key={el.index}>   {el.icon}  </IconButton>
                            </Box>
                            :
                            <IconButton key={i + 1000} onClick={() => { setSelected(el.index); handleChangeTab(el.index) }} sx={{ width: "max-content", color: theme.palette.mode === "light" ? "#000" : theme.palette.text.primary }} >   {el.icon}  </IconButton>
                        ))}

                    </Stack>
                </Stack>

                <Stack spacing={4}>
                    <AntSwitch onChange={() => { onToggleMode() }} defaultChecked />
                    <ProfileMenu />
                </Stack>
            </Stack>
        </Box>
    )
}

export default SideBarLayout