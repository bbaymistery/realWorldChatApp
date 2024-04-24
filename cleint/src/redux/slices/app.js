import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
    sideBar: {
        open: false,
        //by default when sidebar open we show by default contact
        type: "CONTACT", // can be CONTACT, STARRED, SHARED
    },
    chat_type: null,
    room_id: null,
};

//todo App slice  starts
const slice = createSlice({
    name: "app",
    initialState,
    reducers: {

        // Toggle Sidebar
        toggleSideBar(state) {
            state.sideBar.open = !state.sideBar.open;
        },
        updateSideBarType(state, action) {
            state.sideBar.type = action.payload.type;
        },
    },
});

export function ToggleSidebar() {
    return async (dispatch, getState) => dispatch(slice.actions.toggleSideBar());
}
export function UpdateSidebarType(type) {
    return async (dispatch, getState) => dispatch(slice.actions.updateSideBarType({ type }));
}

//! App slice  finish



// Reducer
export default slice.reducer;