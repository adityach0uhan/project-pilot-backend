import { Schema, Document, model } from 'mongoose';

export interface IMark extends Document {
    project: Schema.Types.ObjectId;
    score: number;
    teacher: Schema.Types.ObjectId;
    collegeId: string;
}

const markSchema = new Schema<IMark>(
    {
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
    },
    {
        timestamps: true
    }
);

const MarkModel = model<IMark>('Mark', markSchema);

export default MarkModel;
