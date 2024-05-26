import { Box, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { Chat_History } from '../../data'
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from '../../sections/Dashboard/ConversationDashBoardSection'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../../socket'
import { FetchCurrentMessages, SetCurrentConversation } from '../../redux/slices/conversation'

const Messages = () => {
  const dispatch = useDispatch();

  const { conversations, current_messages } = useSelector((state) => state.conversation.direct_chat);
  const { room_id } = useSelector((state) => state.app);

  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);


    socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
      dispatch(FetchCurrentMessages({ messages: data }));
    });

    dispatch(SetCurrentConversation(current));
  }, [conversations, dispatch, room_id]);
  return (
    <Box p={3}>
      {/*
       for displaying chat message we use dummy data
      Chat_History e bax sybtype falan goreceysen ona gore swithler yazilib
      */}
      <Stack direection="column">
        {current_messages.map((chat, index) => {

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