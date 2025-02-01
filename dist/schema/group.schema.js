import { Schema, model } from 'mongoose';
const groupSchema = new Schema({
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
}, { timestamps: true });
const GroupModel = model('Group', groupSchema);
export default GroupModel;
