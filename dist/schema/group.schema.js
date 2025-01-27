import { Schema, model } from 'mongoose';
const groupSchema = new Schema({
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
        required: false,
        default: null
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
    },
    pendingRequests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ]
}, {
    timestamps: true
});
const GroupModel = model('Group', groupSchema);
export default GroupModel;
