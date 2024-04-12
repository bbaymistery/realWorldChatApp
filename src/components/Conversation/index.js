import { Box, Stack } from '@mui/material'
import React from 'react'
import ChatHeader from '../Chat/Header'
import { useTheme } from '@emotion/react'
import ChatFooter from '../Chat/Footer'

const Conversation = () => {
    const theme = useTheme()

    return (
        <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
            {/* Chat Header */}
            <ChatHeader />
            {/* Msg */}
            <Box width={"100%"} sx={{ flexGrow: 1 }}>
                Msg
            </Box>
            {/* Footer */}
            <ChatFooter />
        </Stack>
    )
}

export default Conversation