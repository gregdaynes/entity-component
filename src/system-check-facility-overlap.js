import { System } from './lib/system.js'

// An example validation system to alert when more than one entities are
// scheduled to be at a facility for maintenance on the same day

export class CheckFacilityOverlap extends System {
  processTick({ EntityManager, ComponentManager, DataManager }, { delta }) {
    const maintenanceEntities =
      ComponentManager.allEntitiesWithComponentOfType('Maintenance')

    let facilities = {}
    for (let entity of maintenanceEntities) {
      const maintenanceComponents = ComponentManager.componentOfType(
        entity,
        'Maintenance'
      )

      for (let component of maintenanceComponents) {
        if (!component.facility) break

        if (facilities[component.facility]) {
          facilities[component.facility].push(component)
        } else {
          facilities[component.facility] = [component]
        }
      }
    }

    for (let [facility, entries] of Object.entries(facilities)) {
      if (entries.length > 1) {
        Object.assign(DataManager.data, {
          info: `Facility ${facility}: is overloaded`,
        })
      }
    }
  }
}
