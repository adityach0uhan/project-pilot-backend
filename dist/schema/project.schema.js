import { Schema, model } from 'mongoose';
const projectSchema = new Schema({
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
}, { timestamps: true });
const ProjectModel = model('Project', projectSchema);
export default ProjectModel;
