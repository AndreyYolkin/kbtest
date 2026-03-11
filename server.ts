import { H3, eventHandler, readBody, getQuery } from 'h3'
import { toNodeHandler } from 'h3/node'
import { listen } from 'listhen'

const app = new H3()

// CORS Middleware
app.use(eventHandler((event) => {
  event.res.headers.set('Access-Control-Allow-Origin', '*')
  event.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  event.res.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  if (event.req.method === 'OPTIONS') {
    return 'OK'
  }
}))

// Data Models
interface Status {
  id: string
  title: string
  columnId: string // The "Status Group" (e.g., Backlog, InProgress, etc.)
}

interface Column {
  id: string
  title: string
}

interface Track {
  id: string
  name: string
  transitions: Record<string, string[]> // fromStatus -> [toStatus, ...]
}

interface Task {
  id: number
  title: string
  description: string
  trackId: string
  statusId: string
}

// In-Memory Database
const db = {
  columns: [
    { id: 'backlog', title: 'Backlog' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'tested', title: 'Tested' },
    { id: 'needs_attention', title: 'Needs Attention' }
  ] as Column[],
  
  statuses: [
    // Backlog Group
    { id: 'new', title: 'New', columnId: 'backlog' },
    { id: 'open', title: 'Open', columnId: 'backlog' },
    
    // In Progress Group
    { id: 'in_work', title: 'In Work', columnId: 'in_progress' },
    { id: 'needs_info', title: 'Needs Info', columnId: 'in_progress' },
    { id: 'ready_to_test', title: 'Ready to Test', columnId: 'in_progress' },
    { id: 'testing', title: 'Testing', columnId: 'in_progress' },
    { id: 'deployed', title: 'Deployed', columnId: 'in_progress' },
    
    // Tested Group
    { id: 'passed', title: 'Passed', columnId: 'tested' },
    
    // Needs Attention Group
    { id: 'blocked', title: 'Blocked', columnId: 'needs_attention' },
    { id: 'failed', title: 'Failed', columnId: 'needs_attention' }
  ] as Status[],

  tracks: [
    {
      id: 'bug',
      name: 'Bug',
      transitions: {
        'new': ['open', 'blocked'],
        'open': ['in_work', 'needs_info', 'blocked'],
        'in_work': ['ready_to_test', 'blocked'],
        'needs_info': ['open', 'in_work'],
        'ready_to_test': ['testing', 'failed'], // Can go to testing or failed (Needs Attention)
        'testing': ['passed', 'failed', 'in_work'],
        'failed': ['in_work'], // Back to work if failed
        'passed': ['deployed'],
        'deployed': [],
        'blocked': ['open']
      }
    },
    {
      id: 'feature',
      name: 'Feature',
      transitions: {
        'new': ['open'],
        'open': ['in_work', 'needs_info'],
        'in_work': ['ready_to_test', 'blocked'],
        'needs_info': ['open', 'in_work'],
        'ready_to_test': ['testing'], // Must go to testing
        'testing': ['passed', 'failed'],
        'failed': ['in_work'],
        'passed': ['deployed'],
        'deployed': [],
        'blocked': ['open']
      }
    }
  ] as Track[],

  tasks: [
    {
      id: 1,
      title: 'Fix login bug',
      description: 'User cannot login with valid credentials',
      trackId: 'bug',
      statusId: 'new'
    },
    {
      id: 2,
      title: 'Add dark mode',
      description: 'Implement dark mode toggle',
      trackId: 'feature',
      statusId: 'in_work'
    },
    {
      id: 3,
      title: 'Update dependencies',
      description: 'Upgrade Vue to latest version',
      trackId: 'feature',
      statusId: 'deployed'
    }
  ] as Task[]
}

// API Routes

// GET /columns
app.use('/columns', eventHandler(() => {
  return db.columns
}))

// GET /statuses
app.use('/statuses', eventHandler(() => {
  return db.statuses
}))

// GET /tracks
app.use('/tracks', eventHandler(() => {
  return db.tracks
}))

// GET /tasks
app.use('/tasks', eventHandler(() => {
  return db.tasks
}))

// POST /tasks/:id/move
app.use('/tasks/move', eventHandler(async (event) => {
  const body = await readBody<{ taskId: number, newStatusId: string }>(event)
  const { taskId, newStatusId } = body!

  const task = db.tasks.find(t => t.id === taskId)
  if (!task) {
    throw new Error('Task not found')
  }

  const track = db.tracks.find(t => t.id === task.trackId)
  if (!track) {
    throw new Error('Track not found')
  }

  const validTransitions = track.transitions[task.statusId] || []
  
  // Allow moving to same status (no-op)
  if (task.statusId === newStatusId) {
    return task
  }

  if (!validTransitions.includes(newStatusId)) {
    // Return error or invalid status
    return { error: 'Invalid transition', validTransitions }
  }

  task.statusId = newStatusId
  return task
}))

// GET /transitions?trackId=...&currentStatus=...
app.use('/transitions', eventHandler((event) => {
  const query = getQuery(event)
  const trackId = query.trackId as string
  const currentStatus = query.currentStatus as string

  const track = db.tracks.find(t => t.id === trackId)
  if (!track) return []

  return track.transitions[currentStatus] || []
}))

// Start Server
listen(toNodeHandler(app), { port: 3000 })
