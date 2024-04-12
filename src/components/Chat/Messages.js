import { Box, Stack } from '@mui/material'
import React from 'react'
import { Chat_History } from '../../data'
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from '../../sections/Dashboard/ConversationDashBoardSection'

const Messages = () => {
  return (
    <Box p={3}>
      {/*
       for displaying chat message we use dummy data
      Chat_History e bax sybtype falan goreceysen ona gore swithler yazilib
      */}
      <Stack direection="column">
        {Chat_History.map((chat, index) => {
          switch (chat.type) {
            case "divider": return <Timeline el={chat} />;
            case "msg":
              switch (chat.subtype) {
                case "img": return <MediaMsg el={chat} />;
                case "doc": return <DocMsg el={chat} />;
                case "link": return <LinkMsg el={chat} />;
                case "reply": return <ReplyMsg el={chat} />;
                default: return <TextMsg el={chat} />;
              }
            default: break;
          }
          return <></>
        })}

      </Stack>
    </Box>
  )
}

export default Messages