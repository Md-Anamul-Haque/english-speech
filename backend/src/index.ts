import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { connectDB } from './config/db.js'

// Initialize DB Connection
connectDB();

const app = new Hono()

// Middleware
app.use('*', cors())

// Basic Route
app.get('/', (c) => {
  return c.text('Hello Hono! English Speech API is running.')
})

import { wordsRouter } from './routes/words.js'
import { sentencesRouter } from './routes/sentences.js'
import { topicsRouter } from './routes/topics.js'

// Mock User API placeholder
app.get('/api/users', (c) => {
  return c.json([
    { id: 1, name: 'Alice', role: 'student' },
    { id: 2, name: 'Bob', role: 'admin' }
  ])
})

// Register Routes
app.route('/api/words', wordsRouter);
app.route('/api/sentences', sentencesRouter);
app.route('/api/topics', topicsRouter);


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
