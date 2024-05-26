import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

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
    //!usercontrollerdeki hgarsiliqlari asagidaki gibidir
    users: [], //exports.getUsers //get-users
    all_users: [], // => exports.getAllVerifiedUsers
    friends: [],//=> exports.getFriends
    friendRequests: [], //=>exports.getFriends
};

//todo App slice  starts
const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchUser(state, action) {
            state.user = action.payload.user;
          },
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
        updateUsers(state, action) {
            state.users = action.payload.users;
        },
        updateAllUsers(state, action) {
            state.all_users = action.payload.users;
        },
        updateFriends(state, action) {
            state.friends = action.payload.friends;
        },
        updateFriendRequests(state, action) {
            state.friendRequests = action.payload.requests;
        },
        selectConversation(state, action) {
            state.chat_type = "individual";
            state.room_id = action.payload.room_id;
        },
    },
});

export function ToggleSidebar() {
    return async (dispatch, getState) => dispatch(slice.actions.toggleSideBar());
}
export function UpdateSidebarType(type) {
    return async (dispatch, getState) => dispatch(slice.actions.updateSideBarType({ type }));
}
export const closeSnackBar = () => async (dispatch, getState) => dispatch(slice.actions.closeSnackBar());
export const SelectConversation = ({ room_id }) => {
    return async (dispatch, getState) => { dispatch(slice.actions.selectConversation({ room_id })) };
};

export const showSnackbar = ({ severity, message }) => async (dispatch, getState) => {
    dispatch(slice.actions.openSnackBar({ message, severity }))
    setTimeout(() => { dispatch(slice.actions.closeSnackBar()); }, 4000)
};
//! App slice  finish


export function FetchUsers() {
    return async (dispatch, getState) => {
        const url = "/user/get-users"
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
        }
        await axios
            .get(url, { headers })
            .then((response) => {
                dispatch(slice.actions.updateUsers({ users: response.data.data }));
            })
            .catch((err) => {
                console.log(err);
                console.log("err");
            });
    };
}
export function FetchAllUsers() {
    return async (dispatch, getState) => {
        const url = "/user/get-all-verified-users"
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
        }
        await axios
            .get(url, { headers })
            .then((response) => {
                dispatch(slice.actions.updateAllUsers({ users: response.data.data }));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}
export function FetchFriends() {
    return async (dispatch, getState) => {
        const url = "/user/get-friends"
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
        }
        await axios
            .get(url, { headers })
            .then((response) => {
                dispatch(slice.actions.updateFriends({ friends: response.data.data }));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}
export function FetchFriendRequests() {
    return async (dispatch, getState) => {
        const url = "/user/get-requests"
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
        }
        await axios
            .get(url, { headers })
            .then((response) => {
                dispatch(slice.actions.updateFriendRequests({ requests: response.data.data }));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}
export const FetchUserProfile = () => {
    
    return async (dispatch, getState) => {
      axios
        .get("/user/get-me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        })
        .then((response) => {
          dispatch(slice.actions.fetchUser({ user: response.data.data }));
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };
  
// Reducer
export default slice.reducer;