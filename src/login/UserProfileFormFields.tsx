import { useEffect, Fragment } from "react";
import { assert } from "keycloakify/tools/assert";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import {
  useUserProfileForm,
  getButtonToDisplayForMultivaluedAttributeField,
  type FormAction,
  type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute, KcContext } from "keycloakify/login/KcContext";
import type { I18n } from "keycloakify/login/i18n";
import { Field, FieldHelperText, FieldLabel, FieldRequiredIndicator, IconButton, Input, InputGroup } from "@openepi/react-ui";
import { Visibility, VisibilityOff } from "@openepi/icons";
import { VStack } from "@openepi/styled-system/jsx";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
  const { kcContext, i18n, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, kcClsx, AfterField } = props;

  const { advancedMsg } = i18n;

  const {
    formState: { formFieldStates, isFormSubmittable },
    dispatchFormAction
  } = useUserProfileForm({
    kcContext,
    i18n,
    doMakeUserConfirmPassword
  });

  useEffect(() => {
    onIsFormSubmittableValueChange(isFormSubmittable);
  }, [isFormSubmittable]);

  const groupNameRef = { current: "" };

  return (
    <VStack gap={4}>
      {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
        return (
          <Fragment key={attribute.name}>
            <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} />
            {BeforeField !== undefined && (
              <BeforeField
                attribute={attribute}
                dispatchFormAction={dispatchFormAction}
                displayableErrors={displayableErrors}
                valueOrValues={valueOrValues}
                kcClsx={kcClsx}
                i18n={i18n}
              />
            )}
            <Field
              w="full"
              required={attribute.required && displayableErrors.length > 0}
              style={{
                display: attribute.name === "password-confirm" && !doMakeUserConfirmPassword ? "none" : undefined
              }}
            >
              <FieldLabel htmlFor={attribute.name}>
                {advancedMsg(attribute.displayName ?? "")}
                <FieldRequiredIndicator />
              </FieldLabel>
              {attribute.annotations.inputHelperTextBefore !== undefined && (
                <div id={`form-help-text-before-${attribute.name}`} aria-live="polite">
                  {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                </div>
              )}
              <InputFieldByType
                attribute={attribute}
                valueOrValues={valueOrValues}
                displayableErrors={displayableErrors}
                dispatchFormAction={dispatchFormAction}
                i18n={i18n}
              />
              <FieldErrors attribute={attribute} displayableErrors={displayableErrors} fieldIndex={undefined} />
              {attribute.annotations.inputHelperTextAfter !== undefined && (
                <div id={`form-help-text-after-${attribute.name}`} aria-live="polite">
                  {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                </div>
              )}

              {AfterField !== undefined && (
                <AfterField
                  attribute={attribute}
                  dispatchFormAction={dispatchFormAction}
                  displayableErrors={displayableErrors}
                  valueOrValues={valueOrValues}
                  kcClsx={kcClsx}
                  i18n={i18n}
                />
              )}
              {/* NOTE: Downloading of html5DataAnnotations scripts is done in the useUserProfileForm hook */}
            </Field>
          </Fragment>
        );
      })}
    </VStack>
  );
}

function GroupLabel(props: {
  attribute: Attribute;
  groupNameRef: {
    current: string;
  };
  i18n: I18n;
}) {
  const { attribute, groupNameRef, i18n } = props;

  const { advancedMsg } = i18n;

  if (attribute.group?.name !== groupNameRef.current) {
    groupNameRef.current = attribute.group?.name ?? "";

    if (groupNameRef.current !== "") {
      assert(attribute.group !== undefined);

      return (
        <div {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}>
          {(() => {
            const groupDisplayHeader = attribute.group.displayHeader ?? "";
            const groupHeaderText = groupDisplayHeader !== "" ? advancedMsg(groupDisplayHeader) : attribute.group.name;

            return (
              <div>
                <label id={`header-${attribute.group.name}`}>{groupHeaderText}</label>
              </div>
            );
          })()}
          {(() => {
            const groupDisplayDescription = attribute.group.displayDescription ?? "";

            if (groupDisplayDescription !== "") {
              const groupDescriptionText = advancedMsg(groupDisplayDescription);

              return (
                <div>
                  <label id={`description-${attribute.group.name}`}>{groupDescriptionText}</label>
                </div>
              );
            }

            return null;
          })()}
        </div>
      );
    }
  }

  return null;
}

function FieldErrors(props: { attribute: Attribute; displayableErrors: FormFieldError[]; fieldIndex: number | undefined }) {
  const { attribute, fieldIndex } = props;

  const displayableErrors = props.displayableErrors.filter(error => error.fieldIndex === fieldIndex);

  if (displayableErrors.length === 0) {
    return null;
  }

  return (
    <FieldHelperText id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`} aria-live="polite">
      {displayableErrors
        .filter(error => error.fieldIndex === fieldIndex)
        .map(({ errorMessage }, i, arr) => (
          <Fragment key={i}>
            {errorMessage}
            {arr.length - 1 !== i && <br />}
          </Fragment>
        ))}
    </FieldHelperText>
  );
}

type InputFieldByTypeProps = {
  attribute: Attribute;
  valueOrValues: string | string[];
  displayableErrors: FormFieldError[];
  dispatchFormAction: React.Dispatch<FormAction>;
  i18n: I18n;
};

function InputFieldByType(props: InputFieldByTypeProps) {
  const { attribute, valueOrValues } = props;

  switch (attribute.annotations.inputType) {
    case "textarea":
      return <TextareaTag {...props} />;
    case "select":
    case "multiselect":
      return <SelectTag {...props} />;
    case "select-radiobuttons":
    case "multiselect-checkboxes":
      return <InputTagSelects {...props} />;
    default: {
      if (valueOrValues instanceof Array) {
        return (
          <>
            {valueOrValues.map((...[, i]) => (
              <InputTag key={i} {...props} fieldIndex={i} />
            ))}
          </>
        );
      }

      const inputNode = <InputTag {...props} fieldIndex={undefined} />;

      if (attribute.name === "password" || attribute.name === "password-confirm") {
        return <PasswordWrapper i18n={props.i18n} passwordInputId={attribute.name} inputProps={props} />;
      }

      return inputNode;
    }
  }
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; inputProps: InputFieldByTypeProps }) {
  const { i18n, passwordInputId, inputProps } = props;

  const { msgStr } = i18n;

  const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
    passwordInputId
  });

  return (
    <InputGroup
      variant="filled"
      rightComponent={
        <IconButton
          aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
          aria-controls={passwordInputId}
          variant="subtle"
          colorPalette="gray"
          size="xs"
          icon={isPasswordRevealed ? <Visibility /> : <VisibilityOff />}
          onClick={toggleIsPasswordRevealed}
        />
      }
    >
      <InputTag {...inputProps} fieldIndex={undefined} />
      {/* <Input
            id="password"
            name="password"
            autoComplete="current-password"
            // aria-invalid={messagesPerField.existsError("username", "password")}
            variant="unstyled"
            type={showPassword ? "text" : "password"}
            placeholder="Type here..."
        /> */}
    </InputGroup>
  );
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
  const { attribute, fieldIndex, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;

  const { advancedMsgStr } = i18n;

  const inputType = attribute.annotations.inputType?.startsWith("html5-")
    ? attribute.annotations.inputType.slice(6)
    : attribute.annotations.inputType ?? "text";

  return (
    <>
      <Input
        variant="filled"
        type={inputType}
        id={attribute.name}
        name={attribute.name}
        value={(() => {
          if (fieldIndex !== undefined) {
            assert(valueOrValues instanceof Array);
            return valueOrValues[fieldIndex];
          }

          assert(typeof valueOrValues === "string");

          return valueOrValues;
        })()}
        aria-invalid={displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined}
        disabled={attribute.readOnly}
        autoComplete={attribute.autocomplete}
        placeholder={
          attribute.annotations.inputTypePlaceholder === undefined ? undefined : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
        }
        pattern={attribute.annotations.inputTypePattern}
        size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
        maxLength={attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
        minLength={attribute.annotations.inputTypeMinlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMinlength}`)}
        max={attribute.annotations.inputTypeMax}
        min={attribute.annotations.inputTypeMin}
        step={attribute.annotations.inputTypeStep}
        {...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))}
        onChange={event =>
          dispatchFormAction({
            action: "update",
            name: attribute.name,
            valueOrValues: (() => {
              if (fieldIndex !== undefined) {
                assert(valueOrValues instanceof Array);

                return valueOrValues.map((value, i) => {
                  if (i === fieldIndex) {
                    return event.target.value;
                  }

                  return value;
                });
              }

              return event.target.value;
            })()
          })
        }
        onBlur={() =>
          dispatchFormAction({
            action: "focus lost",
            name: attribute.name,
            fieldIndex: fieldIndex
          })
        }
      />
      {(() => {
        if (fieldIndex === undefined) {
          return null;
        }

        assert(valueOrValues instanceof Array);

        const values = valueOrValues;

        return (
          <>
            <FieldErrors attribute={attribute} displayableErrors={displayableErrors} fieldIndex={fieldIndex} />
            <AddRemoveButtonsMultiValuedAttribute
              attribute={attribute}
              values={values}
              fieldIndex={fieldIndex}
              dispatchFormAction={dispatchFormAction}
              i18n={i18n}
            />
          </>
        );
      })()}
    </>
  );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
  attribute: Attribute;
  values: string[];
  fieldIndex: number;
  dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>;
  i18n: I18n;
}) {
  const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;

  const { msg } = i18n;

  const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({
    attribute,
    values,
    fieldIndex
  });

  const idPostfix = `-${attribute.name}-${fieldIndex + 1}`;

  return (
    <>
      {hasRemove && (
        <>
          <button
            id={`kc-remove${idPostfix}`}
            type="button"
            className="pf-c-button pf-m-inline pf-m-link"
            onClick={() =>
              dispatchFormAction({
                action: "update",
                name: attribute.name,
                valueOrValues: values.filter((_, i) => i !== fieldIndex)
              })
            }
          >
            {msg("remove")}
          </button>
          {hasAdd ? <>&nbsp;|&nbsp;</> : null}
        </>
      )}
      {hasAdd && (
        <button
          id={`kc-add${idPostfix}`}
          type="button"
          className="pf-c-button pf-m-inline pf-m-link"
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: [...values, ""]
            })
          }
        >
          {msg("addValue")}
        </button>
      )}
    </>
  );
}

function InputTagSelects(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, i18n, valueOrValues } = props;

  const { inputType } = (() => {
    const { inputType } = attribute.annotations;

    assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");

    switch (inputType) {
      case "select-radiobuttons":
        return {
          inputType: "radio"
        };
      case "multiselect-checkboxes":
        return {
          inputType: "checkbox"
        };
    }
  })();

  const options = (() => {
    walk: {
      const { inputOptionsFromValidation } = attribute.annotations;

      if (inputOptionsFromValidation === undefined) {
        break walk;
      }

      const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

      if (validator === undefined) {
        break walk;
      }

      if (validator.options === undefined) {
        break walk;
      }

      return validator.options;
    }

    return attribute.validators.options?.options ?? [];
  })();

  return (
    <>
      {options.map(option => (
        <div key={option}>
          <Input
            type={inputType}
            id={`${attribute.name}-${option}`}
            name={attribute.name}
            value={option}
            aria-invalid={props.displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
            onChange={event =>
              dispatchFormAction({
                action: "update",
                name: attribute.name,
                valueOrValues: (() => {
                  const isChecked = event.target.checked;

                  if (valueOrValues instanceof Array) {
                    const newValues = [...valueOrValues];

                    if (isChecked) {
                      newValues.push(option);
                    } else {
                      newValues.splice(newValues.indexOf(option), 1);
                    }

                    return newValues;
                  }

                  return event.target.checked ? option : "";
                })()
              })
            }
            onBlur={() =>
              dispatchFormAction({
                action: "focus lost",
                name: attribute.name,
                fieldIndex: undefined
              })
            }
          />
          <label htmlFor={`${attribute.name}-${option}`}>{inputLabel(i18n, attribute, option)}</label>
        </div>
      ))}
    </>
  );
}

function TextareaTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, displayableErrors, valueOrValues } = props;

  assert(typeof valueOrValues === "string");

  const value = valueOrValues;

  return (
    <textarea
      id={attribute.name}
      name={attribute.name}
      aria-invalid={displayableErrors.length !== 0}
      disabled={attribute.readOnly}
      cols={attribute.annotations.inputTypeCols === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeCols}`)}
      rows={attribute.annotations.inputTypeRows === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeRows}`)}
      maxLength={attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
      value={value}
      onChange={event =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: event.target.value
        })
      }
      onBlur={() =>
        dispatchFormAction({
          action: "focus lost",
          name: attribute.name,
          fieldIndex: undefined
        })
      }
    />
  );
}

function SelectTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues } = props;

  const isMultiple = attribute.annotations.inputType === "multiselect";

  return (
    <select
      id={attribute.name}
      name={attribute.name}
      aria-invalid={displayableErrors.length !== 0}
      disabled={attribute.readOnly}
      multiple={isMultiple}
      size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
      value={valueOrValues}
      onChange={event =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: (() => {
            if (isMultiple) {
              return Array.from(event.target.selectedOptions).map(option => option.value);
            }

            return event.target.value;
          })()
        })
      }
      onBlur={() =>
        dispatchFormAction({
          action: "focus lost",
          name: attribute.name,
          fieldIndex: undefined
        })
      }
    >
      {!isMultiple && <option value=""></option>}
      {(() => {
        const options = (() => {
          walk: {
            const { inputOptionsFromValidation } = attribute.annotations;

            if (inputOptionsFromValidation === undefined) {
              break walk;
            }

            assert(typeof inputOptionsFromValidation === "string");

            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

            if (validator === undefined) {
              break walk;
            }

            if (validator.options === undefined) {
              break walk;
            }

            return validator.options;
          }

          return attribute.validators.options?.options ?? [];
        })();

        return options.map(option => (
          <option key={option} value={option}>
            {inputLabel(i18n, attribute, option)}
          </option>
        ));
      })()}
    </select>
  );
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
  const { advancedMsg } = i18n;

  if (attribute.annotations.inputOptionLabels !== undefined) {
    const { inputOptionLabels } = attribute.annotations;

    return advancedMsg(inputOptionLabels[option] ?? option);
  }

  if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
    return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
  }

  return option;
}
