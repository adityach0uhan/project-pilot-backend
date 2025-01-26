import { Schema, model } from 'mongoose';
const projectSchema = new Schema({
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
    GroupNumber: { type: Number },
    status: {
        type: String,
        enum: ['Not Submitted', 'Submitted', 'Reviewed', 'Approved'],
        default: 'Not Submitted'
    }
}, {
    timestamps: true
});
const ProjectModel = model('Project', projectSchema);
export default ProjectModel;
