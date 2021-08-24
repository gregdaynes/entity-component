import { randomUUID } from 'node:crypto'
import { mark as perfMark, register as perfRegister } from './perf.js'
import { ComponentManager } from './component-manager.js'
import { SystemManager } from './system-manager.js'
import { EntityManager } from './entity-manager.js'
import { DataManager } from './data-manager.js'
import { EventManager } from './event-manager.js'

export class Engine {
  constructor() {
    this.id = randomUUID()
    this.ComponentManager = new ComponentManager()
    this.SystemManager = new SystemManager(this)
    this.EntityManager = new EntityManager()
    this.DataManager = new DataManager()
    this.EventManager = new EventManager()
  }

  loopFixed(iterations, systems) {
    perfRegister('Engine', 'Processing Time', 'LOOP')
    perfMark('LOOP_BEGIN')
    for (let delta = 1; delta <= iterations; delta++) {
      for (let [system, args] of systems) {
        system.run.call(system, { delta, ...args })
      }
    }
    perfMark('LOOP_END')
  }
}
