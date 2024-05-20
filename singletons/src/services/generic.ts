import { Injectable } from '@nestjs/common';
import {
  PermissionEffectGroup,
  PermissionScope,
  TenantType,
  TestAccountTypes,
  UserTypes,
} from 'project_orms/dist/enums/singeltonsE';

@Injectable()
export class GenericService {
  constructor() {}

  async getEnumValues(optionName: string) {
    switch (optionName) {
      case 'TenantType':
        return Object.keys(TenantType);
      case 'TestAccountTypes':
        return Object.keys(TestAccountTypes);
      case 'UserTypes':
        return Object.keys(UserTypes);
      case 'PermissionEffectGroup':
        return Object.keys(PermissionEffectGroup);
      case 'PermissionScope':
        return Object.keys(PermissionScope);
      case 'UserTypes':
        return Object.keys(UserTypes);
    }
  }
}
