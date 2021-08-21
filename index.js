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
    if (!store[entityUUID].includes(component)) {
      store[entityUUID].push(component)
    } else {
      store[entityUUID] = [component]
    }
  }

  hasComponentOfType(entityUUID, componentClass) {
    if (!entityUUID) throw new Error('UUID must be specified')
    if (!componentClass) throw new Error('componentClass must be specified')

    const store = this.componentStores[componentClass]
    if (!store || store[entityUUID].length > 0) {
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

const entityManager = new EntityManager()
const entity = entityManager.createBasicEntity()

console.log(
  JSON.stringify({
    entity,
    entityHasComponent: entityManager.hasComponentOfType(entity, 'test'),
    myComponent: new Component(),
  })
)
