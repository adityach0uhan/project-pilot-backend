import mongoose from 'mongoose';
import GroupModel from '../schema/group.schema.js';
import { generateUniqueInviteCodes } from '../utils/generateUniqueInviteCodes.js';
import StudentModel from '../schema/student.schema.js';
export const createNewGroup = async (req, res, next) => {
    try {
        const { name, currentUser, groupNumber, members, createdBy, groupleader, semester, collegeId } = req.body;
        if (!name || !groupNumber || !groupleader || !semester || !collegeId) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        if (!mongoose.isValidObjectId(createdBy) ||
            !mongoose.isValidObjectId(groupleader)) {
            res.status(400).json({
                message: 'Invalid createdBy or groupleader ID'
            });
            return;
        }
        const isAlreadyInGroup = await GroupModel.findOne({
            members: { $in: [createdBy] }
        });
        if (isAlreadyInGroup) {
            res.status(200).json({
                success: false,
                message: 'User is already a member of a group'
            });
            return;
        }
        const newInviteCode = await generateUniqueInviteCodes();
        const newGroup = new GroupModel({
            name,
            groupNumber,
            members,
            projectId: null,
            createdBy,
            inviteCode: newInviteCode,
            groupleader,
            semester,
            collegeId
        });
        await newGroup.save();
        const updateSudentTeamId = await StudentModel.findByIdAndUpdate(newGroup.groupleader, { teamId: newGroup._id });
        res.status(201).json({
            message: 'Group created successfully',
            group: newGroup
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const requestToJoinGroup = async (req, res, next) => {
    try {
        const { collegeId, inviteCode } = req.params;
        const { userId } = req.body;
        const group = await GroupModel.find({ inviteCode });
        if (!group) {
            res.status(404).json({
                success: false,
                message: 'Group not found'
            });
            return;
        }
        if (group.members.includes(userId)) {
            res.status(200).json({
                message: 'User is already a member of this group',
                success: false
            });
            return;
        }
        if (group.pendingRequests?.includes(userId)) {
            res.status(200).json({
                message: 'User has already requested to join this group',
                success: true
            });
            return;
        }
        group.pendingRequests.push(userId);
        await group.save();
        res.status(200).json({
            message: 'Request to join group submitted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const makeGroupRequestAcceptOrReject = async (req, res, next) => {
    try {
        const { userId, action, currentUserId, groupID } = req.body;
        if (!userId || !action || !currentUserId || !groupID) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const group = await GroupModel.findById(groupID);
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        // Ensure the current user is the group leader
        if (group.groupleader.toString() !== currentUserId) {
            res.status(403).json({
                message: 'Only the group leader can manage requests',
                success: false
            });
            return;
        }
        // Check if the user is in the pending requests
        if (!group.pendingRequests.includes(userId)) {
            res.status(400).json({
                message: 'No user request found in pending list ',
                success: false
            });
            return;
        }
        if (action === 'accept') {
            // Add user to members
            if (group.members.includes(userId)) {
                res.status(400).json({
                    message: 'User is already a member of this group'
                });
                return;
            }
            group.members.push(userId);
            // Remove user from pending requests
            group.pendingRequests = group.pendingRequests.filter((requestId) => requestId.toString() !== userId);
            // Update student's teamId
            await StudentModel.findByIdAndUpdate(userId, { teamId: groupID });
            await group.save();
            res.status(200).json({
                message: 'User added to the group successfully'
            });
        }
        else if (action === 'reject') {
            // Remove user from pending requests without adding to members
            group.pendingRequests = group.pendingRequests.filter((requestId) => requestId.toString() !== userId);
            await group.save();
            res.status(200).json({
                message: 'User request rejected successfully'
            });
        }
        else {
            res.status(400).json({ message: 'Invalid action' });
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const getGroupInfo = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const groupInfo = await StudentModel.findById(userId);
        const group = await GroupModel.findOne({ _id: groupInfo.teamId })
            .select('name groupNumber project inviteCode semester createdAt updatedAt')
            .populate({
            path: 'members',
            select: 'email name'
        })
            .populate({
            path: 'createdBy',
            select: 'name'
        })
            .populate({
            path: 'groupleader',
            select: 'name'
        })
            .populate({
            path: 'pendingRequests',
            select: 'name email'
        });
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        res.status(200).json({ groupData: group, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            success: false
        });
    }
};
export const getAllGroups = async (req, res, next) => {
    try {
        const { semester, collegeId } = req.body;
        const groups = await GroupModel.find({ semester, collegeId }).select('name groupNumber project inviteCode semester createdAt updatedAt');
        if (!groups) {
            res.status(404).json({ message: 'No groups found' });
            return;
        }
        res.status(200).json({ groups });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const getGroup = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const group = await GroupModel.findById({ _id: teamId });
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        res.status(200).json({ group });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
// export const updateGroup = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const { groupId } = req.params;
//         const { name, groupNumber, project, semester } = req.body;
//         //TODO: Add check if the user is the group leader or the creator of the group
//         const group = await GroupModel.findById(
//             { _id: groupId },
//             { new: true }
//         );
//         if (!group) {
//             res.status(404).json({ message: 'Group not found' });
//             return;
//         }
//         // group.name = name || group.name;
//         // group.groupNumber = groupNumber || group.groupNumber;
//         // group.project = project || group.project;
//         // group.semester = semester || group.semester;
//         await group.save();
//         res.status(200).json({ message: 'Group updated successfully', group });
//     } catch (error: any) {
//         res.status(500).json({
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// };
// export const deleteGroup = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const { groupId } = req.params;
//         //TODO: Add check if the user is the group leader or the creator of the group
//         const group = await GroupModel.findByIdAndDelete({ _id: groupId });
//         if (!group) {
//             res.status(404).json({ message: 'Group not found' });
//             return;
//         }
//         res.status(200).json({ message: 'Group deleted successfully' });
//     } catch (error: any) {
//         res.status(500).json({
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// };
export const kickMember = async (req, res, next) => {
    try {
        const { groupId, memberId } = req.params;
        //TODO: Add check if the user is the group leader or the creator of the group
        const group = await GroupModel.findByIdAndUpdate(groupId, {
            $pull: { members: memberId }
        }, { new: true });
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        else {
            res.status(200).json({
                message: 'Member kicked from group successfully',
                group
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
