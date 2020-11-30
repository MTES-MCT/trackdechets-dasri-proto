import {
  Form,
  User,
  TemporaryStorageDetail,
  TransportSegment
} from "@prisma/client";

/**
 * A Prisma Form with linked objects
 */
export interface FullForm extends Form {
  owner: User;
  temporaryStorage: TemporaryStorageDetail;
  transportSegments: TransportSegment[];
}
