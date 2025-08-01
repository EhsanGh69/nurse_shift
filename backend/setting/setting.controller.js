const settingModel = require("./setting.model");


exports.getSettings = async (req, res) => {
    const userId = req.user.id
    
    let settings = await settingModel.findOne({ user: userId }).select("-__v -_id")
    
    if(!settings)
        settings = await settingModel.create({ user: userId })

    res.json(settings)
}

exports.changeSettings = async (req, res) => {
    const userId = req.user.id
    const { fontFamily, fontSize, themeMode } = req.body

    await settingModel.findOneAndUpdate({ user: userId }, {
        fontFamily, fontSize, themeMode
    })

    res.json({ message: "App settings changed successfully" })
}

exports.changeTheme = async (req, res) => {
    const userId = req.user.id

    const settings = await settingModel.findOne({ user: userId })

    if(settings.themeMode === 'light')
        settings.themeMode = 'dark'
    else
        settings.themeMode = 'light'

    await settings.save()

    res.json({ message: "App theme changed successfully" })
}
