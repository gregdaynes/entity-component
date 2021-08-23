import { System } from './lib/system.js'
import { default as logger } from './lib/logger.js'
import { mark as perfMark, register as perfRegister } from './lib/perf.js'

export class Render extends System {
  processTick(delta, entityManager, opts = {}) {
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

    perfMark('eventChannelRender_BEGIN')
    renderable.push(opts.eventChannel)
    perfMark('eventChannelRender_END')
    perfRegister('System', 'eventChannelRender')

    perfMark('sideChannelRender_BEGIN')
    renderable.push(opts.sideChannel)
    perfMark('sideChannelRender_END')
    perfRegister('System', 'sideChannelRender')

    logger.info({ delta, renderable })
  }
}
