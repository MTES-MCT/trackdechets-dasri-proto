import { resetDatabase } from "integration-tests/helper";
import prisma from "src/prisma";
import { ErrorCode } from "../../../../common/errors";
import {
  formFactory,
  userFactory,
  userWithCompanyFactory
} from "../../../../__tests__/factories";
import makeClient from "../../../../__tests__/testClient";

const DELETE_FORM = `
mutation DeleteForm($id: ID!) {
  deleteForm(id: $id) {
    id
  }
}
`;
describe("Mutation.deleteForm", () => {
  afterEach(resetDatabase);

  it("should disallow unauthenticated user", async () => {
    const { mutate } = makeClient();

    const owner = await userFactory();
    const form = await formFactory({
      ownerId: owner.id,
      opt: { status: "DRAFT" }
    });

    const { errors } = await mutate(DELETE_FORM, {
      variables: { id: form.id }
    });

    expect(errors).toEqual([
      expect.objectContaining({
        message: "Vous n'êtes pas connecté.",
        extensions: expect.objectContaining({
          code: ErrorCode.UNAUTHENTICATED
        })
      })
    ]);
    const intactForm = await prisma.form.findOne({ where: { id: form.id } });
    expect(intactForm.isDeleted).toBe(false);
  });

  it("should disallow a user to delete a form they are not part of", async () => {
    const user = await userFactory();
    const owner = await userFactory();
    const form = await formFactory({
      ownerId: owner.id,
      opt: { status: "DRAFT" }
    });
    const { mutate } = makeClient(user);
    const { errors } = await mutate(DELETE_FORM, {
      variables: { id: form.id }
    });

    expect(errors).toEqual([
      expect.objectContaining({
        message:
          "Vous n'êtes pas autorisé à accéder à un bordereau sur lequel votre entreprise n'apparait pas.",
        extensions: expect.objectContaining({
          code: ErrorCode.FORBIDDEN
        })
      })
    ]);
    const intactForm = await prisma.form.findOne({ where: { id: form.id } });
    expect(intactForm.isDeleted).toBe(false);
  });

  it("should not be possible de delete a non draft form", async () => {
    const user = await userFactory();
    const form = await formFactory({
      ownerId: user.id,
      opt: { status: "SEALED" }
    });
    const { mutate } = makeClient(user);
    const { errors } = await mutate(DELETE_FORM, {
      variables: { id: form.id }
    });

    expect(errors).toEqual([
      expect.objectContaining({
        message: "Seuls les BSD à l'état de brouillon peuvent être supprimés",
        extensions: expect.objectContaining({
          code: ErrorCode.BAD_USER_INPUT
        })
      })
    ]);

    const intactForm = await prisma.form.findOne({ where: { id: form.id } });
    expect(intactForm.isDeleted).toBe(false);
  });

  it.each(["emitter", "trader", "recipient", "transporter"])(
    "should allow %p to soft delete a draft form",
    async role => {
      const { user, company } = await userWithCompanyFactory("MEMBER");
      const owner = await userFactory();
      const form = await formFactory({
        ownerId: owner.id,
        opt: { [`${role}CompanySiret`]: company.siret, status: "DRAFT" }
      });

      const { mutate } = makeClient(user);
      const { data } = await mutate(DELETE_FORM, {
        variables: { id: form.id }
      });

      expect(data.deleteForm.id).toBeTruthy();

      const deletedForm = await prisma.form.findOne({ where: { id: form.id } });
      expect(deletedForm.isDeleted).toBe(true);
    }
  );
});