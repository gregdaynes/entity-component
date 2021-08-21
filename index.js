import { randomUUID } from 'crypto'

export class EntityManager {
  constructor() {
    this.id = randomUUID()
    this.idsToTags = {}
    this.tagsToIds = {}
    this.componentStores = {}
  }

  createBasicEntity() {
    const uuid = randomUUID()
    return uuid
  }

  createTaggedEntity(tag) {
    if (!tag) throw new Error('Must specify tag')

    const uuid = this.createBasicEntity()

    this.idsToTags[uuid] = tag

    if (this.tagsToIds[tag]) {
      this.tagsToIds[tag].push(uuid)
    } else {
      this.tagsToIds[tag] = [uuid]
    }

    return uuid
  }

  addComponent(entityUUID, component) {
    if (!entityUUID) throw new Error('UUID must be specified')
    if (!component) throw new Error('component must be specified')

    let store = this.componentStores[component.constructor.name]
    if (!store) {
      store = {}
      this.componentStores[component.constructor.name] = store
    }

    // this could be a set!
    if (store[entityUUID] && !store[entityUUID].includes(component)) {
      store[entityUUID].push(component)
    } else {
      store[entityUUID] = [component]
    }
  }

  hasComponentOfType(entityUUID, componentClass) {
    if (!entityUUID) throw new Error('UUID must be specified')
    if (!componentClass) throw new Error('componentClass must be specified')

    const store = this.componentStores[componentClass]
    if (!store || !store[entityUUID].length > 0) {
      return false
    } else {
      return Object.keys(store).includes(entityUUID)
    }
  }

  hasComponent(entityUUID, component) {
    if (!entityUUID) throw new Error('UUID must be specified')
    if (!component) throw new Error('component must be specified')

    const store = this.componentStores[component.constructor.name]
    if (!store) {
      return false
    } else {
      return (
        Object.keys(store).includes(entityUUID) &&
        store[entityUUID].includes(component)
      )
    }
  }

  allEntitiesWithComponentOfType(componentClass) {
    if (!componentClass) throw new Error('componentClass must be specified')

    return Object.keys(this.componentStores[componentClass]) || []
  }

  componentOfType(entityUUID, componentClass) {
    if (!entityUUID) throw new Error('UUID must be specified')
    if (!componentClass) throw new Error('componentClass must be specified')

    const store = this.componentStores[componentClass]
    if (!store || !store[entityUUID]) {
      return {}
    } else {
      return store[entityUUID]
    }
  }
}

export class Component {
  constructor() {
    this.id = randomUUID()
  }

  toString() {
    return `Component ${this.id}: ${this.constructor.name}`
  }

  // something for the future for serialization?
  toJSON() {
    return this
  }
}

export class DemoComponent extends Component {
  constructor(value) {
    super()
    this.value = value
  }

  grow(qty) {
    this.value = this.value + Math.abs(qty)
  }
}

export class System {
  processTick() {
    throw new Error('Systems must override processTick()')
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

console.log(
  JSON.stringify({
    player,
    entityManager,
    entityHasComponent: entityManager.hasComponentOfType(
      player,
      'DemoComponent'
    ),
  })
)
