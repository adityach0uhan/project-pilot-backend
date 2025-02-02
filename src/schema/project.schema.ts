import { Schema, model, Document } from 'mongoose';
import { IStudent } from './student.schema.js'; // reference to student

export interface IProject extends Document {
    projectName: string;
    description: string;
    semester: string;
    createdBy: Schema.Types.ObjectId;
    groupId: Schema.Types.ObjectId;
    groupNumber: string;
    status: string;
    grade?: string;
    presentationUrl?: string;
    documentUrl?: string;
    synopsisUrl?: string;
    teacherRemarks?: string;
    branch: string;
    collegeId: string;
}

const projectSchema = new Schema<IProject>(
    {
        collegeId: { type: String, required: true },
        projectName: { type: String, required: true },
        description: { type: String, required: true },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        }, // Reference to student
        groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true }, // Reference to group
        status: {
            type: String,
            default: 'Started'
        },
        grade: { type: String, required: false },
        presentationUrl: { type: String, required: false },
        documentUrl: { type: String, required: false },
        synopsisUrl: { type: String, required: false },
        teacherRemarks: { type: String, required: false },
        branch: { type: String, required: true },
        semester: { type: String, required: true },
        groupNumber: { type: String, required: true }
    },
    { timestamps: true }
);

const ProjectModel = model<IProject>('Project', projectSchema);

export default ProjectModel;
