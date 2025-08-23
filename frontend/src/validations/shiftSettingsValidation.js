import * as Yup from 'yup';

export const personCountSchema = (keys=[]) => {
    const shape = Object.fromEntries(
        keys.map(key => [key, Yup.number().min(1).required()])
    )
    return Yup.object(shape)
}

export const hourCountSchema = (keys=[]) => {
    const shape = Object.fromEntries(
        keys.map(key => [key, Yup.number().min(1).max(24).required()])
    )
    return Yup.object(shape)
}

export const dayLimitSchema = Yup.number().min(1).max(30).required();