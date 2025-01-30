import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@openepi/react-ui";
import { HStack, styled } from "@openepi/styled-system/jsx";

type IdpReviewUserProfileProps = PageProps<Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>, I18n> & {
  UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
  doMakeUserConfirmPassword: boolean;
};

export default function IdpReviewUserProfile(props: IdpReviewUserProfileProps) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes
  });

  const { msg, msgStr } = i18n;

  const { url, messagesPerField } = kcContext;

  const [isFomSubmittable, setIsFomSubmittable] = useState(false);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={messagesPerField.exists("global")}
      displayRequiredFields
      headerNode={msg("loginIdpReviewProfileTitle")}
    >
      <form id="kc-idp-review-profile-form" action={url.loginAction} method="post">
        <UserProfileFormFields
          kcContext={kcContext}
          i18n={i18n}
          onIsFormSubmittableValueChange={setIsFomSubmittable}
          kcClsx={kcClsx}
          doMakeUserConfirmPassword={doMakeUserConfirmPassword}
        />
        <HStack justify="end" mt={4}>
          <Button asChild>
            <styled.input type="submit" value={msgStr("doSubmit")} tabIndex={0} disabled={!isFomSubmittable} />
          </Button>
        </HStack>
      </form>
    </Template>
  );
}
