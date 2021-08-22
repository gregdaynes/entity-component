import { EntityManager } from './lib/entity-manager.js'
import { SystemManager } from './lib/system-manager.js'
import { mark, measure } from './lib/perf.js'
import { DAY_IN_MS } from './lib/constants.js'

import { ScheduledMaintenance } from './component-scheduled-maintenance.js'
import { default as Ship } from './factory-ship.js'
import { EvaluateMaintenance } from './system-evaluate-maintenance.js'
import { Render } from './system-render.js'
import { ScheduleMaintenance } from './system-schedule-maintenance.js'

mark('A')
measure('Startup', 'A')
const entityManager = new EntityManager()
const systemManager = new SystemManager()
const epoch = Date.now()

const ship1 = Ship(entityManager)
const ship2 = Ship(entityManager)
// const ship3 = Ship(entityManager)
// const ship4 = Ship(entityManager)

entityManager.addComponent(
  ship1,
  new ScheduledMaintenance({
    dateUTC: epoch + DAY_IN_MS,
    facility: 'A',
  })
)
entityManager.addComponent(
  ship2,
  new ScheduledMaintenance({
    dateUTC: epoch + DAY_IN_MS,
    facility: 'A',
  })
)
// entityManager.addComponent(
//   ship1,
//   new ScheduledMaintenance({
//     dateUTC: epoch + 86400000 * 3,
//     facility: 'C',
//   })
// )
// entityManager.addComponent(
//   ship1,
//   new ScheduledMaintenance({
//     dateUTC: epoch + 86400000 * 4,
//     facility: 'D',
//   })
// )

const evaluateMaintenance = systemManager.addSystem(new EvaluateMaintenance())
const render = systemManager.addSystem(new Render())
const scheduleMaintenance = systemManager.addSystem(new ScheduleMaintenance())

const delta = 1
const frames = 0
mark('B')
measure('Init complete', 'A', 'B')

mark('C')
for (let i = 0; i <= frames; i = i + delta) {
  scheduleMaintenance.processTick(i, entityManager, epoch)
  evaluateMaintenance.processTick(i, entityManager)
}
mark('D')
measure('Processing', 'C', 'D')

// render.processTick(0, entityManager)
measure('Total Runtime')
