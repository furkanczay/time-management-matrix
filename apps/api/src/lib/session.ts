import { Context, Next } from 'hono'
import { auth } from './auth'
import { Variables } from '../types'

export async function getSession(c: Context) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    })
    return session
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

export async function requireAuth(c: Context<{ Variables: Variables }>, next: Next) {
  const session = await getSession(c)
  
  if (!session?.session || !session?.user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  // Add user info to context
  c.set('user', session.user as Variables['user'])
  c.set('session', session.session as Variables['session'])
  
  await next()
}
