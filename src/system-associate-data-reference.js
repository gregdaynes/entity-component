import { System } from './lib/system.js'

export class AssociateDataRef extends System {
  processTick(delta, entityManager, dataStore) {
    const dataEntities = entityManager.allEntitiesWithComponentOfType('DataRef')

    for (let entity of dataEntities) {
      const components = entityManager.componentOfType(entity, 'DataRef')

      for (let component of components) {
        component.data = dataStore[component.dataRef]
      }
    }
  }
}
