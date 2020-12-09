import { Dasri, User } from "@prisma/client";

/**
 * A Prisma Dasri with owner user type
 */
export interface FullDasri extends Dasri {
  owner: User;
}