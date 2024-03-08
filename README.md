-- To add the entity packages from within a project
`cd` into the project folder then run `yarn add file:../project_orms`


TODO :: 
1. Scope roles and permissions
2. Use db transactions (Allow creation of multiple entities)

```
async createMany(users: User[]) {
  const queryRunner = this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(users[0]);
    await queryRunner.manager.save(users[1]);

    await queryRunner.commitTransaction();
  } catch (err) {
    // since we have errors lets rollback the changes we made
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release a queryRunner which was manually instantiated
    await queryRunner.release();
  }
}
```
3. Write tests for predeploy of the modules in the project ORM to confirm the migrations will work before publishing
4. Incase for example a status is missing, you can register it 
5. Add descriptions to inputs and objects
6. If email report has been selected , makesure the email recipients feild id not blank
7. For the filters add the mongoose prefixes for (gte,lte, like) etc
8. Convert all enums to small letters
9. Confirm foreign key filtering for singletons
10. Add is email verified or is active to tenats/users
11. Confirm streaming response from file reads
12. Fix get request option to factor in query param string
