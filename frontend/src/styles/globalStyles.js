export const centerBox = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginX: 'auto',
    p: 4,
    height: "100vh",
    overflowY: 'auto',
    scrollbarWidth: 'none', // Firefox
    '&::-webkit-scrollbar': {
        display: 'none',       // Chrome, Safari
    }
}

export const clickBox = {
    backgroundColor: 'secondary.light',
    borderRadius: 5,
    textDecoration: 'none',
    color: 'inherit',
    p: 4,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
        backgroundColor: 'primary.main',
        color: 'white'
    }
}

export const headerButton = {
    backgroundColor: '#f0f0f0',
    borderRadius: '50%',
    height: '50px',
    minWidth: '50px',
    width: '50px'
}

export const membersAccordionBox = {
    maxHeight: 200,
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
        display: 'none',
    }
}