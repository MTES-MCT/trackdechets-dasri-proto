import { UserInputError } from "apollo-server-express";

export class BsdasriNotFound extends UserInputError {
  constructor(id: string) {
    super(`Le bordereau avec l'identifiant "${id}" n'existe pas.`);
  }
}

export class MissingIdOrReadableId extends UserInputError {
  constructor() {
    super("L'id doit être fourni pour identifier le bordereau.");
  }
}
