import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

import LoadingModal from '../components/LoadingModal';
import SnackAlert from '../components/SnackAlert';
import { useCurrentUser } from '../api/auth.api';
import handleApiErrors from '../utils/apiErrors';

export default function BaseRoute({ children }) {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' })
    const [showLoading, setShowLoading] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { isLoading, isError, error, data } = useCurrentUser()
    const errorMessage = location.state?.errorMessage || ''

    useEffect(() => {
        if(errorMessage) {
            setSnackbar({ open: true, message: errorMessage, severity: 'error' })
            window.history.replaceState({}, document.title)
        }
    }, [location.state])

    useEffect(() => {
        if (!isLoading && data) {
            if(data.role === 'ADMIN')
                navigate('/matron', { replace: true })
            if(data.role === 'MATRON')
                navigate('/matron', { replace: true })
            else
                navigate('/nurse', { replace: true })
        }
            
        else if(isError && (!error.response || error?.response?.status === 500)){
            setShowLoading(true)
            setSnackbar({ open: true, message: handleApiErrors(error), severity: 'error' })
        }
        else
            setShowLoading(false)   
    }, [isLoading, data, error, isError])

    return (
        <>
            <LoadingModal open={showLoading} message="در حال برقراری ارتباط ..." />
            <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
            {children}
        </>
    )
}