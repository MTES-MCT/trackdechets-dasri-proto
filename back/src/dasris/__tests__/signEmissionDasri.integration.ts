import { resetDatabase } from "../../../integration-tests/helper";
import { ErrorCode } from "../../common/errors";
import { userWithCompanyFactory } from "../../__tests__/factories";
import makeClient from "../../__tests__/testClient";
import { BsdasriStatus } from "@prisma/client";
import { bsdasriFactory } from "./factories";
import prisma from "../../prisma";

import { SIGN_DASRI, draftData } from "./signUtils";

describe("Mutation.signBsdasri emission", () => {
  afterEach(resetDatabase);

  it("should disallow unauthenticated user", async () => {
    const { user, company } = await userWithCompanyFactory("MEMBER");
    const dasri = await bsdasriFactory({
      ownerId: user.id,
      opt: {
        emitterCompanySiret: company.siret
      }
    });
    const { mutate } = makeClient(); // unauthenticated user
    const { errors } = await mutate(SIGN_DASRI, {
      variables: {
        id: dasri.id,
        input: { type: "EMISSION", author: "Marcel" }
      }
    });

    expect(errors).toEqual([
      expect.objectContaining({
        message: "Vous n'êtes pas connecté.",
        extensions: expect.objectContaining({
          code: ErrorCode.UNAUTHENTICATED
        })
      })
    ]);
  });

  it("a draft dasri should not be signed", async () => {
    const { user, company } = await userWithCompanyFactory("MEMBER");
    const dasri = await bsdasriFactory({
      ownerId: user.id,
      opt: {
        ...draftData(company),
        status: BsdasriStatus.INITIAL,
        isDraft: true
      }
    });
    const { mutate } = makeClient(user); // emitter

    const { errors } = await mutate(SIGN_DASRI, {
      variables: {
        id: dasri.id,
        input: { type: "EMISSION", author: "Marcel" }
      }
    });

    expect(errors).toEqual([
      expect.objectContaining({
        message: "Vous ne pouvez pas passer ce bordereau à l'état souhaité.",
        extensions: expect.objectContaining({
          code: ErrorCode.BAD_USER_INPUT
        })
      })
    ]);
  });

  it("should put emission signature on a dasri", async () => {
    const { user, company } = await userWithCompanyFactory("MEMBER");
    const dasri = await bsdasriFactory({
      ownerId: user.id,
      opt: { ...draftData(company), status: BsdasriStatus.INITIAL }
    });
    const { mutate } = makeClient(user); // emitter

    await mutate(SIGN_DASRI, {
      variables: {
        id: dasri.id,
        input: { type: "EMISSION", author: "Marcel" }
      }
    });

    const signedByTransporterDasri = await prisma.bsdasri.findUnique({
      where: { id: dasri.id }
    });
    expect(signedByTransporterDasri.status).toEqual("SIGNED_BY_PRODUCER");
    expect(signedByTransporterDasri.emissionSignatureAuthor).toEqual("Marcel");
    expect(signedByTransporterDasri.emissionSignatureDate).toBeTruthy();
    expect(signedByTransporterDasri.emissionSignatoryId).toEqual(user.id);
  });
});

 
describe("Mutation.signBsdasri emission with secret code", () => {
  afterEach(resetDatabase);

  it("should deny emission signature if secret code is incorrect", async () => {
    const { user, company } = await userWithCompanyFactory("MEMBER");
    const {
      user: transporter,
      company: transporterCompany
    } = await userWithCompanyFactory("MEMBER");

    let dasri = await bsdasriFactory({
      ownerId: user.id,
      opt: {
        ...draftData(company),
        status: BsdasriStatus.INITIAL,
        transporterCompanySiret: transporterCompany.siret
      }
    });
    const { mutate } = makeClient(transporter); // emitter

    const { errors } = await mutate(SIGN_DASRI, {
      variables: {
        id: dasri.id,
        input: {
          type: "EMISSION_WITH_SECRET_CODE",
          author: "Joe",
          securityCode: 9876 // should be 1234, factory default value
        }
      }
    });

    expect(errors).toEqual([
      expect.objectContaining({
        message: "Erreur, le code de sécurité est manquant ou invalide",
        extensions: expect.objectContaining({
          code: ErrorCode.BAD_USER_INPUT
        })
      })
    ]);
    dasri = await prisma.bsdasri.findUnique({
      where: { id: dasri.id }
    });
    expect(dasri.status).toEqual("INITIAL");
  });

  it.only("should put emission signature on a dasri when correct code is provided", async () => {
    const { user: emitter, company } = await userWithCompanyFactory("MEMBER");
    const {
      user: transporter,
      company: transporterCompany
    } = await userWithCompanyFactory("MEMBER");

    const dasri = await bsdasriFactory({
      ownerId: emitter.id,
      opt: {
        ...draftData(company),
        status: BsdasriStatus.INITIAL,
        transporterCompanySiret: transporterCompany.siret
      }
    });
    const { mutate } = makeClient(transporter); // emitter

  const res =   await mutate(SIGN_DASRI, {
      variables: {
        id: dasri.id,
        input: {
          type: "EMISSION_WITH_SECRET_CODE",
          author: "Marcel",
          securityCode: 1234
        }
      }
    });
    console.log()
    const readyTotakeOverDasri = await prisma.bsdasri.findUnique({
      where: { id: dasri.id }
    });
    expect(readyTotakeOverDasri.status).toEqual("SIGNED_BY_PRODUCER");
    expect(readyTotakeOverDasri.emissionSignatureAuthor).toEqual("Marcel");
    expect(readyTotakeOverDasri.emissionSignatureDate).toBeTruthy();
    expect(readyTotakeOverDasri.emissionSignatoryId).toEqual(transporter.id);
  });
});
