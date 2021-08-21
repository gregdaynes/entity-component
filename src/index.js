import { EntityManager } from './entity-manager.js'
import { SystemManager } from './system-manager.js'
import { Component } from './component-base.js'
import { System } from './system-base.js'

export class DemoComponent extends Component {
  constructor(value) {
    super()
    this.value = value
  }

  grow(qty) {
    this.value = this.value + Math.abs(qty)
  }
}

export class DemoSystem extends System {
  processTick(delta, entityManager) {
    const demoEntities =
      entityManager.allEntitiesWithComponentOfType('DemoComponent')

    for (let entity of demoEntities) {
      const demoComponent = entityManager.componentOfType(
        entity,
        'DemoComponent'
      )

      demoComponent[0].grow(1)
    }
  }
}

const entityManager = new EntityManager()
const player = entityManager.createTaggedEntity('player')
entityManager.addComponent(player, new DemoComponent(10))

const systemManager = new SystemManager()
const demoSystem = new DemoSystem()
systemManager.addSystem(demoSystem)

const delta = 1
const frames = 2
for (let i = 0; i < frames; i = i + delta) {
  demoSystem.processTick(delta, entityManager)

  console.log('---')
}

console.log(JSON.stringify({ entityManager }))
