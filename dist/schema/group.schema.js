import { Schema, model } from 'mongoose';
const groupSchema = new Schema({
    name: { type: String, required: true },
    groupNumber: { type: String, required: true },
    members: [
        { type: Schema.Types.ObjectId, ref: 'Student', required: true }
    ],
    groupleader: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    projectName: { type: String, required: true },
    semester: { type: String, required: true },
    collegeId: {
        type: Schema.Types.ObjectId,
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
}, { timestamps: true });
const GroupModel = model('Group', groupSchema);
export default GroupModel;
