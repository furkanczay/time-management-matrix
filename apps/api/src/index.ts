import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

// Import routes
import tasksRoutes from './routes/tasks'
import listsRoutes from './routes/lists'
import subtasksRoutes from './routes/subtasks'
import authRoutes from './routes/auth'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}))

// Routes
app.route('/api/tasks', tasksRoutes)
app.route('/api/lists', listsRoutes)
app.route('/api/subtasks', subtasksRoutes)
app.route('/api/auth', authRoutes)

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root route
app.get('/', (c) => {
  return c.json({ 
    message: 'Time Management Matrix API',
    version: '1.0.0',
    docs: '/health'
  })
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default {
  port: process.env.PORT || 3001,
  fetch: app.fetch,
}
