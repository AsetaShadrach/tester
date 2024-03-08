import { FilterTestCasesParams } from 'project_orms/dist/inputs/testCaseIn';
import { ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export function composeTestCaseFilterParams(fPs: FilterTestCasesParams) {
  const whereClause: any = {};

  const filter: any = {
    take: fPs.itemsPerPage,
    skip: (fPs.page - 1) * (fPs.itemsPerPage || 10),
  };

  if (fPs.params) {
    if (fPs.orderBy) {
      filter.order = {
        [fPs.orderBy]: fPs.order.toUpperCase() || 'DESC',
      };
    }

    if (fPs.params.testCase) {
      whereClause.testCase = ILike(`%${fPs.params.testCase}%`);
    }
    if (fPs.params.createdBy) {
      whereClause.createdBy = ILike(`%${fPs.params.createdBy}%`);
    }
    if (fPs.params.description) {
      whereClause.description = ILike(`%${fPs.params.description}%`);
    }
    if (fPs.params.groupId) {
      whereClause.groupId = ILike(`%${fPs.params.groupId}%`);
    }
    if (fPs.params.testType) {
      whereClause.id = ILike(`%${fPs.params.testType}%`);
    }
    if (fPs.params.runAndSave) {
      whereClause.runAndSave = ILike(`%${fPs.params.runAndSave}%`);
    }

    // Confirm if this works for lists/Arrays
    if (fPs.params.testReportRecipients) {
      whereClause.testReportRecipients = ILike(
        `%${fPs.params.testReportRecipients}%`,
      );
    }

    if (fPs.params.retryAfterSuccess) {
      whereClause.retryAfterSuccess = fPs.params.retryAfterSuccess;
    }

    if (fPs.params.status) {
      whereClause.status = ILike(`%${fPs.params.status}%`);
    }

    // Numerical filters
    // retryMaxAttempts
    if (fPs.params.retryMaxAttemptsUpperLimit) {
      whereClause.retryMaxAttempts = LessThanOrEqual(
        fPs.params.retryMaxAttemptsUpperLimit,
      );
    }
    if (fPs.params.retryMaxAttemptsLowerLimit) {
      whereClause.retryMaxAttempts = MoreThanOrEqual(
        fPs.params.retryMaxAttemptsLowerLimit,
      );
    }
    // retryAttempts
    if (fPs.params.retryAttemptsUpperLimit) {
      whereClause.retryAttempts = LessThanOrEqual(
        fPs.params.retryAttemptsUpperLimit,
      );
    }
    if (fPs.params.retryAttemptsLowerLimit) {
      whereClause.retryAttempts = MoreThanOrEqual(
        fPs.params.retryAttemptsLowerLimit,
      );
    }
    // retryInterval
    if (fPs.params.retryIntervalsUpperLimit) {
      whereClause.retryIntervals = LessThanOrEqual(
        fPs.params.retryIntervalsUpperLimit,
      );
    }
    if (fPs.params.retryIntervalsLowerLimit) {
      whereClause.retryIntervals = MoreThanOrEqual(
        fPs.params.retryIntervalsLowerLimit,
      );
    }
    // createdAt
    if (fPs.params.createdAtUpperLimit) {
      whereClause.createdAt = LessThanOrEqual(fPs.params.createdAtUpperLimit);
    }
    if (fPs.params.createdAtLowerLimit) {
      whereClause.createdAt = MoreThanOrEqual(fPs.params.createdAtLowerLimit);
    }
    // updatedAt
    if (fPs.params.updatedAtUpperLimit) {
      whereClause.updatedAt = LessThanOrEqual(fPs.params.updatedAtUpperLimit);
    }
    if (fPs.params.updatedAtLowerLimit) {
      whereClause.updatedAt = MoreThanOrEqual(fPs.params.updatedAtLowerLimit);
    }

    filter.where = whereClause;
    /// Refine for RequestDetailsFilter /// Handle the JSON filtering
  }

  return filter;
}
