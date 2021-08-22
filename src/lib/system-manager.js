import { randomUUID } from 'crypto'

export class SystemManager {
  constructor() {
    this.id = randomUUID()
    this.systemStores = []
  }

  addSystem(system) {
    if (!system) throw new Error('system must be specified')

    this.systemStores[system.constructor.name] = system

    return system
  }
}
