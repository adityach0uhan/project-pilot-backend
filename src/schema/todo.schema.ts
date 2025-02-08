import { Schema, model } from 'mongoose';

export interface ITodo {
    task: string;
    isCompleted: boolean;
    createrId: Schema.Types.ObjectId;
}

const todoSchema = new Schema<ITodo>({
    task: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    createrId: { type: Schema.Types.ObjectId, ref: 'Teacher' }
});

const TodoModel = model<ITodo>('Todo', todoSchema);
