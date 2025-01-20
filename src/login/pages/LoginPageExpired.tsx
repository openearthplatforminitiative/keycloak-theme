import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Card, CardBody, CardTitle, CardContent } from "@openepi/react-ui";
import { HStack } from "@openepi/styled-system/jsx";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("pageExpiredTitle")}>
            <HStack w="full" flexWrap="wrap" gap={4} alignItems="stretch">
                <Card flex={1}>
                    {/* @ts-expect-error-error */}
                    <CardContent id="instruction1" href={url.loginRestartFlowUrl}>
                        <CardBody>
                            <CardTitle>{msg("pageExpiredMsg1")}</CardTitle>
                        </CardBody>
                    </CardContent>
                </Card>
                <Card flex={1}>
                    {/* @ts-expect-error-error */}
                    <CardContent id="loginContinueLink" href={url.loginAction}>
                        <CardBody>
                            <CardTitle>{msg("pageExpiredMsg2")}</CardTitle>
                        </CardBody>
                    </CardContent>
                </Card>
            </HStack>
        </Template>
    );
}
