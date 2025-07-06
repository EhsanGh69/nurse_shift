import * as Yup from 'yup';

export const changePasswordSchema = Yup.object({
    oldPassword: Yup.string().required("لطفا رمز عبور کنونی خود را وارد نمایید"),
    newPassword: Yup.string()
        .matches(/^(?=.*[a-zA-Z0-9]).{8,}$/, "رمز عبور باید حداقل 8 کاراکتر و شامل حروف یا اعداد انگلیسی باشد")
        .required("لطفا رمز عبور جدید خود را وارد نمایید")
})

export const editAccountSchema = Yup.object({
    firstName: Yup.string().required("لطفا نام خود را وارد نمایید"),
    lastName: Yup.string().required("لطفا نام خانوادگی خود را وارد نمایید"),
    mobile: Yup.string()
        .matches(/^09\d{9}$/, "موبایل وارد شده معتبر نمی باشد")
        .required("لطفا شماره موبایل خود را وارد نمایید"),
    avatar: Yup.mixed().nullable()
})