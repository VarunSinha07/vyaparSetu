import prisma from "@/lib/prisma";

export async function logAudit({
  companyId,
  userId,
  action,
  entity,
  entityId,
  metadata,
}: {
  companyId: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: any;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action,
        entity,
        entityId,
        metadata: metadata || {},
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Don't throw, as audit logging failure shouldn't necessarily block the action (or maybe it should? strict security says yes, but for now we log error)
  }
}
