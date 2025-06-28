const crypto = require('crypto');

const activationCodeModel = require('../auth/activationCode.model');
const { sendActivationEmail } = require('./emailService');

const generateActivationCode = async (user, res, emailType) => {
    const code = crypto.randomInt(100000, 999999).toString()

    await activationCodeModel.create({
        code,
        userId: user._id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min
    })

    if(emailType === 'activate')
        await sendActivationEmail(user.email, code, 'کد فعال‌سازی حساب کاربری')
    else
        await sendActivationEmail(user.email, code, 'کد فراموشی رمز عبور')

    res.cookie("user-email", user.email, { httpOnly: true })
}

module.exports = generateActivationCode;