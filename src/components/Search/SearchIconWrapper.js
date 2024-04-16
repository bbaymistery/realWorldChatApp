import { styled } from "@mui/material";

export const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    position: "absolute",
    height: '100%',
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}))