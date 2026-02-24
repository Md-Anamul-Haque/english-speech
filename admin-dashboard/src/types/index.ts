export interface IWord {
    _id?: string;
    english: string;
    bangla: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISentence {
    _id?: string;
    english: string;
    bangla: string;
    context: string;
    contextColor: string;
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
