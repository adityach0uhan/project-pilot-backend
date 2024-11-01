import { Schema, model, Document } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    groupNumber: number;
    members: Schema.Types.ObjectId[];
    project: Schema.Types.ObjectId;
    createdBy: Schema.Types.ObjectId;
    inviteCode: string;
    groupleader: Schema.Types.ObjectId;
    createdAt?: Date;
    semester: number;
}

const groupSchema = new Schema<IGroup>(
    {
        name: { type: String, required: true },
        groupNumber: { type: Number, required: true },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Student',
                required: true
            }
        ],
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        inviteCode: { type: String, required: true },
        semester: { type: Number, required: true },
        groupleader: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        }
    },

    {
        timestamps: true
    }
);

const GroupModel = model<IGroup>('Group', groupSchema);

export default GroupModel;
