import { resetDatabase } from "../../../integration-tests/helper";
import { ErrorCode } from "../../common/errors";
import { userWithCompanyFactory } from "../../__tests__/factories";
import makeClient from "../../__tests__/testClient";
import { BsdasriStatus, WasteAcceptationStatus } from "@prisma/client";
import { bsdasriFactory } from "./factories";
import prisma from "../../prisma";

import { SIGN_DASRI, draftData, readyToTakeOverData } from "./signUtils";

describe("Mutation.signBsdasri transport", () => {
  afterEach(resetDatabase);

  it("should put transport signature on a SIGNED_BY_PRODUCER dasri", async () => {
    const {
      user: emitter,
      company: emitterCompany
    } = await userWithCompanyFactory("MEMBER");
    const {
      user: transporter,
      company: transporterCompany
    } = await userWithCompanyFactory("MEMBER");

    const dasri = await bsdasriFactory({
      ownerId: emitter.id,
      opt: {
        ...draftData(emitterCompany),
        ...readyToTakeOverData(transporterCompany),
        status: BsdasriStatus.SIGNED_BY_PRODUCER
      }
    });
    const { mutate } = makeClient(transporter); // transporter

    await mutate(SIGN_DASRI, {
      variables: {
        id: dasri.id,
        input: { type: "TRANSPORT", author: "Jimmy" }
      }
    });

    const readyTotakeOverDasri = await prisma.bsdasri.findUnique({
      where: { id: dasri.id }
    });
    expect(readyTotakeOverDasri.status).toEqual("SENT");
    expect(readyTotakeOverDasri.transportSignatureAuthor).toEqual("Jimmy");
    expect(readyTotakeOverDasri.transportSignatureDate).toBeTruthy();
    expect(readyTotakeOverDasri.transportSignatoryId).toEqual(transporter.id);
  });

  it("should put transport signature on an INITIAL dasri if allowed by emitter company", async () => {
    const {
      user: emitter,
      company: emitterCompany
    } = await userWithCompanyFactory("MEMBER", {
      allowDasriTakeOverWithoutSignature: true // company allow takeover without signature
    });

    const {
      user: transporter,
      company: transporterCompany
    } = await userWithCompanyFactory("MEMBER");

    const dasri = await bsdasriFactory({
      ownerId: emitter.id,
      opt: {
        ...draftData(emitterCompany),
        ...readyToTakeOverData(transporterCompany),
        status: BsdasriStatus.INITIAL
      }
    });
    const { mutate } = makeClient(transporter);

    await mutate(SIGN_DASRI, {
      variables: {
        id: dasri.id,
        input: { type: "TRANSPORT", author: "Jimmy" }
      }
    });

    const readyTotakeOverDasri = await prisma.bsdasri.findUnique({
      where: { id: dasri.id }
    });
    expect(readyTotakeOverDasri.status).toEqual("SENT");
    expect(readyTotakeOverDasri.transportSignatureAuthor).toEqual("Jimmy");
    expect(readyTotakeOverDasri.transportSignatureDate).toBeTruthy();
    expect(readyTotakeOverDasri.transportSignatoryId).toEqual(transporter.id);
  });

  it("should not put transport signature on an INITIAL dasri if not allowed by emitter company", async () => {
    const {
      user: emitter,
      company: emitterCompany
    } = await userWithCompanyFactory("MEMBER"); // company forbid takeover without signature

    const {
      user: transporter,
      company: transporterCompany
    } = await userWithCompanyFactory("MEMBER");

    let dasri = await bsdasriFactory({
      ownerId: emitter.id,
      opt: {
        ...draftData(emitterCompany),
        ...readyToTakeOverData(transporterCompany),
        status: BsdasriStatus.INITIAL
      }
    });
    const { mutate } = makeClient(transporter);

    const { errors } = await mutate(SIGN_DASRI, {
      variables: {
        id: dasri.id,
        input: { type: "TRANSPORT", author: "Jimmy" }
      }
    });

    expect(errors).toEqual([
      expect.objectContaining({
        message:
          "Erreur, l'émetteur n'a pas autorisé l'emport par le transporteur sans l'avoir préalablement signé",

        extensions: expect.objectContaining({
          code: ErrorCode.BAD_USER_INPUT
        })
      })
    ]);

    dasri = await prisma.bsdasri.findUnique({
      where: { id: dasri.id }
    });
    expect(dasri.status).toEqual("INITIAL"); // status did not change
  });

  it("should mark a dasri as refused when transporter acceptation is refused", async () => {
    const {
      user: emitter,
      company: emitterCompany
    } = await userWithCompanyFactory("MEMBER");
    const {
      user: transporter,
      company: transporterCompany
    } = await userWithCompanyFactory("MEMBER");

    const dasri = await bsdasriFactory({
      ownerId: emitter.id,
      opt: {
        ...draftData(emitterCompany),
        ...readyToTakeOverData(transporterCompany),
        transporterWasteAcceptationStatus: WasteAcceptationStatus.REFUSED,
        transporterWasteRefusalReason: "J'en veux pas",
        transporterWasteRefusedQuantity: 66,
        status: BsdasriStatus.SIGNED_BY_PRODUCER
      }
    });
    const { mutate } = makeClient(transporter); // transporter

    await mutate(SIGN_DASRI, {
      variables: {
        id: dasri.id,
        input: { type: "TRANSPORT", author: "Jimmy" }
      }
    });

    const readyTotakeOverDasri = await prisma.bsdasri.findUnique({
      where: { id: dasri.id }
    });
    expect(readyTotakeOverDasri.status).toEqual("REFUSED");
    expect(readyTotakeOverDasri.transportSignatureAuthor).toEqual("Jimmy");
    expect(readyTotakeOverDasri.transportSignatureDate).toBeTruthy();
    expect(readyTotakeOverDasri.transportSignatoryId).toEqual(transporter.id);
  });
});
