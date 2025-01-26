import { Request, Response, NextFunction } from 'express';
import GroupModel from '../schema/group.schema.js';
import { generateUniqueInviteCodes } from '../utils/generateUniqueInviteCodes.js';
import StudentModel from '../schema/student.schema.js';

export const createNewGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            name,
            groupNumber,
            members,
            project,
            createdBy,
            groupleader,
            semester
        } = req.body;

        if (!name || !groupNumber || !createdBy || !groupleader) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const alreadyPartOfGroup: any = await StudentModel.findById({
            groupleader
        });
        if (alreadyPartOfGroup.teamId) {
            res.status(400).json({
                message: 'User is already part of a group'
            });
            return;
        }

        const newInviteCode = await generateUniqueInviteCodes();

        const newGroup = new GroupModel({
            name,
            groupNumber,
            members,
            project,
            createdBy,
            inviteCode: newInviteCode,
            groupleader,
            semester
        });

        await newGroup.save();

        res.status(201).json({ message: 'Group created successfully' });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const joinGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { inviteCode } = req.params;
        const { userId } = req.body;

        const group = await GroupModel.findOne({ inviteCode });

        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }

        if (group.members.includes(userId)) {
            res.status(400).json({
                message: 'User is already a member of this group'
            });
            return;
        }

        group.members.push(userId);
        await group.save();

        res.status(200).json({ message: 'User joined group successfully' });
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

        const group = await GroupModel.findOne({ members: userId })
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

        res.status(200).json({ group });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
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
