import { UserInputError, ForbiddenError } from "apollo-server-express";

export class DasriNotFound extends UserInputError {
  constructor(id: string) {
    super(`Le bordereau avec l'identifiant "${id}" n'existe pas.`);
  }
}

export class MissingIdOrReadableId extends UserInputError {
  constructor() {
    super(
      "L'id ou le readableId doit être fourni pour identifier le bordereau."
    );
  }
}

export class NotDasriContributor extends ForbiddenError {
  constructor() {
    super(
      "Vous n'êtes pas autorisé à accéder à un bordereau sur lequel votre entreprise n'apparait pas."
    );
  }
}
