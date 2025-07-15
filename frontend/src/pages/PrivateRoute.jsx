import { useEffect, useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

import { useCurrentUser } from '../api/auth.api';
import handleApiErrors from '../utils/apiErrors';
import SnackAlert from '../components/SnackAlert';
import LoadingModal from '../components/LoadingModal';

export default function PrivateRoute() {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' })
    const [allowRender, setAllowRender] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { isLoading, isError, error, data } = useCurrentUser()

    useEffect(() => {
        if (!isLoading && !data && isError) {
            const status = error?.response?.status
            if (status === 401 || status === 403)
                navigate('/login', { 
                    state: { errorMessage: handleApiErrors(error), from: location }, 
                    replace: true 
                })
            else if (!error.response || status === 500)
                navigate('/', { state: { errorMessage: handleApiErrors(error) }, replace: true })
            else
                setSnackbar({ open: true, message: handleApiErrors(error), severity: 'error' })
        } else {
            setAllowRender(true)
        }
    }, [isLoading, isError, data, navigate, location])

    useEffect(() => {
        if (!isLoading && data) {
            const isNotNurse = data.role !== 'NURSE' && location.pathname.includes('/nurse')
            const isNurse = data.role === 'NURSE' && location.pathname.includes('/matron')
            if (isNotNurse) navigate('/matron')
            if (isNurse) navigate('/nurse')
        }
    }, [data, isLoading])

    return allowRender
        ? (
            <>
                <LoadingModal open={isLoading} message="در حال دریافت اطلاعات ..." />
                <SnackAlert snackbar={snackbar} setSnackbar={setSnackbar} />
                <Outlet />
            </>
        )
        : null
}