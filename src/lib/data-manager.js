import { randomUUID } from 'crypto'

export class DataManager {
  constructor() {
    this.id = randomUUID()
    this.data = {}
  }
}
