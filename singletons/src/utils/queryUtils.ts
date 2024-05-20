import { Like, ILike, LessThanOrEqual, MoreThanOrEqual, IsNull } from 'typeorm';

// Use one filter composer function but vary the filter inputs per entity

// Filter for users, tenants, accounts, etc
export function composeUserTenantFilterParams(ftp: any) {
  let whereClause: any = {};
  const filters: any = {
    take: ftp.itemsPerPage,
    skip: (ftp.page - 1) * (ftp.itemsPerPage || 10),
  };

  if (ftp.params) {
    if (ftp.params.firstName) {
      whereClause.firstName = ILike(`%${ftp.params.firstName}%`);
    }
    if (ftp.params.lastName) {
      whereClause.lastName = ILike(`%${ftp.params.lastName}%`);
    }
    if (ftp.params.email) {
      whereClause.email = ILike(`%${ftp.params.email}%`);
    }
    if (ftp.params.phoneNumber) {
      whereClause.phoneNumber = ILike(`%${ftp.params.phoneNumber}%`);
    }
    if (ftp.params.idNumber) {
      whereClause.idNumber = ILike(`%${ftp.params.idNumber}%`);
    }
    if (ftp.params.idNumberType) {
      whereClause.idNumberType = ILike(`%${ftp.params.idNumberType}%`);
    }
    if (ftp.params.taxDocumentPin) {
      whereClause.taxDocumentPin = ILike(`%${ftp.params.taxDocumentPin}%`);
    }
    if (ftp.params.taxDocumentPinType) {
      whereClause.taxDocumentPinType = ILike(
        `%${ftp.params.taxDocumentPinType}%`,
      );
    }
    if (ftp.params.testAccountType) {
      whereClause.testAccountType = ILike(`%${ftp.params.testAccountType}%`);
    }
    if (ftp.params.role) {
      whereClause.role = ILike(`%${ftp.params.role}%`);
    }
    if (ftp.params.username) {
      whereClause.username = ILike(`%${ftp.params.username}%`);
    }
    if (ftp.params.tenantType) {
      whereClause.tenantType = ILike(`%${ftp.params.tenantType}%`);
    }

    // This will be a uuid therefore using Like instead of ILike. Unfortunately will imply full uuid string search
    if (ftp.params.lastUpdatedBy) {
      whereClause.lastUpdatedBy = Like(`%${ftp.params.lastUpdatedBy}%`);
    }

    // Allows for filter of users pending updates e.g for the case of maker-checker
    if (ftp.params.pendingUpdateJsonIsNull) {
      whereClause.pendingUpdateJson = IsNull();
    }

    // Confirm foreign key filtering
    if (ftp.params.role) {
      whereClause.role = Like(`%${ftp.params.role}%`);
    }
    if (ftp.params.permissions) {
      whereClause.permissions = Like(`%${ftp.params.permissions}%`);
    }
    if (ftp.params.tenant) {
      whereClause.tenant = Like(`%${ftp.params.tenant}%`);
    }

    // Numeric filters
    if (ftp.params.ageUpperLimit) {
      whereClause.age = LessThanOrEqual(`%${ftp.params.ageUpperLimit}%`);
    }
    if (ftp.params.ageLowerLimit) {
      whereClause.age = MoreThanOrEqual(`%${ftp.params.ageLowerLimit}%`);
    }
    if (ftp.params.createdAtUpperLimit) {
      whereClause.createdAt = LessThanOrEqual(
        `%${ftp.params.createdAtUpperLimit}%`,
      );
    }
    if (ftp.params.createdAtLowerLimit) {
      whereClause.createdAt = MoreThanOrEqual(
        `%${ftp.params.createdAtLowerLimit}%`,
      );
    }
    if (ftp.params.updatedAtUpperLimit) {
      whereClause.updatedAt = LessThanOrEqual(
        `%${ftp.params.updatedAtUpperLimit}%`,
      );
    }
    if (ftp.params.updatedAtLowerLimit) {
      whereClause.updatedAt = MoreThanOrEqual(
        `%${ftp.params.updatedAtLowerLimit}%`,
      );
    }

    // Boolean filters
    if (ftp.params.canBePassedAsDefault) {
      whereClause.canBePassedAsDefault = ftp.params.canBePassedAsDefault;
    }
    if (ftp.params.isApproved) {
      whereClause.isApproved = ftp.params.isApproved;
    }
    if (ftp.params.isActive) {
      whereClause.isActive = ftp.params.isActive;
    }
    if (ftp.params.isSuspended) {
      whereClause.isSuspended = ftp.params.isSuspended;
    }
    if (ftp.params.isEmailVerified) {
      whereClause.isEmailVerified = ftp.params.isEmailVerified;
    }
    // for soft deletes
    if (ftp.params.isDeleted) {
      whereClause.isDeleted = ftp.params.isDeleted;
    }
  }

  filters.where = whereClause;
  if (ftp.orderBy) {
    ftp.order = {
      [ftp.orderBy]: ftp.order.toUpperCase() || 'DESC',
    };
  }

  return filters;
}


// Filters for roles, permissions, configs etc.
export function composeSettingsFilterParams(ftp: any) {
  let whereClause: any = {};
  const filters: any = {
    take: ftp.itemsPerPage,
    skip: (ftp.page - 1) * (ftp.itemsPerPage || 10),
  };

  if (ftp.params) {
    if (ftp.params.permission) {
      whereClause.permission = ILike(`%${ftp.params.permission}%`);
    }
    if (ftp.params.permissionEffectGroup) {
      whereClause.permissionEffectGroup = ILike(`%${ftp.params.permissionEffectGroup}%`);
    }
    if (ftp.params.permissionScope) {
      whereClause.permissionScope = ILike(`%${ftp.params.permissionScope}%`);
    }
    if (ftp.params.isApproved) {
      whereClause.isApproved = ILike(`%${ftp.params.isApproved}%`);
    }
    if (ftp.params.idNumber) {
      whereClause.idNumber = ILike(`%${ftp.params.idNumber}%`);
    }
    if (ftp.params.idNumberType) {
      whereClause.idNumberType = ILike(`%${ftp.params.idNumberType}%`);
    }
    if (ftp.params.taxDocumentPin) {
      whereClause.taxDocumentPin = ILike(`%${ftp.params.taxDocumentPin}%`);
    }
    if (ftp.params.taxDocumentPinType) {
      whereClause.taxDocumentPinType = ILike(
        `%${ftp.params.taxDocumentPinType}%`,
      );
    }
    if (ftp.params.testAccountType) {
      whereClause.testAccountType = ILike(`%${ftp.params.testAccountType}%`);
    }
    if (ftp.params.role) {
      whereClause.role = ILike(`%${ftp.params.role}%`);
    }
    if (ftp.params.username) {
      whereClause.username = ILike(`%${ftp.params.username}%`);
    }
    if (ftp.params.tenantType) {
      whereClause.tenantType = ILike(`%${ftp.params.tenantType}%`);
    }

    // This will be a uuid therefore using Like instead of ILike. Unfortunately will imply full uuid string search
    if (ftp.params.lastUpdatedBy) {
      whereClause.lastUpdatedBy = Like(`%${ftp.params.lastUpdatedBy}%`);
    }

    // Allows for filter of users pending updates e.g for the case of maker-checker
    if (ftp.params.pendingUpdateJsonIsNull) {
      whereClause.pendingUpdateJson = IsNull();
    }

    // Confirm foreign key filtering
    if (ftp.params.role) {
      whereClause.role = Like(`%${ftp.params.role}%`);
    }
    if (ftp.params.permissions) {
      whereClause.permissions = Like(`%${ftp.params.permissions}%`);
    }
    if (ftp.params.tenant) {
      whereClause.tenant = Like(`%${ftp.params.tenant}%`);
    }

    // Numeric filters
    if (ftp.params.ageUpperLimit) {
      whereClause.age = LessThanOrEqual(`%${ftp.params.ageUpperLimit}%`);
    }
    if (ftp.params.ageLowerLimit) {
      whereClause.age = MoreThanOrEqual(`%${ftp.params.ageLowerLimit}%`);
    }
    if (ftp.params.createdAtUpperLimit) {
      whereClause.createdAt = LessThanOrEqual(
        `%${ftp.params.createdAtUpperLimit}%`,
      );
    }
    if (ftp.params.createdAtLowerLimit) {
      whereClause.createdAt = MoreThanOrEqual(
        `%${ftp.params.createdAtLowerLimit}%`,
      );
    }
    if (ftp.params.updatedAtUpperLimit) {
      whereClause.updatedAt = LessThanOrEqual(
        `%${ftp.params.updatedAtUpperLimit}%`,
      );
    }
    if (ftp.params.updatedAtLowerLimit) {
      whereClause.updatedAt = MoreThanOrEqual(
        `%${ftp.params.updatedAtLowerLimit}%`,
      );
    }

    // Boolean filters
    if (ftp.params.canBePassedAsDefault) {
      whereClause.canBePassedAsDefault = ftp.params.canBePassedAsDefault;
    }
    if (ftp.params.isApproved) {
      whereClause.isApproved = ftp.params.isApproved;
    }
    if (ftp.params.isActive) {
      whereClause.isActive = ftp.params.isActive;
    }
    if (ftp.params.isSuspended) {
      whereClause.isSuspended = ftp.params.isSuspended;
    }
    if (ftp.params.isEmailVerified) {
      whereClause.isEmailVerified = ftp.params.isEmailVerified;
    }
    // for soft deletes
    if (ftp.params.isDeleted) {
      whereClause.isDeleted = ftp.params.isDeleted;
    }
  }

  filters.where = whereClause;
  if (ftp.orderBy) {
    ftp.order = {
      [ftp.orderBy]: ftp.order.toUpperCase() || 'DESC',
    };
  }

  return filters;
}
