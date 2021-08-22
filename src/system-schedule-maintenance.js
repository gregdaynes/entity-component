import { System } from './lib/system.js'
import { DAY_IN_MS } from './lib/constants.js'

export class ScheduleMaintenance extends System {
  processTick(delta, entityManager, epoch) {
    const currentFrameDateUTC = epoch + delta * DAY_IN_MS

    const entitiesForMaintenance = entityManager.allEntitiesWithComponentOfType(
      'ScheduledMaintenance'
    )

    let accumulator = []
    for (let entity of entitiesForMaintenance) {
      const scheduledMaintenanceComponents = entityManager.componentOfType(
        entity,
        'ScheduledMaintenance'
      )

      for (let component of scheduledMaintenanceComponents) {
        if (component.dateUTC === currentFrameDateUTC) {
          accumulator.push(entity)
          entityManager.removeComponent(entity, component)
        }
      }
    }

    for (let entity of accumulator) {
      const maintenanceComponents = entityManager.componentOfType(
        entity,
        'Maintenance'
      )

      if (maintenanceComponents.length) {
        for (let component of maintenanceComponents) {
          component.inMaintenance = true
        }
      }
    }
  }
}
