import { Hono } from 'hono';
import { Topic } from '../models/Topic.js';
const topicsRouter = new Hono();
// GET all topics (list items for Home/Level selector)
topicsRouter.get('/', async (c) => {
    try {
        // Find all topics and sort by Level ascending (Level 1, then Level 2, etc.)
        const topics = await Topic.find().sort({ level: 1 });
        return c.json(topics);
    }
    catch (error) {
        return c.json({ error: 'Failed to fetch topics' }, 500);
    }
});
// GET single topic by slug (Dynamic Playground Data) - EAGERLY populated
topicsRouter.get('/:slug', async (c) => {
    try {
        const topic = await Topic.findOne({ slug: c.req.param('slug') })
            .populate('words')
            .populate({
            path: 'sentences',
            populate: { path: 'relatedWords' } // Deeply nested population to ensure sentences have words too
        });
        if (!topic)
            return c.json({ error: 'Topic not found' }, 404);
        return c.json(topic);
    }
    catch (error) {
        return c.json({ error: 'Invalid Slug' }, 400);
    }
});
// CREATE topic
// topicsRouter.post('/', async (c) => {
//     try {
//         const body = await c.req.json();
//         const newTopic = await Topic.create(body);
//         return c.json(newTopic, 201);
//     } catch (error) {
//         return c.json({ error: 'Failed to create topic' }, 500);
//     }
// })
// // UPDATE topic
// topicsRouter.put('/:id', async (c) => {
//     try {
//         const body = await c.req.json();
//         const updatedTopic = await Topic.findByIdAndUpdate(c.req.param('id'), body, { new: true });
//         if (!updatedTopic) return c.json({ error: 'Topic not found' }, 404);
//         return c.json(updatedTopic);
//     } catch (error) {
//         return c.json({ error: 'Failed to update topic' }, 500);
//     }
// })
// // DELETE topic
// topicsRouter.delete('/:id', async (c) => {
//     try {
//         const deletedTopic = await Topic.findByIdAndDelete(c.req.param('id'));
//         if (!deletedTopic) return c.json({ error: 'Topic not found' }, 404);
//         return c.json({ message: 'Topic deleted successfully' });
//     } catch (error) {
//         return c.json({ error: 'Failed to delete topic' }, 500);
//     }
// })
export { topicsRouter };
