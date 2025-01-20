import { useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { NativeSelect, Text } from "@openepi/react-ui";
import { Box, HStack, VStack, styled } from "@openepi/styled-system/jsx";
import { Logo } from "../logos/openepi";
import { Token, token } from "@openepi/styled-system/tokens";
import { CheckCircleFill, ErrorFill, InfoFill, WarningFill } from "@openepi/icons";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    kcContext,
    i18n,
    doUseDefaultCss,
    children
  } = props;

  const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

  const { auth, url, message, isAppInitiatedAction } = kcContext;

  useEffect(() => {
    document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
  }, []);

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  if (!isReadyToRender) {
    return null;
  }

  // const [showPassword, setShowPassword] = useState(false);

  return (
    <VStack bg="#F6FBF4" display="flex" justify="center" alignItems="center" w="full" minH="full" py={8} px={4}>
      {/* <div id="kc-header">
                <div id="kc-header-wrapper">{msg("loginTitleHtml", realm.displayNameHtml)}</div>
        </div> */}
      <VStack maxW="616px" w="full" mx="auto" gap={4}>
        <styled.header w="full">
          <HStack justify="space-between" w="full" alignItems="start" mb={4}>
            <Logo />
            {enabledLanguages.length > 1 && (
              <NativeSelect
                flexShrink={1}
                size="sm"
                minW="auto"
                value={currentLanguage.languageTag}
                onChange={e => window.location.assign(e.target.selectedOptions[0].dataset.href!)}
              >
                {enabledLanguages.map(({ languageTag, label, href }) => (
                  <option key={languageTag} value={languageTag} data-href={href}>
                    {label}
                  </option>
                ))}
              </NativeSelect>
            )}
          </HStack>
          {(() =>
            !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
              <>
                {displayRequiredFields && <Text>{msg("requiredFields")} *</Text>}
                <Text as="h1" variant="h6">
                  {headerNode}
                </Text>
              </>
            ) : (
              <div id="kc-username">
                <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                  <div className="kc-login-tooltip">
                    <i></i>
                    <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                  </div>
                </a>
              </div>
            ))()}
        </styled.header>
        {/* @ts-expect-error-error */}
        <Box as="main" w="full">
          {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
          {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
            <>
              <HStack
                px={6}
                py={4}
                mb={4}
                rounded="lg"
                style={{
                  background: token(`colors.bg.${message.type}` as Token)
                }}
              >
                <Box textStyle="2xl">
                  {message.type === "error" && <ErrorFill />}
                  {message.type === "warning" && <WarningFill />}
                  {message.type === "info" && <InfoFill />}
                  {message.type === "success" && <CheckCircleFill />}
                </Box>
                <Text
                  variant="p"
                  dangerouslySetInnerHTML={{
                    __html: kcSanitize(message.summary)
                  }}
                ></Text>
              </HStack>
            </>
          )}
          {children}
          {auth !== undefined && auth.showTryAnotherWayLink && (
            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
              <div>
                <input type="hidden" name="tryAnotherWay" value="on" />

                <a
                  href="#"
                  id="try-another-way"
                  onClick={() => {
                    document.forms["kc-select-try-another-way-form" as never].submit();
                    return false;
                  }}
                >
                  {msg("doTryAnotherWay")}
                </a>
              </div>
            </form>
          )}
          {socialProvidersNode}
          {displayInfo && (
            <div id="kc-info">
              <div id="kc-info-wrapper">{infoNode}</div>
            </div>
          )}
        </Box>
      </VStack>
    </VStack>
  );
}
