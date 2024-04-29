import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";

const user_id = window.localStorage.getItem("user_id");

const initialState = {
    direct_chat: {
        conversations: [],
        current_conversation: null,
        current_messages: [],
    },
    group_chat: {},
};

const slice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        fetchDirectConversations(state, action) {
            const list = action.payload.conversations.map((el) => {
                const user = el.participants.find(elm => elm._id.toString() !== user_id);
                return {
                    id: el._id,
                    user_id: user?._id,
                    name: `${user?.firstName} ${user?.lastName}`,
                    online: user?.status === "Online",
                    img: faker.image.avatar(),
                    msg: faker.music.songName(),
                    time: "9:36",
                    unread: 0,
                    pinned: false,
                    about: user?.about,
                };
            });

            state.direct_chat.conversations = list;
        },

    },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const FetchDirectConversations = ({ conversations }) => {
    return async (dispatch, getState) => dispatch(slice.actions.fetchDirectConversations({ conversations }))
};
