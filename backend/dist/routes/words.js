import { Hono } from 'hono';
import { Word } from '../models/Word.js';
const wordsRouter = new Hono();
// GET all words
wordsRouter.get('/', async (c) => {
    try {
        const words = await Word.find().sort({ createdAt: -1 });
        return c.json(words);
    }
    catch (error) {
        return c.json({ error: 'Failed to fetch words' }, 500);
    }
});
// GET single word
wordsRouter.get('/:id', async (c) => {
    try {
        const word = await Word.findById(c.req.param('id'));
        if (!word)
            return c.json({ error: 'Word not found' }, 404);
        return c.json(word);
    }
    catch (error) {
        return c.json({ error: 'Invalid ID' }, 400);
    }
});
// CREATE word
// wordsRouter.post('/', async (c) => {
//     try {
//         const body = await c.req.json();
//         const newWord = await Word.create(body);
//         return c.json(newWord, 201);
//     } catch (error) {
//         return c.json({ error: 'Failed to create word' }, 500);
//     }
// })
// // UPDATE word
// wordsRouter.put('/:id', async (c) => {
//     try {
//         const body = await c.req.json();
//         const updatedWord = await Word.findByIdAndUpdate(c.req.param('id'), body, { new: true });
//         if (!updatedWord) return c.json({ error: 'Word not found' }, 404);
//         return c.json(updatedWord);
//     } catch (error) {
//         return c.json({ error: 'Failed to update word' }, 500);
//     }
// })
// // DELETE word
// wordsRouter.delete('/:id', async (c) => {
//     try {
//         const deletedWord = await Word.findByIdAndDelete(c.req.param('id'));
//         if (!deletedWord) return c.json({ error: 'Word not found' }, 404);
//         return c.json({ message: 'Word deleted successfully' });
//     } catch (error) {
//         return c.json({ error: 'Failed to delete word' }, 500);
//     }
// })
export { wordsRouter };
