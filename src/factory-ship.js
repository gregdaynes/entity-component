import { CumulativeWear } from './component-cumulative-wear.js'
import { Renderable } from './component-renderable.js'
import { Maintenance } from './component-maintenance.js'

export default function Ship(entityManager) {
  const ship = entityManager.createTaggedEntity('ship')

  entityManager.addComponent(ship, new CumulativeWear())
  entityManager.addComponent(ship, new Renderable())
  entityManager.addComponent(ship, new Maintenance())

  return ship
}
