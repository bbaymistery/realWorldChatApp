import { useTheme } from '@emotion/react'
import {  Box, Divider, IconButton, Stack, } from '@mui/material'
import React, { useState } from 'react'
import useSettings from '../../hooks/useSettings'
import Logo from '../../assets/Images/logo.ico'
import { Nav_Buttons, Nav_Setting } from '../../data'
import AntSwitch from '../../components/AntSwitchStyled'
import ProfileMenu from './ProfileMenu'

const SideBarLayout = () => {
    const theme = useTheme()
    const [selected, setSelected] = useState(0)
    const { onToggleMode } = useSettings()
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
                                <IconButton sx={{ width: "max-content", color: 'white' }} key={el.index}>   {el.icon}  </IconButton>
                            </Box> :
                            <IconButton key={i + 200} onClick={() => { setSelected(el.index) }} sx={{ width: "max-content", color: theme.palette.mode === "light" ? "#000" : theme.palette.text.primary }} >   {el.icon}  </IconButton>
                        ))}
                        <Divider sx={{ width: "48px" }} />

                        {Nav_Setting.map((el, i) => (el.index === selected ?
                            <Box key={i + 100} sx={{ backgroundColor: theme.palette.primary.main, borderRadius: 1.5, }} p={1}>
                                <IconButton sx={{ width: "max-content", color: 'white' }} key={el.index}>   {el.icon}  </IconButton>
                            </Box>
                            :
                            <IconButton key={i + 1000} onClick={() => { setSelected(el.index) }} sx={{ width: "max-content", color: theme.palette.mode === "light" ? "#000" : theme.palette.text.primary }} >   {el.icon}  </IconButton>
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