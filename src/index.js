import { EntityManager } from './lib/entity-manager.js'
import {
  mark as perfMark,
  measure as perfMeasure,
  run as perfReport,
  register as perfRegister,
} from './lib/perf.js'
import { DAY_IN_MS } from './lib/constants.js'

import { ScheduledMaintenance } from './component-scheduled-maintenance.js'
import { default as Ship } from './factory-ship.js'
import { EvaluateMaintenance } from './system-evaluate-maintenance.js'
import { Render } from './system-render.js'
import { ScheduleMaintenance } from './system-schedule-maintenance.js'
import {
  CheckFacilityOverlap,
  CheckFacilityOverlapEvent,
} from './system-check-facility-overlap.js'
import { AssociateDataRef } from './system-associate-data-reference.js'

perfMark('SETUP_BEGIN')
perfMeasure('Script: Startup', 'SETUP_BEGIN')
const epoch = Date.now()
const entityManager = new EntityManager()
// systems
const evaluateMaintenance = new EvaluateMaintenance()
const render = new Render()
const associateDataRef = new AssociateDataRef()
const scheduleMaintenance = new ScheduleMaintenance()
const checkFacilityOverlap = new CheckFacilityOverlap()
const checkFacilityOverlapEvent = new CheckFacilityOverlapEvent()

// data stores
const sideChannel = {}
const eventChannel = {}
const data = {
  ship1Ref: {
    name: 'Boaty McBoatface',
  },
}

// constructing entities
const ship1 = Ship(entityManager, { dataRef: 'ship1Ref' })
entityManager.addComponent(
  ship1,
  new ScheduledMaintenance({
    dateUTC: epoch + DAY_IN_MS,
    facility: 'A',
  })
)
const ship2 = Ship(entityManager)
entityManager.addComponent(
  ship2,
  new ScheduledMaintenance({
    dateUTC: epoch + DAY_IN_MS,
    facility: 'A',
  })
)

const delta = 1
const frames = 100000
perfMark('SETUP_END')

entityManager.bus.on('test', (payload) => {
  Object.assign(eventChannel, payload)
})

perfMark('LOOP_BEGIN')
for (let i = 0; i <= frames; i = i + delta) {
  scheduleMaintenance.run(i, entityManager, epoch)
  checkFacilityOverlap.run(i, entityManager, sideChannel)
  checkFacilityOverlapEvent.run(i, entityManager)
  evaluateMaintenance.run(i, entityManager)
}
perfMark('LOOP_END')

associateDataRef.run('end', entityManager, data)
render.run(null, entityManager, {
  sideChannel,
  eventChannel,
})

perfMark('SCRIPT_END')
perfMeasure('Execution Time', 'SETUP_BEGIN', 'SETUP_END')
perfRegister('Script', 'Execution Time', 'SETUP', 'SCRIPT')
perfRegister('Script', 'Init complete', 'SETUP')
perfRegister('Script', 'Processing', 'LOOP')

perfReport()
