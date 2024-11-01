import { Request, Response, NextFunction } from 'express';
import GroupModel from '../schema/group.schema.js';
import { generateUniqueInviteCodes } from '../utils/generateUniqueInviteCodes.js';

export const createNewGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        });
    }
};
