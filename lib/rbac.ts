import { AppContext } from "./context";
import { CompanyRole } from "../app/generated/prisma/client";

export function checkRole(context: AppContext, allowedRoles: CompanyRole[]) {
  if (!context.role) return false;
  return allowedRoles.includes(context.role as CompanyRole);
}

export function requireRole(context: AppContext, allowedRoles: CompanyRole[]) {
  if (!checkRole(context, allowedRoles)) {
    throw new Error("Forbidden: Insufficient Role");
  }
}
