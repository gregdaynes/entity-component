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

  removeComponent(entityUUID, component) {
    if (!entityUUID) throw new Error('UUID must be specified')
    if (!component) throw new Error('component must be specified')

    let store = this.componentStores[component.constructor.name][entityUUID]
    if (!store) return

    let newStore = []
    for (let componentInStore of store) {
      if (componentInStore.id != component.id) {
        newStore.push(componentInStore)
      }
    }

    if (newStore.length) {
      this.componentStores[component.constructor.name][entityUUID] = newStore
    } else {
      delete this.componentStores[component.constructor.name][entityUUID]
    }

    if (!Object.keys(this.componentStores[component.constructor.name]).length) {
      delete this.componentStores[component.constructor.name]
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

    return Object.keys(this.componentStores[componentClass] || {})
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
