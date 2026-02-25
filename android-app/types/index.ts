export type MongoId = string | { $oid: string };
export type MongoDate = string | Date | { $date: string };

export interface IWord {
    _id?: MongoId;
    english: string;
    bangla: string;
    pronunciation?: string;
    partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'adverb' | 'conjunction' | 'preposition';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    audioUrl?: string;
    createdAt?: MongoDate;
    updatedAt?: MongoDate;
}

export interface ISentence {
    _id?: MongoId;
    english: string;
    bangla: string;
    context: string;
    contextColor: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    relatedWords?: MongoId[];
    feedback: string | null;
    createdAt?: MongoDate;
    updatedAt?: MongoDate;
}

export interface ITopic {
    _id?: MongoId;
    level: number;
    title: string;
    slug: string;
    description: string;
    words: MongoId[] | IWord[];
    sentences: MongoId[] | ISentence[];
    createdAt?: MongoDate;
    updatedAt?: MongoDate;
}
