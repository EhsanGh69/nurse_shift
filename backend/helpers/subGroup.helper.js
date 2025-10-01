const AppError = require('./appError')

exports.updateSubgroupChecker = async (groupModel, subGroupModel, resData) => {
    const { userId, groupId, memberId, order } = resData;

    const group = String(userId) === String(memberId)
    ? await groupModel.findOne({ _id: groupId, matron: userId })
    : await groupModel.findOne({
        _id: groupId, 
        $and: [{ members: { $all: [memberId] } }, { matron: userId  }]
    })
    if(!group) throw new AppError("Group not found!", 404)
    
    const subGroups = await subGroupModel.findOne({ group: groupId })
    if(!subGroups) throw new AppError("Subgroup not found!", 404)

    const subGroup = subGroups.subs.find(sub => sub.order === order)
    if(!subGroup) throw new AppError("Subgroup order not found!", 404)

    return { subGroups, subGroup }
}