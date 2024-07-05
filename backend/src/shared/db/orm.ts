import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";


export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'alquilerVehiculos',
    //type: 'mysql',
    clientUrl: 'mysql://BGGJM:BGGJM@localhost:3306/alquilerVehiculos',
    highlighter: new SqlHighlighter,
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