import { default as tinySonic } from 'tinysonic'
import { System } from './lib/system.js'
import { default as logger } from './lib/logger.js'
import { mark as perfMark, register as perfRegister } from './lib/perf.js'

export class Render extends System {
  processTick(
    { EntityManager, ComponentManager, DataManager, EventManager },
    { delta },
    external = {}
  ) {
    const renderableEntities =
      ComponentManager.allEntitiesWithComponentOfType('Renderable')

    let renderable = []
    for (let id of renderableEntities) {
      const entityComponents = ComponentManager.allComponentsOfEntity(id)

      let components = {}
      for (let [componentType, component] of Object.entries(entityComponents)) {
        let value = component?.map((component) => {
          return component.toJSON()
        })

        if (value?.length === 1) value = value[0]
        components[componentType] = value
      }

      renderable.push({ id, components })
    }

    const output = {
      delta,
      renderable,
      data: DataManager.data,
    }

    for (let [name, data] of Object.entries(external)) {
      perfMark(`Render:${name}_BEGIN`)
      output[name] = data
      perfMark(`Render:${name}_END`)
      perfRegister('System', `Render:${name}`)
    }

    const snapshot = tinySonic.stringify(output)
    EventManager.bus.emit('RENDER_SNAPSHOT', snapshot, output)
  }
}
