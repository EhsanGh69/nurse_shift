const handleApiErrors = (error, options = {}) => {
    const status = error?.status
    const data = error?.response?.data
    const fallback = options.fallback || '❌ خطایی رخ داد'
    
    if(data?.message) return data.message

    if(!error.response) {
        console.log(error)
        return 'خطا در برقرای ارتباط، لطفا بعدا تلاش کنید'
    }

    switch (status) {
        case 400 || 422 || 409:
            return 'درخواست نامعتبر بود'
        case 401:
            return 'لطفا مجددا وارد شوید'
        case 403:
            return 'دسترسی غیرمجاز'
        case 404:
            return 'موردی یافت نشد'
        case 500 || 504:
            return 'خطای سرور، لطفا با پشتیبانی تماس بگیرید'
        default:
            fallback
    }
}

export default handleApiErrors;