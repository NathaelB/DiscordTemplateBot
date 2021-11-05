import { Model, BaseModel, Uuid } from '@discord-factory/storage-next'

@Model('tickets')
export default class Ticket extends BaseModel<Ticket> {
  public id: string

  public static beforeInsert (model: Ticket) {
    model.id = Uuid.generateV4()
  }
}