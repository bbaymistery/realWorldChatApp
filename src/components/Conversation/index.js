import { Box, Stack } from '@mui/material'
import React from 'react'
import ChatHeader from '../Chat/Header'
import { useTheme } from '@emotion/react'
import ChatFooter from '../Chat/Footer'
import ChatMessages from '../Chat/Messages'

const Conversation = () => {
    const theme = useTheme()

    return (
        <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
            {/* Chat Header */}
            <ChatHeader />
            {/* Msg */}
            <Box width={"100%"} sx={{
                flexGrow: 1,
                height: "100%",
                overflowY: "scroll",
                '&::-webkit-scrollbar': {
                    width: '4px',  // Width of the scrollbar
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
            }}>
                <ChatMessages />
            </Box>
            {/* Footer */}
            <ChatFooter />
        </Stack>
    )
}

export default Conversation