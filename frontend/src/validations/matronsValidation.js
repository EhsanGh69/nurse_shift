import * as Yup from "yup";

export const inviteMemberSchema = Yup.object({
    firstName: Yup.string()
        .max(150, "طول نام باید کمتر از 150 کاراکتر باشد").min(3, "طول نام باید بیشتر از 3 کاراکتر باشد")
        .required("لطفا نام خود را وارد نمایید"),
    lastName: Yup.string()
        .max(150, "طول نام خانوادگی باید کمتر از 150 کاراکتر باشد").min(3, "طول نام خانوادگی باید بیشتر از 3 کاراکتر باشد")
        .required("لطفا نام خانوادگی خود را وارد نمایید"),
    mobile: Yup.string()
        .matches(/^09\d{9}$/, "شماره موبایل وارد شده معتبر نمی باشد")
        .required("شماره موبایل عضو جدید را وارد نمایید"),
    groupId: Yup.string().matches(/^[0-9a-fA-F]{24}$/).required()
})

export const createGroupSchema = Yup.object({
    province: Yup.string().required("لطفا استان خود را انتخاب نمایید"),
    county: Yup.string().required("لطفا شهرستان خود را انتخاب نمایید"),
    hospital: Yup.string().required("لطفا نام بیمارستان خود را وارد نمایید"),
    department: Yup.string().required("لطفا نام بخش خود را وارد نمایید")
})