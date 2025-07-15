import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function BackButton({ backUrl }) {
    const navigate = useNavigate()

    const handleComeBack = () => {
        if(window.history.state && window.history.length > 1)
            navigate(backUrl)
        else
            navigate('/')
    }

    return (
        <Button
            fullWidth
            variant='contained'
            color='secondary'
            type='button'
            onClick={handleComeBack}
            sx={{ fontSize: 20 }}
        >
            بازگشت
        </Button>
    )
}
