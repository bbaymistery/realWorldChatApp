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
            case "divider": return <Timeline key={index + -1000} el={chat} />;
            case "msg":
              switch (chat.subtype) {
                case "img": return <MediaMsg key={index} el={chat} menu={true} />;
                case "doc": return <DocMsg key={index + 100} el={chat} menu={true} />;
                case "link": return <LinkMsg key={index + 1000} el={chat} menu={true} />;
                case "reply": return <ReplyMsg key={index + 10000} el={chat} menu={true} />;
                default: return <TextMsg key={index + 100000} el={chat} menu={true} />;
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