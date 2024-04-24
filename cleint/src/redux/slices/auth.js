import { createSlice } from "@reduxjs/toolkit";

import axios from "../../utils/axios";

// ----------------------------------------------------------------------

const initialState = {
    isLoggedIn: false,
    token: "",
    isLoading: false,
    user: null,
    user_id: null,
    email: "",
    error: false,
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateIsLoading(state, action) {
            state.error = action.payload.error;
            state.isLoading = action.payload.isLoading;
        },
        logIn(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
            state.user_id = action.payload.user_id;
        },
        signOut(state, action) {
            state.isLoggedIn = false;
            state.token = "";
            state.user_id = null;
        },
    },
});

// Reducer
export default slice.reducer;


export function LoginUser(formValues) {
    return async (dispatch, getState) => {
        // Make API call here
        const url = "/auth/login"
        const headers = { "Content-Type": "application/json" }
        dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

        await axios.post(url, { ...formValues, }, { headers })
            .then(function (response) {
                console.log(response);
                const logInParams = { isLoggedIn: true, token: response.data.token, user_id: response.data.user_id }

                dispatch(slice.actions.logIn(logInParams))
                window.localStorage.setItem("user_id", response.data.user_id);
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
            });
    };
}

// export function LogoutUser() {
//     return async (dispatch, getState) => {
//         window.localStorage.removeItem("user_id");
//         dispatch(slice.actions.signOut());
//     };
// }
 