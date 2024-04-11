import { alpha, Badge, InputBase, styled } from "@mui/material"

export const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: 15,
    backgroundColor: alpha(theme.palette.mode === "light" ? "#fff" : "#161C24", 1),
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    boxShadow:" rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
}))
export const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    position: "absolute",
    height: '100%',
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}))
export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        width: '100%',
        paddingLeft: `1rem`,
    }
}))




//Badge
export const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));