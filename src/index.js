import { EntityManager } from './lib/entity-manager.js'
import { SystemManager } from './lib/system-manager.js'
import { mark as perfMark, measure as perfMeasure } from './lib/perf.js'
import { DAY_IN_MS } from './lib/constants.js'

import { ScheduledMaintenance } from './component-scheduled-maintenance.js'
import { default as Ship } from './factory-ship.js'
import { EvaluateMaintenance } from './system-evaluate-maintenance.js'
import { Render } from './system-render.js'
import { ScheduleMaintenance } from './system-schedule-maintenance.js'
import { CheckFacilityOverlap } from './system-check-facility-overlap.js'
import { AssociateDataRef } from './system-associate-data-reference.js'

perfMark('A')
perfMeasure('Startup', 'A')
const entityManager = new EntityManager()
const systemManager = new SystemManager()
const epoch = Date.now()

const data = {
  ship1Ref: {
    name: 'Boaty McBoatface',
  },
}

const ship1 = Ship(entityManager, { dataRef: 'ship1Ref' })
const ship2 = Ship(entityManager)
const ship3 = Ship(entityManager)
const ship4 = Ship(entityManager)

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
entityManager.addComponent(
  ship1,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 3,
    facility: 'C',
  })
)
entityManager.addComponent(
  ship1,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 4,
    facility: 'D',
  })
)

const evaluateMaintenance = systemManager.addSystem(new EvaluateMaintenance())
const render = systemManager.addSystem(new Render())
const associateDataRef = systemManager.addSystem(new AssociateDataRef())
const scheduleMaintenance = systemManager.addSystem(new ScheduleMaintenance())
const checkFacilityOverlap = systemManager.addSystem(new CheckFacilityOverlap())

const delta = 1
const frames = 1
perfMark('B')
perfMeasure('Init complete', 'A', 'B')

perfMark('C')
for (let i = 0; i <= frames; i = i + delta) {
  scheduleMaintenance.processTick(i, entityManager, epoch)
  checkFacilityOverlap.processTick(i, entityManager)
  evaluateMaintenance.processTick(i, entityManager)
}
perfMark('D')
perfMeasure('Processing', 'C', 'D')

associateDataRef.processTick('end', entityManager, data)
render.processTick('end', entityManager)
perfMeasure('Total Runtime')
