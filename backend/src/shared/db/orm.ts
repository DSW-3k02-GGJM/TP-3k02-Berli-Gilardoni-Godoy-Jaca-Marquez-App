import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'alquilerVehiculos',
  driver: MySqlDriver,
  clientUrl: 'mysql://dsw:dsw@127.0.0.1:3307/alquilerVehiculos',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    // never in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  /*
  await generator.dropSchema()
  await generator.createScehma()
  */
  await generator.updateSchema();
};
