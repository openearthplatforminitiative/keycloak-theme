import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Card, CardBody, CardTitle, CardContent, Text } from "@openepi/react-ui";
import { HStack } from "@openepi/styled-system/jsx";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { message, client, skipLink } = kcContext;

  const { msg } = i18n;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg("errorTitle")}
    >
      <Text dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
      {!skipLink && client !== undefined && client.baseUrl !== undefined && (
        <HStack w="full" flexWrap="wrap" gap={4} mt={4}>
          <Card flex={1}>
            {/* @ts-expect-error-error */}
            <CardContent tabIndex={0} id="backToApplication" href={client.baseUrl}>
              <CardBody>
                <CardTitle>{msg("backToApplication")}</CardTitle>
              </CardBody>
            </CardContent>
          </Card>
        </HStack>
      )}
    </Template>
  );
}
