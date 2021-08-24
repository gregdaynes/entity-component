import { System } from './lib/system.js'

export class EvaluateMaintenance extends System {
  processTick({ delta, EntityManager, ComponentManager }) {
    const wearEntities =
      ComponentManager.allEntitiesWithComponentOfType('CumulativeWear')
    const maintainableEntities =
      ComponentManager.allEntitiesWithComponentOfType('Maintenance')

    for (let entity of wearEntities) {
      const wearComponent = ComponentManager.componentOfType(
        entity,
        'CumulativeWear'
      )

      wearComponent[0].wear = wearComponent[0].wear + wearComponent[0].rate

      if (maintainableEntities.includes(entity)) {
        const maintenanceComponent = ComponentManager.componentOfType(
          entity,
          'Maintenance'
        )

        if (maintenanceComponent[0].inMaintenance) {
          const newWear = wearComponent[0].wear - maintenanceComponent[0].rate
          wearComponent[0].wear = newWear < 0 ? 0 : newWear
          maintenanceComponent[0].inMaintenance = false
        }
      }
    }
  }
}
