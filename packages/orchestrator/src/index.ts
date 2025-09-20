import express from 'express'
import cors from 'cors'
import { MCPRouter } from './mcp.js'
import { ssePublish, sseSubscribe } from './sse.js'

// Export MCP interfaces for use by agents
export * from './mcp.js';
export * from './types.js';

const app = express()
const port = process.env.ORCHESTRATOR_PORT || process.env.PORT || 7071

app.use(cors())
app.use(express.json())

// Minimal in-memory stubs
const sessions = new Map<string, any>()
const router = new MCPRouter()

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Create a new council session
app.post('/api/v1/council', (req, res) => {
  try {
    const { context, agents } = req.body
    const id = crypto.randomUUID()
    sessions.set(id, {
      id,
      context,
      agents,
      createdAt: Date.now(),
      state: 'collecting_proposals',
      messages: [],
      synthesis: null,
    })
    if (process.env.ENABLE_WS_UPDATES === 'true') {
      ssePublish(id, 'state', { id, state: 'collecting_proposals' })
    }
    res.json({ council_id: id, status: 'created' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Get council status
app.get('/api/v1/council/:id', (req, res) => {
  try {
    const sess = sessions.get(req.params.id)
    if (!sess) throw new Error('not found')
    res.json({ id: sess.id, state: sess.state, createdAt: sess.createdAt })
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

// Process a message in a council session
app.post('/api/v1/council/:id/message', async (req, res) => {
  try {
    const sess = sessions.get(req.params.id)
    if (!sess) throw new Error('not found')
    const msg = req.body
    sess.messages.push(msg)
    // If proposal/critique accumulate, synthesize minimally
    if (msg?.content?.type === 'proposal') {
      sess.state = 'proposal_received'
      if (process.env.ENABLE_WS_UPDATES === 'true') {
        ssePublish(sess.id, 'state', { id: sess.id, state: sess.state })
      }
    }
    res.json({ ok: true })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Get council synthesis
app.get('/api/v1/council/:id/synthesis', (req, res) => {
  try {
    const sess = sessions.get(req.params.id)
    if (!sess) throw new Error('not found')
    const proposals = sess.messages.filter((m: any) => m?.content?.type === 'proposal')
    const summary = proposals[0]?.content?.summary || 'No proposals yet'
    const synthesis = {
      recommendation: summary,
      confidence: proposals.length > 0 ? 0.7 : 0.0,
      mode: 'consensus',
    }
    if (process.env.ENABLE_WS_UPDATES === 'true') {
      ssePublish(sess.id, 'synthesis', synthesis)
    }
    res.json(synthesis)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

app.get('/ws/council/:id', sseSubscribe)

// MCP stubs
app.get('/mcp/agents', (req, res) => {
  res.json({ agents: router.getAvailableAgents() })
})

app.listen(Number(port), () => {
  console.log(`Council Orchestrator running on port ${port}`)
})

