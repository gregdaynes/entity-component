import { System } from './lib/system.js'
import { DAY_IN_MS } from './lib/constants.js'

export class ScheduleMaintenance extends System {
  processTick({ ComponentManager }, { delta, epoch }) {
    const currentFrameDateUTC = epoch + delta * DAY_IN_MS

    const entitiesForMaintenance =
      ComponentManager.allEntitiesWithComponentOfType('ScheduledMaintenance')

    let accumulator = {}
    for (let entity of entitiesForMaintenance) {
      const scheduledMaintenanceComponents = ComponentManager.componentOfType(
        entity,
        'ScheduledMaintenance'
      )

      for (let component of scheduledMaintenanceComponents) {
        if (component.dateUTC === currentFrameDateUTC) {
          accumulator[entity] = component
          ComponentManager.removeComponent(entity, component)
        }
      }
    }

    for (let [entity, scheduleComponent] of Object.entries(accumulator)) {
      const maintenanceComponents = ComponentManager.componentOfType(
        entity,
        'Maintenance'
      )

      if (maintenanceComponents.length) {
        for (let component of maintenanceComponents) {
          component.inMaintenance = true
          component.facility = scheduleComponent.facility
        }
      }
    }
  }
}
