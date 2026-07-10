import { PrismaBillingRepository } from "../modules/billing/infrastructure/prisma-billing.repository.js";
import { PermissionService } from "../modules/billing/application/permission.service.js";
import { GetMyBillingUseCase } from "../modules/billing/application/get-my-billing.usecase.js";
import { BillingController } from "../modules/billing/presentation/billing.controller.js";

const billingRepository = new PrismaBillingRepository();
const permissionService = new PermissionService();

const getMyBillingUseCase = new GetMyBillingUseCase(
  billingRepository,
  permissionService,
);

export const billingController = new BillingController(getMyBillingUseCase);