import { Avatar, Badge, Box, Stack, Typography, useTheme } from '@mui/material'
import React from 'react'
import BadgeStyled from './BadgeStyled'
import { SelectConversation } from '../redux/slices/app'
import { useDispatch } from 'react-redux'

const ChatElement = (props) => {
    let { id, name, img, msg, time, unread, online } = props
    
    const theme = useTheme()
    const dispatch = useDispatch()
    return (
        <Box onClick={() => {
            dispatch(SelectConversation({ room_id: id }))
        }} key={id} sx={{ width: "100%", borderRadius: 1, backgroundColor: theme.palette.mode === "light" ? "#F8FAFA" : "#161C24", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;" }} p={2}  >
           {msg}
           <br />
           {time}
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Stack direction={"row"} spacing={2}>
                    {online ?
                        <BadgeStyled overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                            <Avatar src={img} />
                        </BadgeStyled> :
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

export default ChatElement