export const centerBox = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginX: 'auto',
    marginY: 5,
    p: 2,
    width: 400,
    height: 800,
    border: '1px solid black',
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
    p: 3,
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
    width: '50px',
    mt: 2
}