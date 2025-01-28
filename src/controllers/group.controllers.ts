import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import GroupModel from '../schema/group.schema.js';
import { generateUniqueInviteCodes } from '../utils/generateUniqueInviteCodes.js';
import StudentModel from '../schema/student.schema.js';
export const createNewGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, groupNumber, members, createdBy, groupleader, semester } =
            req.body;

        if (!name || !groupNumber || !createdBy || !groupleader) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        if (
            !mongoose.isValidObjectId(createdBy) ||
            !mongoose.isValidObjectId(groupleader)
        ) {
            res.status(400).json({
                message: 'Invalid createdBy or groupleader ID'
            });
            return;
        }

        const newInviteCode = await generateUniqueInviteCodes();

        const newGroup = new GroupModel({
            name,
            groupNumber,
            members,
            project: null,
            createdBy,
            inviteCode: newInviteCode,
            groupleader,
            semester
        });

        await newGroup.save();

        const updateSudentTeamId = await StudentModel.findByIdAndUpdate(
            newGroup.groupleader,
            { teamId: newGroup._id }
        );

        res.status(201).json({
            message: 'Group created successfully',
            group: newGroup
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const requestToJoinGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { inviteCode } = req.params;
        const { userId } = req.body;

        const group: any = await GroupModel.findOne({ inviteCode });

        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }

        // Check if the user is already a member
        if (group.members.includes(userId)) {
            res.status(400).json({
                message: 'User is already a member of this group'
            });
            return;
        }

        // Check if the user has already requested to join
        if (group.pendingRequests?.includes(userId)) {
            res.status(400).json({
                message: 'User has already requested to join this group'
            });
            return;
        }

        group.pendingRequests.push(userId);
        await group.save();

        res.status(200).json({
            message: 'Request to join group submitted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const makeGroupRequestAcceptOrReject = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId, action, currentUserId, groupID }: any = req.body;

        // Validate required fields
        if (!userId || !action || !currentUserId || !groupID) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        // Find the group
        const group: any = await GroupModel.findById(groupID);

        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }

        // Ensure the current user is the group leader
        if (group.groupleader.toString() !== currentUserId) {
            res.status(403).json({
                message: 'Only the group leader can manage requests'
            });
            return;
        }

        // Check if the user is in the pending requests
        if (!group.pendingRequests.includes(userId)) {
            res.status(400).json({ message: 'User request not found' });
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
            group.pendingRequests = group.pendingRequests.filter(
                (requestId: any) => requestId.toString() !== userId
            );

            // Update student's teamId
            await StudentModel.findByIdAndUpdate(userId, { teamId: groupID });
            await group.save();

            res.status(200).json({
                message: 'User added to the group successfully'
            });
        } else if (action === 'reject') {
            // Remove user from pending requests without adding to members
            group.pendingRequests = group.pendingRequests.filter(
                (requestId: any) => requestId.toString() !== userId
            );
            await group.save();

            res.status(200).json({
                message: 'User request rejected successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getGroupInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.body;
        const groupInfo: any = await StudentModel.findById(userId);
        const group: any = await GroupModel.findOne({ _id: groupInfo.teamId })
            .select(
                'name groupNumber project inviteCode semester createdAt updatedAt'
            )
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
            });

        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }

        res.status(200).json({ groupData: group, success: true });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            success: false
        });
    }
};

export const getAllGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { semester } = req.body;
        const groups = await GroupModel.find({ semester }).select(
            'name groupNumber project inviteCode semester createdAt updatedAt'
        );

        if (!groups) {
            res.status(404).json({ message: 'No groups found' });
            return;
        }

        res.status(200).json({ groups });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { groupId } = req.params;

        const group = await GroupModel.findById({ _id: groupId });

        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }

        res.status(200).json({ group });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const updateGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { groupId } = req.params;
        const { name, groupNumber, project, semester } = req.body;
        //TODO: Add check if the user is the group leader or the creator of the group
        const group = await GroupModel.findById(
            { _id: groupId },
            { new: true }
        );

        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }

        group.name = name || group.name;
        group.groupNumber = groupNumber || group.groupNumber;
        group.project = project || group.project;
        group.semester = semester || group.semester;

        await group.save();

        res.status(200).json({ message: 'Group updated successfully', group });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const deleteGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { groupId } = req.params;
        //TODO: Add check if the user is the group leader or the creator of the group
        const group = await GroupModel.findByIdAndDelete({ _id: groupId });

        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const kickMember = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { groupId, memberId } = req.params;
        //TODO: Add check if the user is the group leader or the creator of the group
        const group = await GroupModel.findByIdAndUpdate(
            groupId,
            {
                $pull: { members: memberId }
            },
            { new: true }
        );

        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        } else {
            res.status(200).json({
                message: 'Member kicked from group successfully',
                group
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
