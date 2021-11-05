import { Model, BaseModel, Uuid } from '@discord-factory/storage-next'

@Model('user')
export default class User extends BaseModel<User> {
  public id: string

  public username: string

  public user_id: string

  public level: number

  public exp: number

  public static beforeInsert (model: User) {
    model.id = Uuid.generateV4()
  }
}