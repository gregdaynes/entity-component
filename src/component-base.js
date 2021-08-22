import { randomUUID } from 'crypto'

export class Component {
  constructor() {
    this.id = randomUUID()
  }

  toString() {
    return `Component ${this.id}: ${this.constructor.name}`
  }

  toJSON() {
    const { id, ...rest } = this
    return rest
  }
}
