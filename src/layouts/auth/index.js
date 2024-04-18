import React from "react";
import { Container, Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Logo from "../../assets/Images/logo.ico";

const AuthLayout = () => {
    //Yani eger log in olubsa asla Auth ogin sayfasini birdaha gormuyecek
    const isLoggedIn  = true

    if (isLoggedIn) {
      return <Navigate to={"/app"} />;
    }
    return (
        <>
            <Container sx={{ mt: 5 }} maxWidth="sm">
                <Stack spacing={5}>
                    <Stack sx={{ width: "100%" }} direction="column" alignItems={"center"}  >
                        <img style={{ height: 120, width: 120 }} src={Logo} alt="Logo" />
                    </Stack>
                    <Outlet />
                </Stack>
            </Container>
        </>
    );
};

export default AuthLayout;