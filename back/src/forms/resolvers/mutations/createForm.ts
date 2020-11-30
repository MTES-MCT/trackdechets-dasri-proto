import { FormCreateInput, Status } from "@prisma/client";
import prisma from "src/prisma";
import { checkIsAuthenticated } from "../../../common/permissions";
import {
  MutationCreateFormArgs,
  ResolversParentTypes
} from "../../../generated/graphql/types";
import { GraphQLContext } from "../../../types";
import { getUserCompanies } from "../../../users/database";
import { MissingTempStorageFlag, NotFormContributor } from "../../errors";
import {
  expandFormFromDb,
  flattenFormInput,
  flattenTemporaryStorageDetailInput
} from "../../form-converter";
import { getReadableId } from "../../readable-id";
import { draftFormSchema } from "../../validation";

const createFormResolver = async (
  parent: ResolversParentTypes["Mutation"],
  { createFormInput }: MutationCreateFormArgs,
  context: GraphQLContext
) => {
  const user = checkIsAuthenticated(context);

  const {
    appendix2Forms,
    temporaryStorageDetail,
    ...formContent
  } = createFormInput;

  const formInputSirets = [
    formContent.emitter?.company?.siret,
    formContent.recipient?.company?.siret,
    formContent.trader?.company?.siret,
    formContent.transporter?.company?.siret,
    formContent.ecoOrganisme?.siret
  ];

  const userCompanies = await getUserCompanies(user.id);
  const userSirets = userCompanies.map(c => c.siret);
  if (!formInputSirets.some(siret => userSirets.includes(siret))) {
    throw new NotFormContributor();
  }

  const form = flattenFormInput(formContent);
  const formCreateInput: FormCreateInput = {
    ...form,
    readableId: await getReadableId(),
    owner: { connect: { id: user.id } },
    appendix2Forms: { connect: appendix2Forms }
  };

  await draftFormSchema.validate(formCreateInput);

  if (temporaryStorageDetail) {
    if (formContent.recipient?.isTempStorage !== true) {
      // The user is trying to set a temporary storage without
      // recipient.isTempStorage=true, throw error
      throw new MissingTempStorageFlag();
    }
    formCreateInput.temporaryStorageDetail = {
      create: flattenTemporaryStorageDetailInput(temporaryStorageDetail)
    };
  } else {
    if (formContent.recipient?.isTempStorage === true) {
      // Recipient is temp storage but no details provided
      // Create empty temporary storage details
      formCreateInput.temporaryStorageDetail = {
        create: {}
      };
    }
  }

  const newForm = await prisma.form.create({ data: formCreateInput });

  // create statuslog when and only when form is created
  await prisma.statusLog.create({
    data: {
      form: { connect: { id: newForm.id } },
      user: { connect: { id: context.user!.id } },
      status: newForm.status as Status,
      updatedFields: {},
      authType: user.auth,
      loggedAt: new Date()
    }
  });

  return expandFormFromDb(newForm);
};

export default createFormResolver;
