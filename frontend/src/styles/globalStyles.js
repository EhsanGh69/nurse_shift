

export const centerBox = {
    // minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginX: 'auto',
    marginY: 8,
    p: 2,
    width: 400, height: 800, border: '1px solid black'
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