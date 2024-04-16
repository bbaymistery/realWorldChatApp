import { alpha, styled } from "@mui/material";

 const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: 15,
    backgroundColor: alpha(theme.palette.mode === "light" ? "#fff" : "#161C24", 1),
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    boxShadow:" rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
}))

export default Search;