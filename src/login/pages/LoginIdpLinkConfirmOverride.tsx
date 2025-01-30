import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Card, CardBody, CardContent, CardTitle } from "@openepi/react-ui";
import { HStack } from "@openepi/styled-system/jsx";

export default function LoginIdpLinkConfirmOverride(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm-override.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes
  });

  const { url, idpDisplayName } = kcContext;

  const { msg } = i18n;

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("confirmOverrideIdpTitle")}>
      <form id="kc-register-form" action={url.loginAction} method="post">
        <HStack w="full" flexWrap="wrap" gap={4} alignItems="stretch">
          <Card flex={1}>
            {/* @ts-expect-error-error */}
            <CardContent id="loginRestartLink" tabIndex={0} href={url.loginRestartFlowUrl}>
              <CardBody>
                <CardTitle>{msg("pageExpiredMsg1")}</CardTitle>
              </CardBody>
            </CardContent>
          </Card>
          <Card flex={1}>
            <CardContent
              /* @ts-expect-error-error */
              as="button"
              tabIndex={0}
              type="submit"
              className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonBlockClass", "kcButtonLargeClass")}
              name="submitAction"
              id="confirmOverride"
              value="confirmOverride"
            >
              <CardBody>
                <CardTitle>{msg("confirmOverrideIdpContinue", idpDisplayName)}</CardTitle>
              </CardBody>
            </CardContent>
          </Card>
        </HStack>
      </form>
    </Template>
  );
}
