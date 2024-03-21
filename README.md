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
5. Confirm foreign key filtering for singletons
6. Add is email verified or is active to tenants/users
7. Confirm streaming response from file reads



???
/**
   * runConfigs --> {
   *    runSave ?
   *    cascadeResponse ?
   *    saveDocument ?
   *    performTestCaseAnalysis ?
   *    generateDocReport ?
   *    responseAnalysisLevel ? BASIC, PLAIN, DETAIL, FULL_DETAIL
   *    performResponseAnalysis ?
   *    reportDocFormart ? PDF and EXCEL
   * }
   *
   *
   * params --> {
   *    testType ?
   *    groupId ?
   *    description ?
   *    testCaseIds ? Ordered list to follow for TCs to execute
   *    valuesToCascade ? Values to pass from one function to the next eg. auth or entity IDs
   * }
   *
   * */