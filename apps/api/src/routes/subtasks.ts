import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { createSubtask, getSubtasks, updateSubtask, deleteSubtask } from '../lib/api/subtasks'

const app = new Hono()

// Validation schemas
const createSubtaskSchema = z.object({
  title: z.string().min(1),
  todoId: z.string(),
  isCompleted: z.boolean().optional().default(false),
})

const updateSubtaskSchema = z.object({
  title: z.string().min(1).optional(),
  isCompleted: z.boolean().optional(),
})

const querySchema = z.object({
  todoId: z.string().optional(),
})

// GET /api/subtasks
app.get('/', zValidator('query', querySchema), async (c) => {
  try {
    const { todoId } = c.req.valid('query')
    const subtasks = await getSubtasks(todoId)
    
    return c.json({
      success: true,
      data: subtasks,
    })
  } catch (error) {
    console.error('Error fetching subtasks:', error)
    return c.json(
      { success: false, error: 'Internal server error' },
      500
    )
  }
})

// POST /api/subtasks
app.post('/', zValidator('json', createSubtaskSchema), async (c) => {
  try {
    const body = c.req.valid('json')
    
    const subtask = await createSubtask(body)

    return c.json({
      success: true,
      data: subtask,
    }, 201)
  } catch (error) {
    console.error('Error creating subtask:', error)
    return c.json(
      { success: false, error: 'Failed to create subtask' },
      500
    )
  }
})

// PUT /api/subtasks/:id
app.put('/:id', zValidator('json', updateSubtaskSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const body = c.req.valid('json')
    
    const subtask = await updateSubtask(id, body)

    return c.json({
      success: true,
      data: subtask,
    })
  } catch (error) {
    console.error('Error updating subtask:', error)
    return c.json(
      { success: false, error: 'Failed to update subtask' },
      500
    )
  }
})

// DELETE /api/subtasks/:id
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await deleteSubtask(id)

    return c.json({
      success: true,
      message: 'Subtask deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting subtask:', error)
    return c.json(
      { success: false, error: 'Failed to delete subtask' },
      500
    )
  }
})

export default app
