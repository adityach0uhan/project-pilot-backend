import { Schema, model, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    projectType: string;
    projectStatus: string;
    Group: Schema.Types.ObjectId;
    GroupNumber?: number;
    leader?: Schema.Types.ObjectId;
    createdBy?: Schema.Types.ObjectId;
    createdAt?: Date;
    progress?: number;
    deadline?: Date;
    semester: number;
}

const projectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        projectType: { type: String, required: true },
        projectStatus: { type: String, required: true },
        leader: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        progress: { type: Number },
        deadline: { type: Date },
        semester: { type: Number },
        Group: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            required: true
        },
        GroupNumber: { type: Number }
    },

    {
        timestamps: true
    }
);

const ProjectModel = model<IProject>('Project', projectSchema);

export default ProjectModel;
