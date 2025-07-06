import * as Yup from "yup";

export const inviteMemberSchema = Yup.object({
    mobile: Yup.string()
            .matches(/^09\d{9}$/, "شماره موبایل وارد شده معتبر نمی باشد")
            .required("شماره موبایل عضو جدید را وارد نمایید"),
    groupId: Yup.string().matches(/^[0-9a-fA-F]{24}$/).required()
})