import * as Yup from 'yup';

export const changePasswordSchema = Yup.object({
    oldPassword: Yup.string().required("لطفا رمز عبور کنونی خود را وارد نمایید"),
    newPassword: Yup.string()
        .matches(/^(?=.*[a-zA-Z0-9]).{8,}$/, "رمز عبور باید حداقل 8 کاراکتر و شامل حروف یا اعداد انگلیسی باشد")
        .required("لطفا رمز عبور جدید خود را وارد نمایید")
})