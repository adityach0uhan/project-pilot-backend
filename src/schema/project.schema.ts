import { Schema, model, Document } from 'mongoose';
import { IStudent } from './student.schema.js'; // reference to student

export interface IProject extends Document {
    projectName: string;
    description: string;
    semester: string;
    createdBy: Schema.Types.ObjectId; // Reference to student who created the project
    groupId: Schema.Types.ObjectId; // Reference to group
    status: string; // "pending", "submitted", "graded"
    grade?: string; // Marks or grade given by teacher
    presentationUrl?: string; // URL for the presentation submission
    documentUrl?: string; // URL for the document submission
    synopsisUrl?: string; // URL for the synopsis submission
    teacherRemarks?: string; // Teacher's feedback/remarks
    branch: string; // Branch of the students
    collegeId: string; // Linked to College (this identifies the tenant)
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
            enum: ['pending', 'submitted', 'graded'],
            default: 'pending'
        }, // Default status
        grade: { type: String, required: false },
        presentationUrl: { type: String, required: false },
        documentUrl: { type: String, required: false },
        synopsisUrl: { type: String, required: false },
        teacherRemarks: { type: String, required: false },
        branch: { type: String, required: true },
        semester: { type: String, required: true }
    },
    { timestamps: true }
);

const ProjectModel = model<IProject>('Project', projectSchema);

export default ProjectModel;
