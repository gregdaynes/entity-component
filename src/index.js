import { EntityManager } from './entity-manager.js'
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
const player2 = entityManager.createTaggedEntity('player')
entityManager.addComponent(player, new DemoComponent(10))
entityManager.addComponent(player2, new DemoComponent(5))
const demoSystem = new DemoSystem()

const delta = 1
for (let i = 0; i < 2; i = i + delta) {
  // systems go here
  demoSystem.processTick(delta, entityManager)

  console.log('---') // end of tick
}

console.log(JSON.stringify(entityManager))
