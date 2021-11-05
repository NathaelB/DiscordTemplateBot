import { Model, BaseModel, Uuid } from '@discord-factory/storage-next'

@Model('ticket')
export default class Ticket extends BaseModel<Ticket> {
  public id: string

  public ticket_id: string

  public user_id: string

  public static beforeInsert (model: Ticket) {
    model.id = Uuid.generateV4()
  }
}