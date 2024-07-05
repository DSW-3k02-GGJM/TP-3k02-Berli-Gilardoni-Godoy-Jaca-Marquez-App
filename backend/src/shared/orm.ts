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
    clientUrl: 'mongodb+srv://conection:86X0nXAM1SKhSLUr@cluster0.yrhhwtw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
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