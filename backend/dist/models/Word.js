import mongoose, { Schema } from 'mongoose';
const wordSchema = new Schema({
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
    pronunciation: {
        type: String,
        trim: true,
    },
    partOfSpeech: {
        type: String,
        enum: ['noun', 'verb', 'adjective', 'adverb', 'conjunction', 'preposition'],
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
    },
    audioUrl: {
        type: String,
    }
}, {
    timestamps: true,
});
export const Word = mongoose.model('Word', wordSchema);
