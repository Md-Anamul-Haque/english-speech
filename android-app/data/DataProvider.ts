import topicsData from './english-speech.topics.json';
import wordsData from './english-speech.words.json';
import sentencesData from './english-speech.sentences.json';
import { ITopic, IWord, ISentence, MongoId } from '../types';

/**
 * Helper to extract string ID from MongoId type
 */
const getId = (id: MongoId | undefined): string => {
    if (!id) return '';
    if (typeof id === 'string') return id;
    return id.$oid;
};

class DataProvider {
    private topics: ITopic[] = topicsData as any;
    private words: IWord[] = wordsData as any;
    private sentences: ISentence[] = sentencesData as any;

    private wordsMap: Map<string, IWord>;
    private sentencesMap: Map<string, ISentence>;

    constructor() {
        // Index words and sentences for O(1) lookup
        this.wordsMap = new Map();
        this.words.forEach(w => {
            this.wordsMap.set(getId(w._id), w);
        });

        this.sentencesMap = new Map();
        this.sentences.forEach(s => {
            this.sentencesMap.set(getId(s._id), s);
        });
    }

    getTopics(): ITopic[] {
        return this.topics;
    }

    getTopicBySlug(slug: string): ITopic | undefined {
        const topic = this.topics.find(t => t.slug === slug);
        if (!topic) return undefined;

        // Populate words and sentences
        return {
            ...topic,
            words: (topic.words as MongoId[]).map(id => this.wordsMap.get(getId(id))).filter(Boolean) as IWord[],
            sentences: (topic.sentences as MongoId[]).map(id => this.sentencesMap.get(getId(id))).filter(Boolean) as ISentence[]
        };
    }

    searchTopics(query: string): ITopic[] {
        const lowercaseQuery = query.toLowerCase();
        return this.topics.filter(t =>
            t.title.toLowerCase().includes(lowercaseQuery) ||
            t.description.toLowerCase().includes(lowercaseQuery)
        );
    }
}

export const dataProvider = new DataProvider();
