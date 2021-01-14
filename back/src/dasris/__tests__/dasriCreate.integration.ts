import { resetDatabase } from "integration-tests/helper";
import { ErrorCode } from "src/common/errors";
import { userFactory, userWithCompanyFactory } from "src/__tests__/factories";
import makeClient from "src/__tests__/testClient";

const CREATE_DASRId = `
mutation CreateDasri($vhuFormInput: VhuFormInput!) {
    createVhuForm(vhuFormInput: $vhuFormInput) {
      id
      recipient {
        company {
            siret
        }
      }
      emitter {
        company {
            siret
        }
      }
      transporter {
        company {
          siret
          name
          address
          contact
          mail
          phone
        }
      }
      wasteDetails {
        quantity
      }
    }
  }
`;
const DASRI_CREATE = `
mutation DasriCreate($input: DasriCreateInput!) {
  dasriCreate(dasriCreateInput: $input)  {
    id
    readableId
    customId
    status

    emitter {
      company {
        name
        siret
      }
      workSite {
        name
        address
        city
        postalCode
      }
    }
    emission {
      wasteCode
      wasteDetailsOnuCode
      wasteDetails {
        volume
        quantity
        quantityType
      }
      handedOverAt
      signedBy
      signedAt
    }

    transporter {
      company {
        siret
      }
    }
    transport {
      handedOverAt
      takenOverAt
      wasteDetails {
        quantity
        quantityType
        volume
      }
      wasteAcceptation {
        status
        refusalReason

        refusedQuantity
      }
      signedAt
      signedBy
    }
    recipient {
      company {
        name
        siret
      }
    }
    reception {
      wasteDetails {
        volume
        quantity
        quantityType
      }
      wasteAcceptation {
        status
        refusalReason
        refusedQuantity
      }
      signedBy
      signedAt
    }
    operation {
      processedAt
      processingOperation
      signedBy
      signedAt
    }
    createdAt
    updatedAt
  }
}
`;
describe("Mutation.createDasri", () => {
  afterEach(resetDatabase);

  it("should disallow unauthenticated user", async () => {
    const { mutate } = makeClient();
    const { errors } = await mutate(DASRI_CREATE, {
      variables: { input: {} }
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

  it("should disallow a user to create a dasri they are not part of", async () => {
    const user = await userFactory();

    const { mutate } = makeClient(user);
    const { errors } = await mutate(DASRI_CREATE, {
      variables: {
        input: {
          emitter: {
            company: {
              siret: "siret"
            }
          }
        }
      }
    });
    console.log(errors);
    expect(errors).toEqual([
      expect.objectContaining({
        message:
          "Vous ne pouvez pas créer un bordereau sur lequel votre entreprise n'apparaît pas",
        extensions: expect.objectContaining({
          code: ErrorCode.FORBIDDEN
        })
      })
    ]);
  });

  it("create a dasri with an emitter and a recipient", async () => {
    const { user, company } = await userWithCompanyFactory("MEMBER");

    const input = {
      emitter: {
        company: {
          siret: company.siret
        }
      },
      recipient: {
        company: {
          siret: "11111111111111"
        }
      }
    };
    const { mutate } = makeClient(user);
    const { data } = await mutate(DASRI_CREATE, {
      variables: {
        input
      }
    });

    expect(data.dasriCreate.recipient.company).toMatchObject(
      input.recipient.company
    );
  });
});
