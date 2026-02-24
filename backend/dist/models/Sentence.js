import mongoose, { Schema } from 'mongoose';
const sentenceSchema = new Schema({
    english: {
        type: String,
        required: true,
        trim: true,
    },
    bangla: {
        type: String,
        required: true,
        trim: true,
    },
    context: {
        type: String,
        required: true,
        trim: true,
    },
    contextColor: {
        type: String,
        required: true,
        trim: true,
        default: "#3B82F6",
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
    },
    relatedWords: [{
            type: Schema.Types.ObjectId,
            ref: 'Word'
        }],
    feedback: {
        type: String,
        default: null,
    }
}, {
    timestamps: true,
});
export const Sentence = mongoose.model('Sentence', sentenceSchema);
