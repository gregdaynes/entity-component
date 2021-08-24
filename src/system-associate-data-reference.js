import { System } from './lib/system.js'

export class AssociateDataRef extends System {
  processTick({ ComponentManager }, { data: dataStore }) {
    const dataEntities =
      ComponentManager.allEntitiesWithComponentOfType('DataRef')

    for (let entity of dataEntities) {
      const components = ComponentManager.componentOfType(entity, 'DataRef')

      for (let component of components) {
        component.data = dataStore[component.dataRef]
      }
    }
  }
}
