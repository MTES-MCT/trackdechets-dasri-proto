import { useMutation, useQuery } from "@apollo/client";
import cogoToast from "cogo-toast";
import { Formik, setNestedObjectValues } from "formik";
import React, {
  Children,
  createElement,
  ReactElement,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useHistory, useParams, generatePath } from "react-router-dom";

import { InlineError } from "common/components/Error";
import { updateApolloCache } from "common/helper";

import initialState from "../dasri-initial-state";
import {
  Query,
  QueryBsdasriArgs,
  Mutation,
  MutationCreateBsdasriArgs,
  MutationUpdateBsdasriArgs,
  BsdasriCreateInput,
} from "generated/graphql/types";
import { dasriSchema } from "../schema";
import { DASRI_GET, DASRI_CREATE, DASRI_UPDATE } from "./queries";
import { IStepContainerProps, Step } from "./Step";
import routes from "common/routes";
import "common/components/WizardStepList.scss";
import "./StepList.scss";

interface IProps {
  children: ReactElement<IStepContainerProps>[];
  bsdId?: string;
}
export default function StepList(props: IProps) {
  const { siret } = useParams<{ siret: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = props.children.length - 1;
  const history = useHistory();

  const { loading, error, data } = useQuery<
    Pick<Query, "bsdasri">,
    QueryBsdasriArgs
  >(DASRI_GET, {
    variables: {
      id: props.bsdId!,
     
    },
    skip: !props.bsdId,
    fetchPolicy: "network-only",
  });

  const formState = useMemo(
    () => getComputedState(initialState, data?.bsdasri),
    [data]
  );

  const [dasriCreate] = useMutation<
    Pick<Mutation, "createBsdasri">,
    MutationCreateBsdasriArgs
  >(DASRI_CREATE, {
    update: (store, { data }) => {
      if (!data?.createBsdasri) {
        return;
      }
    },
  });

  const [dasriUpdate] = useMutation<
    Pick<Mutation, "updateBsdasri">,
    MutationUpdateBsdasriArgs
  >(DASRI_UPDATE, {
    update: (store, { data }) => {},
  });

  useEffect(() => window.scrollTo(0, 0), [currentStep]);

  // When we edit a draft we want to automatically display on error on init
  const formikForm: any = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formikForm.current) {
        const { touched, values, setTouched } = formikForm.current;
        if (Object.keys(touched).length === 0 && values.id != null) {
          setTouched(setNestedObjectValues(values, true));
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  });

  const children = Children.map(props.children, (child, index) => {
    return createElement(
      Step,
      {
        isActive: index === currentStep,
        displayPrevious: currentStep > 0,
        displayNext: currentStep < totalSteps,
        displaySubmit: currentStep === totalSteps,
        goToPreviousStep: () => setCurrentStep(currentStep - 1),
        goToNextStep: () => setCurrentStep(currentStep + 1),
        formId: props.bsdId,
      },
      child
    );
  });

  if (loading) return <p>Chargement...</p>;
  if (error) return <InlineError apolloError={error} />;

  return (
    <div>
      <ul className="step-header">
        {Children.map(props.children, (child, index) => (
          <li
            className={
              index === currentStep
                ? "is-active"
                : currentStep > index
                ? "is-complete"
                : ""
            }
            onClick={() => setCurrentStep(index)}
          >
            <span>{child.props.title}</span>
          </li>
        ))}
      </ul>
      <div className="step-content">
        <Formik<BsdasriCreateInput>
          innerRef={formikForm}
          initialValues={formState}
          onSubmit={() => Promise.resolve()}
        >
          {({ values }) => {
            return (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  // As we want to be able to save draft, we skip validation on submit
                  // and don't use the classic Formik mechanism

                  const { ...rest } = values;
                  const formInput = {
                    ...rest,
                  };

                  const historyCallback = (siret: string) =>
                    history.push(
                      generatePath(routes.dashboard.dasris.drafts, {
                        siret,
                      })
                    );
                  const errCallback = err =>
                    err.graphQLErrors.map(err =>
                      cogoToast.error(err.message, { hideAfter: 7 })
                    );

                  !!props?.bsdId
                    ? dasriUpdate({
                        variables: {
                          bsdasriUpdateInput: { id: props.bsdId, ...formInput },
                        },
                      })
                        .then(_ => historyCallback(siret))
                        .catch(err => {
                          errCallback(err);
                        })
                    : dasriCreate({
                        variables: { bsdasriCreateInput: formInput },
                      })
                        .then(_ => historyCallback(siret))

                        .catch(err => {
                          errCallback(err);
                        });

                  return false;
                }}
              >
                <div
                  onKeyPress={e => {
                    // Disable submit on Enter key press
                    // We prevent it from bubbling further
                    if (e.key === "Enter") {
                      e.stopPropagation();
                    }
                  }}
                >
                  {children}
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

/**
 * Construct the form state by merging initialState and the actual form.
 * The actual form may include properties that do not belong to the form.
 * If we keep them in the form state they will break the mutation validation.
 * To avoid that, we make sure that every properties we keep is a property contained in initial state.
 *
 * @param initialState what an empty Form is
 * @param actualForm the actual form
 */
export function getComputedState(initialState, actualForm) {
  if (!actualForm) {
    return initialState;
  }

  const startingObject = actualForm.id ? { id: actualForm.id } : {};

  return Object.keys(initialState).reduce((prev, curKey) => {
    const initialValue = initialState[curKey];
    if (
      typeof initialValue === "object" &&
      initialValue !== null &&
      !(initialValue instanceof Array)
    ) {
      prev[curKey] = getComputedState(initialValue, actualForm[curKey]);
    } else {
      prev[curKey] = actualForm[curKey] ?? initialValue;
    }

    return prev;
  }, startingObject);
}
