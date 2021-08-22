import { EntityManager } from './lib/entity-manager.js'
import { SystemManager } from './lib/system-manager.js'
import { mark, measure } from './lib/perf.js'

import { CumulativeWear } from './component-cumulative-wear.js'
import { Renderable } from './component-renderable.js'
import { Maintenance } from './component-maintenance.js'
import { ScheduledMaintenance } from './component-scheduled-maintenance.js'

import { EvaluateMaintenance } from './system-evaluate-maintenance.js'
import { Render } from './system-render.js'
import { ScheduleMaintenance } from './system-schedule-maintenance.js'
import { Debug } from './system-debug.js'

class Ship {
  constructor(entityManager) {
    const entityUUID = entityManager.createTaggedEntity('ship')
    this.id = entityUUID
    entityManager.addComponent(entityUUID, new CumulativeWear())
    entityManager.addComponent(entityUUID, new Renderable())
    entityManager.addComponent(entityUUID, new Maintenance())
  }
}

mark('A')
measure('Startup', 'A')
const entityManager = new EntityManager()
const systemManager = new SystemManager()
const epoch = Date.now()

const ship1 = new Ship(entityManager)
const ship2 = new Ship(entityManager)
const ship3 = new Ship(entityManager)
const ship4 = new Ship(entityManager)

entityManager.addComponent(
  ship1.id,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000,
    facility: 'A',
  })
)
entityManager.addComponent(
  ship1.id,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 2,
    facility: 'B',
  })
)
entityManager.addComponent(
  ship1.id,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 3,
    facility: 'C',
  })
)
entityManager.addComponent(
  ship1.id,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 4,
    facility: 'D',
  })
)

const evaluateMaintenance = systemManager.addSystem(new EvaluateMaintenance())
const render = systemManager.addSystem(new Render())
const scheduleMaintenance = systemManager.addSystem(new ScheduleMaintenance())

const delta = 1
const frames = 3000000
mark('B')
measure('Init complete', 'A', 'B')

mark('C')
for (let i = 0; i <= frames; i = i + delta) {
  scheduleMaintenance.processTick(i, entityManager, epoch)
  evaluateMaintenance.processTick(i, entityManager)
}
mark('D')
measure('Processing', 'C', 'D')

render.processTick(0, entityManager)
measure('Total Runtime')
