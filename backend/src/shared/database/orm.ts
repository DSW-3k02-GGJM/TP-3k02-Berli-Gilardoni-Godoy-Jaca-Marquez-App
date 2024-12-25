// MikroORM
import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

// Configuration
import { MYSQL_CONNECTION } from '../../config.js';

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'alquilervehiculos',
  driver: MySqlDriver,
  clientUrl: MYSQL_CONNECTION,
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
};
