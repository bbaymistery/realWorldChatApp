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
    snackbar: {
        open: null,
        severity: null,
        message: null,
    },
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
        openSnackBar(state, action) {
            state.snackbar.open = true;
            state.snackbar.severity = action.payload.severity;
            state.snackbar.message = action.payload.message;
        },
        closeSnackBar(state) {
            state.snackbar.open = false;
            state.snackbar.message = null;
        },
    },
});

export function ToggleSidebar() {
    return async (dispatch, getState) => dispatch(slice.actions.toggleSideBar());
}
export function UpdateSidebarType(type) {
    return async (dispatch, getState) => dispatch(slice.actions.updateSideBarType({ type }));
}
export const closeSnackBar = () => async (dispatch, getState) => {
    dispatch(slice.actions.closeSnackBar());
};

export const showSnackbar = ({ severity, message }) => async (dispatch, getState) => {
    dispatch(slice.actions.openSnackBar({ message, severity }))
    setTimeout(() => { dispatch(slice.actions.closeSnackBar()); }, 4000)
};
//! App slice  finish



// Reducer
export default slice.reducer;