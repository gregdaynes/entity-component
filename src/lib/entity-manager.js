import { randomUUID } from 'crypto'

export class EntityManager {
  constructor() {
    this.id = randomUUID()
    this.idsToTags = {}
    this.tagsToIds = {}
  }

  createBasicEntity() {
    const uuid = randomUUID()
    return uuid
  }

  createTaggedEntity(tag) {
    if (!tag) throw new Error('Must specify tag')

    const uuid = this.createBasicEntity()

    this.idsToTags[uuid] = tag

    if (this.tagsToIds[tag]) {
      this.tagsToIds[tag].push(uuid)
    } else {
      this.tagsToIds[tag] = [uuid]
    }

    return uuid
  }
}
