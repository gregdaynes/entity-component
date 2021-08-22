import { PerformanceObserver, performance } from 'node:perf_hooks'

import { EntityManager } from './lib/entity-manager.js'
import { SystemManager } from './lib/system-manager.js'
import { default as logger } from './lib/logger.js'

import { CumulativeWear } from './component-cumulative-wear.js'
import { Renderable } from './component-renderable.js'
import { Maintenance } from './component-maintenance.js'
import { ScheduledMaintenance } from './component-scheduled-maintenance.js'

import { EvaluateMaintenance } from './system-evaluate-maintenance.js'
import { Render } from './system-render.js'
import { ScheduleMaintenance } from './system-schedule-maintenance.js'
import { Debug } from './system-debug.js'

const obs = new PerformanceObserver((items) => {
  for (let { name, duration } of items.getEntries()) {
    logger.info({ name, duration })
  }
  performance.clearMarks()
})
obs.observe({ type: 'measure' })

performance.mark('A')
const entityManager = new EntityManager()
const systemManager = new SystemManager()
const epoch = Date.now()

const ship = entityManager.createTaggedEntity('ship')
entityManager.addComponent(ship, new CumulativeWear())
entityManager.addComponent(ship, new Renderable())
entityManager.addComponent(ship, new Maintenance())
entityManager.addComponent(
  ship,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000,
    facility: 'A',
  })
)
entityManager.addComponent(
  ship,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 2,
    facility: 'B',
  })
)
entityManager.addComponent(
  ship,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 3,
    facility: 'C',
  })
)
entityManager.addComponent(
  ship,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 4,
    facility: 'D',
  })
)

const evaluateMaintenance = systemManager.addSystem(new EvaluateMaintenance())
const render = systemManager.addSystem(new Render())
const scheduleMaintenance = systemManager.addSystem(new ScheduleMaintenance())
const debug = systemManager.addSystem(new Debug())

const delta = 1
const frames = 2
performance.mark('B')

performance.mark('C')
for (let i = 0; i <= frames; i = i + delta) {
  // logger.info('--- Start of frame ---')
  // debug.processTick(i, entityManager)
  scheduleMaintenance.processTick(i, entityManager, epoch)
  evaluateMaintenance.processTick(i, entityManager)
  // render.processTick(i, entityManager)
  // logger.info('--- End of frame ---')
}
performance.mark('D')

performance.measure('Startup', 'A')
performance.measure('Init complete', 'A', 'B')
performance.measure('Processing', 'C', 'D')
