
import { resetDatabase } from "../../../../../integration-tests/helper";
import { userWithCompanyFactory } from "../../../../__tests__/factories";
import makeClient from "../../../../__tests__/testClient";
import { ErrorCode } from "../../../../common/errors";
import { bsdasriFactory, initialData } from "../../../__tests__/factories";

const GET_BSDASRIS = `
 
query bsDasris($siret: String, $where: BsdasriWhere) {
  bsdasris(siret: $siret, where: $where) {
    edges {

      node {
        id

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

          wasteDetails {
            onuCode
            volume
            quantity
            quantityType
          }
          handedOverAt
          signature {
            author
            date
          }
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
          signature {
            author
            date
          }
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
          signature {
            author
            date
          }
        }
        createdAt
        updatedAt
      }
    }
  }
}

`;

describe("Query.Bsdasris", () => {
  afterEach(resetDatabase);

  it("should disallow unauthenticated user", async () => {
    const { query } = makeClient();
    const { user, company } = await userWithCompanyFactory("MEMBER");
    const dasri = await bsdasriFactory({
      ownerId: user.id,
      opt: {
        ...initialData(company)
      }
    });

    const { errors } = await query(GET_BSDASRIS, {
      variables: { id: dasri.id }
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
})