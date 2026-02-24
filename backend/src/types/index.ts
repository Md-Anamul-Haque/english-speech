export interface IWord {
    _id?: string;
    english: string;
    bangla: string;
    pronunciation?: string; // Bengali transliteration for pronunciation
    partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'adverb' | 'conjunction' | 'preposition';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    audioUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISentence {
    _id?: string;
    english: string;
    bangla: string;
    context: string;
    contextColor: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    relatedWords?: string[];
    feedback: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITopic {
    _id?: string;
    level: number;
    title: string;
    slug: string;
    description: string;
    words: string[] | IWord[];
    sentences: string[] | ISentence[];
    createdAt?: Date;
    updatedAt?: Date;
}
