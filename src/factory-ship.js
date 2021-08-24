import { CumulativeWear } from './component-cumulative-wear.js'
import { Renderable } from './component-renderable.js'
import { Maintenance } from './component-maintenance.js'
import { DataRef } from './component-data-reference.js'
import { ScheduledMaintenance } from './component-scheduled-maintenance.js'
import { DAY_IN_MS } from './lib/constants.js'

export default function Ship({ EntityManager, ComponentManager }, opts = {}) {
  const ship = EntityManager.createTaggedEntity('ship')

  ComponentManager.add(ship, new CumulativeWear())
  ComponentManager.add(ship, new Renderable())
  ComponentManager.add(ship, new Maintenance())
  ComponentManager.add(
    ship,
    new ScheduledMaintenance({
      dateUTC: opts.epoch + DAY_IN_MS,
      facility: 'A',
    })
  )

  if (opts.dataRef) {
    ComponentManager.add(ship, new DataRef({ dataRef: opts.dataRef }))
  }

  return ship
}
