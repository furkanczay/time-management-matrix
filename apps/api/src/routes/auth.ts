import { Hono } from 'hono'
import { auth } from '../lib/auth'

const app = new Hono()

// Better Auth handler - handles all auth endpoints
app.all('/*', async (c) => {
  return auth.handler(c.req.raw)
})

export default app
