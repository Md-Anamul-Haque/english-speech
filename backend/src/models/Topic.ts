import mongoose, { Schema } from 'mongoose';
import type { ITopic } from '../types/index.js';

const topicSchema = new Schema<ITopic>({
    level: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    words: [{
        type: Schema.Types.ObjectId,
        ref: 'Word',
    }],
    sentences: [{
        type: Schema.Types.ObjectId,
        ref: 'Sentence',
    }],
}, {
    timestamps: true,
});

export const Topic = mongoose.model<ITopic>('Topic', topicSchema);
