import type { DomainEvent, EventType } from '../types'

export type EventHandler<T = unknown> = (event: DomainEvent<T>) => void | Promise<void>

const handlerMap = new Map<EventType, EventHandler[]>()

export function on<T = unknown>(eventType: EventType, handler: EventHandler<T>): void {
  const list = handlerMap.get(eventType) ?? []
  list.push(handler as EventHandler)
  handlerMap.set(eventType, list)
}

export function off(eventType: EventType, handler: EventHandler): void {
  const list = handlerMap.get(eventType) ?? []
  handlerMap.set(eventType, list.filter((h) => h !== handler))
}

export function getHandlerCount(eventType: EventType): number {
  return (handlerMap.get(eventType) ?? []).length
}

export function getRegisteredEvents(): EventType[] {
  return Array.from(handlerMap.keys())
}

export async function dispatch<T = unknown>(event: DomainEvent<T>): Promise<void> {
  const registered = handlerMap.get(event.type) ?? []

  for (const handler of registered) {
    try {
      await handler(event)
    } catch (err) {
      console.error(`[EventEngine] Handler error for ${event.type}:`, err)
    }
  }
}

export function emit<T = unknown>(
  type: EventType,
  origin: string,
  payload: T,
  colaboradorId?: string,
): DomainEvent<T> {
  const event: DomainEvent<T> = {
    type,
    origin,
    payload,
    colaboradorId,
    timestamp: new Date(),
  }
  return event
}
