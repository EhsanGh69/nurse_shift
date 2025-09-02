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
    backgroundColor: 'secondary.main',
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

export const textFieldStyle = (isDark) => {
    return {
        "& .MuiInputBase-root": {
          backgroundColor: isDark ? "#2a2a2a" : "#ffffff",
          color: isDark ? "#e0e0e0" : "#000000",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: isDark ? "#555" : "#ccc",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: isDark ? "#888" : "#888",
        },
        "& .MuiInputLabel-root": {
          color: isDark ? "#aaa" : "#666",
        }
    }
}

export const modalBox = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center'
}