import { resetDatabase } from "../../../../../integration-tests/helper";
import {
  userWithCompanyFactory,
  companyFactory
} from "../../../../__tests__/factories";
import makeClient from "../../../../__tests__/testClient";
import { ErrorCode } from "../../../../common/errors";
import { bsdasriFactory, initialData } from "../../../__tests__/factories";

const GET_BSDASRIS = `
query bsDasris($siret: String!, $where: BsdasriWhere) {
  bsdasris(siret: $siret, where: $where) {
    totalCount
    pageInfo {
      startCursor
      endCursor
      hasNextPage
    }
    edges {

      node {
        id
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

    await bsdasriFactory({
      ownerId: user.id,
      opt: {
        ...initialData(company)
      }
    });

    const { errors } = await query(GET_BSDASRIS, {
      variables: { siret: company.siret }
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

  it("should forbid siret not belonging to user", async () => {
    const { user: otherUser, company } = await userWithCompanyFactory("MEMBER");
    const params = {
      ownerId: otherUser.id,
      opt: {
        ...initialData(company)
      }
    };
    await bsdasriFactory(params);

    const { user } = await userWithCompanyFactory("MEMBER");
    const { query } = makeClient(user);
    const { errors } = await query(GET_BSDASRIS, {
      variables: { siret: company.siret }
    });

    expect(errors).toEqual([
      expect.objectContaining({
        message: `Vous n'êtes pas membre de l'entreprise portant le siret "${company.siret}".`,
        extensions: expect.objectContaining({
          code: ErrorCode.FORBIDDEN
        })
      })
    ]);
  });

  it("should get user dasris", async () => {
    const { user, company } = await userWithCompanyFactory("MEMBER");
    const params = {
      ownerId: user.id,
      opt: {
        ...initialData(company)
      }
    };
    const dasri1 = await bsdasriFactory(params);
    const dasri2 = await bsdasriFactory(params);
    const dasri3 = await bsdasriFactory(params);

    const { query } = makeClient(user);

    const { data } = await query(GET_BSDASRIS, {
      variables: { siret: company.siret }
    });
    const ids = data.bsdasris.edges.map(edge => edge.node.id);
    expect(ids.length).toBe(3);

    expect(ids.includes(dasri1.id)).toBe(true);
    expect(ids.includes(dasri2.id)).toBe(true);
    expect(ids.includes(dasri3.id)).toBe(true);

    expect(data.bsdasris.totalCount).toBe(3);
    expect(data.bsdasris.pageInfo.startCursor).toBe(dasri3.id);
    expect(data.bsdasris.pageInfo.endCursor).toBe(dasri1.id);
    expect(data.bsdasris.pageInfo.hasNextPage).toBe(false);
  });

  it.only("should get filtered dasris", async () => {
    const { user, company } = await userWithCompanyFactory("MEMBER");
    const transporterCompany = await companyFactory();
    const recipientCompany = await companyFactory();

    const dasri1 = await bsdasriFactory({
      ownerId: user.id,
      opt: {
        ...initialData(company)
      }
    });
    const dasri2 = await bsdasriFactory({
      ownerId: user.id,
      opt: {
        ...initialData(company),
        transporterCompanySiret: transporterCompany.siret
      }
    });

    // let's create a dasri with specific recipient to filter on its siret
    const dasri3 = await bsdasriFactory({
      ownerId: user.id,
      opt: {
        ...initialData(company),
        recipientCompanySiret: recipientCompany.siret
      }
    });

    const { query } = makeClient(user);

    // retrieve dasris where transporter is otherCompany
    const { data: queryTransporter } = await query(GET_BSDASRIS, {
      variables: {
        siret: company.siret,
        where: { transporter: { company: { siret: transporterCompany.siret } } }
      }
    });
    const queryTransporterIds = queryTransporter.bsdasris.edges.map(
      edge => edge.node.id
    );

    expect(queryTransporterIds).toStrictEqual([dasri2.id]);

    // retrieve dasris where recipient is otherCompany
    const { data: queryRecipient } = await query(GET_BSDASRIS, {
      variables: {
        siret: company.siret,
        where: { recipient: { company: { siret: recipientCompany.siret } } }
      }
    });
    const queryRecipientIids = queryRecipient.bsdasris.edges.map(
      edge => edge.node.id
    );

    expect(queryRecipientIids).toStrictEqual([dasri3.id]);
  });
});
