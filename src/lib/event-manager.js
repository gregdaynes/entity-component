import { randomUUID } from 'crypto'
import { default as EventEmitter } from 'node:events'

export class EventManager {
  constructor(engine) {
    this.id = randomUUID()
    this.bus = new EventEmitter()
  }
}
