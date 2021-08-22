import { CumulativeWear } from './component-cumulative-wear.js'
import { Renderable } from './component-renderable.js'
import { Maintenance } from './component-maintenance.js'
import { DataRef } from './component-data-reference.js'

export default function Ship(entityManager, opts = {}) {
  const ship = entityManager.createTaggedEntity('ship')

  entityManager.addComponent(ship, new CumulativeWear())
  entityManager.addComponent(ship, new Renderable())
  entityManager.addComponent(ship, new Maintenance())

  if (opts.dataRef) {
    entityManager.addComponent(ship, new DataRef({ dataRef: opts.dataRef }))
  }

  return ship
}
