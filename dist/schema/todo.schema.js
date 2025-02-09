import { Schema, model } from 'mongoose';
const todoSchema = new Schema({
    task: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    createrId: { type: Schema.Types.ObjectId, ref: 'Teacher' }
});
const TodoModel = model('Todo', todoSchema);
