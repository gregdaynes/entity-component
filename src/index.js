import { Engine } from './lib/engine.js'
import { run as perfReport } from './lib/perf.js'
import { default as Ship } from './factory-ship.js'
import { EvaluateMaintenance } from './system-evaluate-maintenance.js'
import { Render } from './system-render.js'
import { ScheduleMaintenance } from './system-schedule-maintenance.js'
import { CheckFacilityOverlap } from './system-check-facility-overlap.js'
import { AssociateDataRef } from './system-associate-data-reference.js'

const epoch = Date.now()

const engine = new Engine()
const System = engine.SystemManager.add
const Events = engine.EventManager.bus

// event handlers
Events.on('RENDER_SNAPSHOT', (snapshot, output) => {
  console.log(output)
})

// reference data
const data = {
  ship1Ref: {
    name: 'Boaty McBoatface',
  },
}

// constructing entities
Ship(engine, { dataRef: 'ship1Ref', epoch })
Ship(engine, { epoch })

// run loop
engine.loopFixed(1_000, [
  [System(ScheduleMaintenance), { epoch }],
  [System(CheckFacilityOverlap)],
  [System(EvaluateMaintenance)],
])

// post processing
engine.loopFixed(1, [
  [System(AssociateDataRef), { delta: 'end', data }],
  [System(Render), { delta: null }],
])

// performance report
perfReport()
