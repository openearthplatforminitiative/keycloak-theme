import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Card, CardContent, CardBody, CardTitle } from "@openepi/react-ui";
import { HStack } from "@openepi/styled-system/jsx";

export default function LoginIdpLinkConfirm(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, idpAlias } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("confirmLinkIdpTitle")}>
            <form id="kc-register-form" action={url.loginAction} method="post">
                <HStack w="full" flexWrap="wrap" gap={4}>
                    <Card flex={1}>
                        <CardContent
                            /* @ts-expect-error-error */
                            as="button"
                            type="submit"
                            name="submitAction"
                            id="updateProfile"
                            value="updateProfile"
                        >
                            <CardBody w="full">
                                <CardTitle>{msg("confirmLinkIdpReviewProfile")}</CardTitle>
                            </CardBody>
                        </CardContent>
                    </Card>
                    <Card flex={1}>
                        <CardContent
                            /* @ts-expect-error-error */
                            as="button"
                            type="submit"
                            name="submitAction"
                            id="linkAccount"
                            value="linkAccount"
                        >
                            <CardBody w="full">
                                <CardTitle>{msg("confirmLinkIdpContinue", idpAlias)}</CardTitle>
                            </CardBody>
                        </CardContent>
                    </Card>
                </HStack>
            </form>
        </Template>
    );
}
