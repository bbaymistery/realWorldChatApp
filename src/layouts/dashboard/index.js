import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Divider, IconButton, Stack, styled, Switch } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Logo from '../../assets/Images/logo.ico'
import { Nav_Buttons, Nav_Setting } from "../../data";
import { faker } from "@faker-js/faker";
import useSettings from "../../hooks/useSettings";
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 40,
  height: 20,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 16,
    height: 16,
    borderRadius: 8,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));
const DashboardLayout = () => {
  const theme = useTheme()
  const [selected, setSelected] = useState(0)
  const { onToggleMode } = useSettings()
  return (
    // <>
    <div style={{ display: 'flex' }}>
      <Box p={2} sx={{ backgroundColor: theme.palette.background.paper, height: "100vh", width: 100, boxShadow: "0px 0px 2px rgba(0,0,0,0.25)" }}>
        <Stack spacing={3} direction={"column"} sx={{ width: "100%", height: "100%" }} alignItems={"center"} justifyContent={"space-between"}>
          <Stack alignItems="center" spacing={4} >
            <Box sx={{ backgroundColor: theme.palette.primary.main, height: 64, width: 64, boxShadow: "0px 0px 2px rgba(0,0,0,0.25)", borderRadius: 1.5 }}  >
              <img src={Logo} alt="Chat App Logo" />
            </Box>
            <Stack sx={{ width: "max-content" }} alignItems={"center"} spacing={3}>
              {Nav_Buttons.map((el, i) => (el.index === selected ?
                <Box key={i + 10000} sx={{ backgroundColor: theme.palette.primary.main, borderRadius: 1.5, }} p={1}>
                  <IconButton sx={{ width: "max-content", color: 'white' }} key={el.index}>   {el.icon}  </IconButton>
                </Box> :
                <IconButton key={i + 200} onClick={() => { setSelected(el.index) }} sx={{ width: "max-content", color: theme.palette.mode === "light" ? "#000" : theme.palette.text.primary }} key={el.index}>   {el.icon}  </IconButton>
              ))}
              <Divider sx={{ width: "48px" }} />

              {Nav_Setting.map((el, i) => (el.index === selected ?
                <Box key={i + 100} sx={{ backgroundColor: theme.palette.primary.main, borderRadius: 1.5, }} p={1}>
                  <IconButton sx={{ width: "max-content", color: 'white' }} key={el.index}>   {el.icon}  </IconButton>
                </Box>
                :
                <IconButton key={i + 1000} onClick={() => { setSelected(el.index) }} sx={{ width: "max-content", color: theme.palette.mode === "light" ? "#000" : theme.palette.text.primary }} key={el.index}>   {el.icon}  </IconButton>
              ))}

            </Stack>
          </Stack>

          <Stack spacing={4}>
            <AntSwitch onChange={() => { onToggleMode() }} defaultChecked />
            <Avatar src={faker.image.avatar()} />
          </Stack>
        </Stack>
      </Box>
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
