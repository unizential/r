import type { Request, Response } from 'express'

type Client = { id: string; res: Response }
const clients = new Map<string, Client[]>()

export function sseSubscribe(req: Request, res: Response) {
  const id = req.params.id
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  const client: Client = { id, res }
  const arr = clients.get(id) ?? []
  arr.push(client)
  clients.set(id, arr)

  req.on('close', () => {
    const list = clients.get(id) || []
    clients.set(
      id,
      list.filter((c) => c !== client),
    )
  })
}

export function ssePublish(id: string, event: string, data: unknown) {
  const list = clients.get(id) || []
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  for (const c of list) {
    c.res.write(payload)
  }
}


