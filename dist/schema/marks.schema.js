import { Schema, model } from 'mongoose';
const markSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    score: { type: Number, required: false, default: 0 },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    }
}, {
    timestamps: true
});
const MarkModel = model('Mark', markSchema);
export default MarkModel;
