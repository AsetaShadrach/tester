export enum TenantType {
  INDIVIDUAL = 'individual',
  ORGANISATION = 'organisation',
  APP = 'app', // e.g a scheduled app to run tests
}

export enum TestAccountTypes {
  INDIVIDUAL = 'individual',
  SOLE_PARTNERSHIP = 'sole_partnership',
  LIMITED_CO = 'limited_co',
  TESTER = 'tester',
}

export enum UserTypes {
  ADMIN = 'admin',
  DEV = 'dev',
  LIMITED_CO = 'limited_co',
}

export enum PermissionEffectGroup {
  BASIC = 'basic',
  TEST_ACCOUNT = 'test_account',
  TENANT = 'tenant',
  ORGANISATION = 'organisation',
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
}

export enum PermissionScope {
  GENERAL = 'general',
  SECURITY = 'security',
  NETWORK = 'network',
  USERS = 'users',
  TRANSACTIONS = 'transactions ',
  STORAGE = 'storage',
  PAYLOAD = 'payload',
  BILLING = 'billing',
  INFRASTRUCTURE = 'infrastructure',
  DEVICES = 'devices',
  LOGS = 'logs',
  PIPELINES = 'pipelines',
  CI_CD = 'ci_cd',
  ML_AI = 'ml_ai',
  DB = 'db',
  REPORTS = 'reports',
}
