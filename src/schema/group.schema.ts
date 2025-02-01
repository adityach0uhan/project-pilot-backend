import { Schema, model, Document } from 'mongoose';
import { IStudent } from './student.schema.js'; // reference to student
import { IProject } from './project.schema.js'; // reference to project

export interface IGroup extends Document {
    name: string;
    groupNumber: string;
    collegeId: string;
    members: Schema.Types.ObjectId[];
    groupleader: Schema.Types.ObjectId;
    semester: string;
    projectId: Schema.Types.ObjectId;
    projectName: string;
    createdBy?: IStudent;
    pendingRequests?: IStudent[];
    inviteCode?: string;
}

const groupSchema = new Schema<IGroup>(
    {
        name: { type: String, required: true },
        groupNumber: { type: String, required: true },
        members: [
            { type: Schema.Types.ObjectId, ref: 'Student', required: false }
        ],
        groupleader: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: false
        },
        projectName: { type: String, required: false },
        semester: { type: String, required: true },
        collegeId: {
            type: String,
            ref: 'College',
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: false
        },
        pendingRequests: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Student',
                required: false
            }
        ],
        inviteCode: { type: String, required: false }
    },
    { timestamps: true }
);

const GroupModel = model<IGroup>('Group', groupSchema);

export default GroupModel;
