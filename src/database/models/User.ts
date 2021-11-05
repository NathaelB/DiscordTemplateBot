import { Model, BaseModel, Uuid } from '@discord-factory/storage-next'

@Model('users')
export default class User extends BaseModel<User> {
  public id: string

  public username: string

  public user_id: string

  public static beforeInsert (model: User) {
    model.id = Uuid.generateV4()
  }
}