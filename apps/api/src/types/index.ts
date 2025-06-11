import { Context } from 'hono'

export interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  token: string
  ipAddress?: string
  userAgent?: string
}

export interface Variables {
  user: User
  session: Session
}

export type AppContext = Context<{ Variables: Variables }>
