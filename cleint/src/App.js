import Router from "./routes";
import ThemeProvider from './theme';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ThemeSettings from './components/settings';
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { closeSnackBar } from "./redux/slices/app";
import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:3001",{
  query: { user_id: "662ac2df1d3d69c4ed9b6d19" }
});

const vertical = "bottom";
const horizontal = "center";

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />)

function App() {
  const dispatch = useDispatch();
  const { severity = "", message, open } = useSelector((state) => state.app.snackbar);
  useEffect(() => {
    // Setting up listeners for different socket events
    socket.on("new_friend_request", data => {
      console.log("Received a new friend request:", data);
      // You can dispatch some action here to show notification or handle this event
    });

    // Cleanup on component unmount
    return () => {
      socket.off("new_friend_request");
    };
  }, []);

  return (
    <>
      <ThemeProvider>
        <ThemeSettings>
          <Router />
        </ThemeSettings>
      </ThemeProvider>

      {message && open ? (
        <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={4000} key={vertical + horizontal} onClose={() => { dispatch(closeSnackBar()); }}>
          <Alert onClose={() => { dispatch(closeSnackBar()); }} severity={severity} sx={{ width: "100%" }} >
            {message}
          </Alert>
        </Snackbar>
      ) : (<></>)}
    </>
  );
}

export default App;
