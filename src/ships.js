import { PerformanceObserver, performance } from 'node:perf_hooks'
import { EntityManager } from './entity-manager.js'
import { SystemManager } from './system-manager.js'
import { Component } from './component-base.js'
import { System } from './system-base.js'
import Logger from 'pino'
const logger = Logger()

const obs = new PerformanceObserver((items) => {
  for (let { name, duration } of items.getEntries()) {
    logger.info({ name, duration })
  }
  performance.clearMarks()
})
obs.observe({ type: 'measure' })

class CumulativeWear extends Component {
  constructor({ initial = 0, rate = 1 } = {}) {
    super()
    this.wear = initial
    this.rate = rate
  }

  toJSON() {
    return this.wear
  }
}

class Renderable extends Component {
  constructor() {
    super()
    this.renderable = true
  }

  toJSON() {
    return this.renderable
  }
}

class Maintenance extends Component {
  constructor({ rate = 2 } = {}) {
    super()
    this.rate = rate
    this.inMaintenance = false
  }
}

class ScheduledMaintenance extends Component {
  constructor({
    dateUTC,
    facility,
    rateMultiplier = 1,
    rateMultiplierFacility = 1,
    rateMultiplierFlat = 1,
  } = {}) {
    super()
    this.dateUTC = dateUTC
    this.facility = facility
    this.rateMultiplier = rateMultiplier
    this.rateMultiplierFacility = rateMultiplierFacility
    this.rateMultiplierFlat = rateMultiplierFlat
  }

  toJSON() {
    return {
      dateUTC: this.dateUTC,
      facility: this.facility,
    }
  }
}

class EvaluateMaintenance extends System {
  processTick(delta, entityManager) {
    const wearEntities =
      entityManager.allEntitiesWithComponentOfType('CumulativeWear')
    const maintainableEntities =
      entityManager.allEntitiesWithComponentOfType('Maintenance')

    for (let entity of wearEntities) {
      const wearComponent = entityManager.componentOfType(
        entity,
        'CumulativeWear'
      )

      wearComponent[0].wear = wearComponent[0].wear + wearComponent[0].rate

      if (maintainableEntities.includes(entity)) {
        const maintenanceComponent = entityManager.componentOfType(
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

class Render extends System {
  processTick(delta, entityManager) {
    const renderableEntities =
      entityManager.allEntitiesWithComponentOfType('Renderable')

    for (let id of renderableEntities) {
      const entityComponents = entityManager.allComponentsOfEntity(id)

      let components = {}
      for (let [componentType, component] of Object.entries(entityComponents)) {
        components[componentType] = component.map((component) => {
          return component.toJSON()
        })
      }

      logger.info({
        delta,
        id,
        components,
      })
    }
  }
}

class ScheduleMaintenance extends System {
  DAY_MILLISECONDS = 86400000

  processTick(delta, entityManager, epoch) {
    const currentFrameDateUTC = epoch + delta * this.DAY_MILLISECONDS

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

class Log extends System {
  processTick(delta, entityManager) {
    logger.info({ delta, entityManager })
  }
}

performance.mark('A')
const entityManager = new EntityManager()
const systemManager = new SystemManager()
const epoch = Date.now()

const ship = entityManager.createTaggedEntity('ship')
entityManager.addComponent(ship, new CumulativeWear())
entityManager.addComponent(ship, new Renderable())
entityManager.addComponent(ship, new Maintenance())
entityManager.addComponent(
  ship,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000,
    facility: 'A',
  })
)
entityManager.addComponent(
  ship,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 2,
    facility: 'B',
  })
)
entityManager.addComponent(
  ship,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 3,
    facility: 'C',
  })
)
entityManager.addComponent(
  ship,
  new ScheduledMaintenance({
    dateUTC: epoch + 86400000 * 4,
    facility: 'D',
  })
)

const evaluateMaintenance = systemManager.addSystem(new EvaluateMaintenance())
const render = systemManager.addSystem(new Render())
const scheduleMaintenance = systemManager.addSystem(new ScheduleMaintenance())
const log = systemManager.addSystem(new Log())

const delta = 1
const frames = 1
performance.mark('B')

performance.mark('C')
for (let i = 0; i <= frames; i = i + delta) {
  logger.info('--- Start of frame ---')
  // log.processTick(i, entityManager)
  scheduleMaintenance.processTick(i, entityManager, epoch)
  evaluateMaintenance.processTick(i, entityManager)
  render.processTick(i, entityManager)
  logger.info('--- End of frame ---')
}
performance.mark('D')

performance.measure('Startup', 'A')
performance.measure('Init complete', 'A', 'B')
performance.measure('Processing', 'C', 'D')
