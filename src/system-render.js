import { System } from './lib/system.js'
import { default as logger } from './lib/logger.js'

export class Render extends System {
  processTick(delta, entityManager) {
    const renderableEntities =
      entityManager.allEntitiesWithComponentOfType('Renderable')

    let renderable = []
    for (let id of renderableEntities) {
      const entityComponents = entityManager.allComponentsOfEntity(id)

      let components = {}
      for (let [componentType, component] of Object.entries(entityComponents)) {
        components[componentType] = component?.map((component) => {
          return component.toJSON()
        })
      }

      renderable.push({ id, components })
    }

    logger.info({ delta, renderable })
  }
}
