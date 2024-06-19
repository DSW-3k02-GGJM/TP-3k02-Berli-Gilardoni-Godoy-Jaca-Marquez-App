import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { MongoDriver } from "@mikro-orm/mongodb";
//import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'alquilerVehiculos',
    driver: MongoDriver,
    //type: 'mysql'
    clientUrl: 'aca va la conexion a mongodb',
    highlighter: new MongoHighlighter,
    debug: true,
    schemaGenerator: { //never in production
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema:[],
    }
})


export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator()
    /*
    await generator.dropSchema()
    await generator.createScehma()
    */
    await generator.updateSchema()
}