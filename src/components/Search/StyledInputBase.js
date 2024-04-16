import { InputBase, styled } from "@mui/material";

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        width: '100%',
        paddingLeft: `1rem`,
    }
}))

export default StyledInputBase