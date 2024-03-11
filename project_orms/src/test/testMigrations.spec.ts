import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'testEntityMigrations',
  synchronize: true,
  logging: false,
  entities: ['../src/entities/**/*{.js,.ts}'],
  subscribers: [],
  migrations: [],
});

test('Should initialize the data in the DB', async () => {
  const sourceConn = await AppDataSource.initialize();
  console.log('====1', sourceConn.isInitialized);
  console.log('====40404', sourceConn.hasMetadata('Tenant'));
  expect(sourceConn.isInitialized).toBeTruthy();
  // (await sourceConn).query(`DROP TABLE Tenants`)
});

// test("Should initialize Tenant entity", async ()=>{
//     console.log("====2",(await sourceConn).options.entities)
//     console.log("====2",(await sourceConn).hasMetadata('Tenant'))
//     expect((await sourceConn).hasMetadata('Tenant')).toBeTruthy();
// });

// test("Should initialize User entity", async ()=>{
//     console.log("====3",(await sourceConn).hasMetadata('User'))
//     expect((await sourceConn).hasMetadata('User')).toBeTruthy();
// });

// test("Should initialize TestAccount entity", async ()=>{
//     console.log("====4",(await sourceConn).hasMetadata('TestAccount'))
//     expect((await sourceConn).hasMetadata('TestAccount')).toBeTruthy();
// });

// test("Should initialize Role entity", async ()=>{
//     console.log("====5",(await sourceConn).hasMetadata('Role'))
//     expect((await sourceConn).hasMetadata('Role')).toBeTruthy();
// });

// test("Should initialize Permission entity", async ()=>{
//     console.log("====6",(await sourceConn).hasMetadata('Permission'))
//     expect((await sourceConn).hasMetadata('Permission')).toBeTruthy();
// });
