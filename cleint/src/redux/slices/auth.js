import { createSlice } from "@reduxjs/toolkit";
import { showSnackbar } from "./app";
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
    //ozumnen ekledim 

    otp: ""
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
            state.isLoading = false;

        },
        updateRegisterEmail(state, action) {
            state.email = action.payload.email;
            state.otp = action.payload.otp;
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
                const logInParams = { isLoggedIn: true, token: response.data.token, user_id: response.data.user_id }

                dispatch(slice.actions.logIn(logInParams))
                window.localStorage.setItem("user_id", response.data.user_id);
                dispatch(showSnackbar({ severity: "success", message: response.data.message }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({ severity: "error", message: error.message }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
            });
    };
}

export function LogoutUser() {
    return async (dispatch, getState) => {
        window.localStorage.removeItem("user_id");
        dispatch(slice.actions.signOut());
    };
}
export function NewPassword(formValues) {
    return async (dispatch, getState) => {

        const url = "/auth/reset-password"
        const headers = { "Content-Type": "application/json" }
        dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

        await axios
            .post(url, { ...formValues, }, { headers })
            .then(function (response) {
                dispatch(slice.actions.logIn({ isLoggedIn: true, token: response.data.token, }));
                dispatch(showSnackbar({ severity: "success", message: response.data.message }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({ severity: "error", message: error.message }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
            });
    };
}

export function ForgotPassword(formValues, callback) {
    return async (dispatch, getState) => {
        const url = "/auth/forgot-password"
        const headers = { "Content-Type": "application/json" }
        dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

        await axios
            .post(url, { ...formValues, }, { headers })
            .then(function (response) {
                console.log(response);

                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
                dispatch(showSnackbar({ severity: "success", message: response.data.message }));
                if (response.data.status === 'success') {
                    callback(response)
                }

            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({ severity: "error", message: error.message }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
            });
    };
}

//!biz yene mail yerine authcontrollerde send otp den new_otp seklinde gonderdik back endden
export function RegisterUser(formValues, callback) {
    return async (dispatch, getState) => {
        const url = "/auth/register"
        const headers = { "Content-Type": "application/json" }
        dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

        await axios.post(url, { ...formValues, }, { headers })
            .then(function (response) {
                console.log(response);
                callback(response)
                dispatch(slice.actions.updateRegisterEmail({ email: formValues.email, otp: response.data.otp }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
                dispatch(showSnackbar({ severity: "success", message: response.data.message }));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({ severity: "error", message: error.message }));
                dispatch(slice.actions.updateIsLoading({ error: true, isLoading: false }));
            })
        //bu email gelerse gecerlidi biz ozumuz resetpassworddaki kimi ediirik deye bunu kaldirdim
        // .finally(() => {
        //     if (!getState().auth.error) {
        //         window.location.href = "/auth/verify";
        //     }
        // });
    };
}

export function VerifyEmail(formValues, callback) {
    return async (dispatch, getState) => {
        const url = "/auth/verify"
        const headers = { "Content-Type": "application/json" }
        await axios.post(url, { ...formValues, }, { headers })
            .then(function (response) {
                callback(response)

                dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
                console.log({ response, where: "inside authreducer" });
                dispatch(slice.actions.updateRegisterEmail({ email: "", otp: "" }));
                window.localStorage.setItem("user_id", response.data.user_id);
                // dispatch(slice.actions.logIn({ isLoggedIn: true, token: response.data.token, }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
                dispatch(showSnackbar({ severity: "success", message: response.data.message }));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({ severity: "error", message: error.message }));
                dispatch(slice.actions.updateIsLoading({ error: true, isLoading: false }));
            });
    };
}