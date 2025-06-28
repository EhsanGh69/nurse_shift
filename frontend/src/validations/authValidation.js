import * as Yup from 'yup';


export const registerSchema = Yup.object({
    firstName: Yup.string()
        .max(150, "طول نام باید کمتر از 150 کاراکتر باشد").min(3, "طول نام باید بیشتر از 3 کاراکتر باشد")
        .required("لطفا نام خود را وارد نمایید"),
    lastName: Yup.string()
        .max(150, "طول نام خانوادگی باید کمتر از 150 کاراکتر باشد").min(3, "طول نام خانوادگی باید بیشتر از 3 کاراکتر باشد")
        .required("لطفا نام خانوادگی خود را وارد نمایید"),
    inviteCode: Yup.string().required("لطفا کد دعوت خود را وارد نمایید"),
    nationalCode: Yup.string()
        .matches(/^(?!^(\d)\1{9}$)\d{10}$/, "کد ملی وارد شده معتبر نمی باشد").required("لطفا کد ملی خود را وارد نمایید"),
    mobile: Yup.string()
        .matches(/^09\d{9}$/, "شماره موبایل وارد شده معتبر نمی باشد").required("لطفا شماره موبایل خود را وارد نمایید"),
    password: Yup.string()
        .matches(/^(?=.*[a-zA-Z0-9]).{8,}$/, "رمز عبور وارد شده معتبر نمی باشد")
        .required("لطفا رمز عبور خود را تعیین نمایید"),
    province: Yup.string().required("لطفا استان را انتخاب نمایید"),
    county: Yup.string().required("لطفا شهرستان را انتخاب نمایید")
})

export const loginSchema = Yup.object({
    nationalCode: Yup.string().required("لطفا کد ملی خود را وارد نمایید"),
    password: Yup.string().required("لطفا رمز عبور خود را تعیین نمایید"),
})