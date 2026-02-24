import { Hono } from 'hono';
import { Sentence } from '../models/Sentence.js';
const sentencesRouter = new Hono();
// GET all sentences
sentencesRouter.get('/', async (c) => {
    try {
        const sentences = await Sentence.find()
            .populate('relatedWords')
            .sort({ createdAt: -1 });
        return c.json(sentences);
    }
    catch (error) {
        return c.json({ error: 'Failed to fetch sentences' }, 500);
    }
});
// GET single sentence
sentencesRouter.get('/:id', async (c) => {
    try {
        const sentence = await Sentence.findById(c.req.param('id')).populate('relatedWords');
        if (!sentence)
            return c.json({ error: 'Sentence not found' }, 404);
        return c.json(sentence);
    }
    catch (error) {
        return c.json({ error: 'Invalid ID' }, 400);
    }
});
// CREATE sentence
// sentencesRouter.post('/', async (c) => {
//     try {
//         const body = await c.req.json();
//         const newSentence = await Sentence.create(body);
//         return c.json(newSentence, 201);
//     } catch (error) {
//         return c.json({ error: 'Failed to create sentence' }, 500);
//     }
// })
// UPDATE sentence
// sentencesRouter.put('/:id', async (c) => {
//     try {
//         const body = await c.req.json();
//         const updatedSentence = await Sentence.findByIdAndUpdate(c.req.param('id'), body, { new: true });
//         if (!updatedSentence) return c.json({ error: 'Sentence not found' }, 404);
//         return c.json(updatedSentence);
//     } catch (error) {
//         return c.json({ error: 'Failed to update sentence' }, 500);
//     }
// })
// // DELETE sentence
// sentencesRouter.delete('/:id', async (c) => {
//     try {
//         const deletedSentence = await Sentence.findByIdAndDelete(c.req.param('id'));
//         if (!deletedSentence) return c.json({ error: 'Sentence not found' }, 404);
//         return c.json({ message: 'Sentence deleted successfully' });
//     } catch (error) {
//         return c.json({ error: 'Failed to delete sentence' }, 500);
//     }
// })
export { sentencesRouter };
