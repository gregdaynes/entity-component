import { randomUUID } from 'crypto'

export class SystemManager {
  constructor(engine) {
    this.id = randomUUID()
    this.systemStores = {}
    this.engine = engine
    this.add = this.addSystem.bind(this)
  }

  addSystem(system, ...args) {
    if (!system) throw new Error('system must be specified')

    let instance = system
    if (typeof system === 'function') {
      instance = new system(this.engine, ...args)
    }

    this.systemStores[instance.constructor.name] = instance

    return instance
  }

  getSystem(system) {
    const key = ((system) => {
      switch (typeof system) {
        case 'function':
          return system.name
        case 'object':
          return system.constructor.name
        case 'string':
          return system
      }
    })(system)

    return this.systemStores[key]
  }
}
