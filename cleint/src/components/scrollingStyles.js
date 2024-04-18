export const scrollingStyles = {
    '&::-webkit-scrollbar': {
        width: '4px',  // Width of the scrollbar
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent', // Color of the scrollbar track
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#555', // Color of the scrollbar thumb
        borderRadius: '4px', // Border radius of the scrollbar thumb
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#888', // Color of the scrollbar thumb on hover
    },
    overflowX: 'hidden',
    overflowY: "scroll"
}