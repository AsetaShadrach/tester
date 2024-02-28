import { DataSource } from 'typeorm';

const dataSourceConn = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "testEntityMigrations",
    synchronize: true,
    logging: true,
    entities: ["../src/entities/**/*{.js,.ts}"],
    subscribers: [],
    migrations: [],
})

const connToDS = async() => {
    try{
        await dataSourceConn.initialize();
        console.log("Data Source has been initialized!");
        return dataSourceConn;
    }catch(err){
        console.error("Error during Data Source initialization", err);        
    }
}

export const dataSource = connToDS();