import { Migration, BaseMigration, Schema, Table } from '@discord-factory/storage-next'

@Migration()
export default class Users_1636112258046 extends BaseMigration {
  public tableName = 'users'

  public async up (schema: Schema): Promise<any> {
    return schema.createTable(this.tableName, (table: Table) => {
      table.string('id').primary()
      // Your database migration here
    })
  }

  public async down (schema: Schema): Promise<any> {
    return schema.dropTableIfExists(this.tableName)
  }
}