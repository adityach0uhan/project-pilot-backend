import GroupModel from '../schema/group.schema.js';
export const generateUniqueInviteCodes = async () => {
    const inviteCode = Math.floor(1000 + Math.random() * 9000).toString();
    const checkDuplicate = await GroupModel.findOne({ inviteCode });
    if (checkDuplicate) {
        return generateUniqueInviteCodes();
    }
    return inviteCode;
};
