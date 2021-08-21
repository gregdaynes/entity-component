import { randomUUID } from 'crypto'

export class Component {
  constructor() {
    this.id = randomUUID()
  }

  toString() {
    return `Component ${this.id}: ${this.constructor.name}`
  }

  // something for the future for serialization?
  toJSON() {
    return this
  }
}
