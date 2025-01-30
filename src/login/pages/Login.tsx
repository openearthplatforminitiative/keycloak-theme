import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Icon, CardTitle, Card, CardBody, CardContent } from "@openepi/react-ui";
import { Grid, GridItem, HStack } from "@openepi/styled-system/jsx";
import { getProviderLogo, getProviderOrder } from "../../components/ssoProviders";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template } = props;

  const { social, realm, registrationDisabled, messagesPerField } = kcContext;

  const { msg } = i18n;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      displayMessage={!messagesPerField.existsError("username", "password")}
      headerNode={msg("loginAccountTitle")}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      infoNode={<></>}
      socialProvidersNode={
        <>
          {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
            <Grid
              gridTemplateColumns={{
                base: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)"
              }}
              gap={4}
            >
              {social.providers.map((...[p]) => (
                <GridItem key={p.alias}>
                  <Card
                    external
                    id={`social-${p.alias} ${p.displayName} ${p.providerId}`}
                    w="full"
                    maxW="full"
                    flexGrow={1}
                    order={getProviderOrder(p.providerId)}
                  >
                    {/* @ts-expect-error-error */}
                    <CardContent tabIndex={0} href={p.loginUrl}>
                      <CardBody w="full">
                        <HStack>
                          <Icon textStyle="3xl">{getProviderLogo(p.alias)}</Icon>
                          <CardTitle external>
                            <span>
                              Sign in with <span dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }} />
                            </span>
                          </CardTitle>
                        </HStack>
                      </CardBody>
                    </CardContent>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          )}
        </>
      }
    >
      <div></div>
      {/* {realm.password && (
                <Box
                    as="form"
                    mb={4}
                    id="kc-form-login"
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    action={url.loginAction}
                    method="post"
                >
                    {!usernameHidden && (
                        <Field required w="full" invalid={messagesPerField.existsError("username", "password")}>
                            <FieldLabel htmlFor="username">
                                {!realm.loginWithEmailAllowed
                                    ? msg("username")
                                    : !realm.registrationEmailAsUsername
                                      ? msg("usernameOrEmail")
                                      : msg("email")}
                                <FieldRequiredIndicator>*</FieldRequiredIndicator>
                            </FieldLabel>
                            <Input
                                variant="filled"
                                id="username"
                                name="username"
                                defaultValue={login.username ?? ""}
                                type="text"
                                autoFocus
                                autoComplete="username"
                                aria-invalid={messagesPerField.existsError("username", "password")}
                            />
                            <FieldErrorText
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                }}
                            />
                        </Field>
                    )}
                    <Field required w="full">
                        <FieldLabel>
                            {msg("password")}
                            <FieldRequiredIndicator>*</FieldRequiredIndicator>
                        </FieldLabel>
                        <InputGroup
                            variant="filled"
                            rightComponent={
                                <IconButton
                                    aria-label={msgStr(showPassword ? "hidePassword" : "showPassword")}
                                    aria-controls={"password"}
                                    variant="subtle"
                                    colorPalette="gray"
                                    size="xs"
                                    icon={showPassword ? <Visibility /> : <VisibilityOff />}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            }
                        >
                            <Input
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                // aria-invalid={messagesPerField.existsError("username", "password")}
                                variant="unstyled"
                                type={showPassword ? "text" : "password"}
                                placeholder="Type here..."
                            />
                        </InputGroup>
                        <FieldErrorText
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                            }}
                        />
                    </Field>

                    <HStack my={2}>
                        <div id="kc-form-options">
                            {realm.rememberMe && !usernameHidden && (
                                <div className="checkbox">
                                    <label>
                                        <input tabIndex={5} id="rememberMe" name="rememberMe" type="checkbox" defaultChecked={!!login.rememberMe} />{" "}
                                        {msg("rememberMe")}
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            {realm.resetPasswordAllowed && (
                                <span>
                                    <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                                        {msg("doForgotPassword")}
                                    </a>
                                </span>
                            )}
                        </div>
                    </HStack>

                    <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                    <Button
                        as="input"
                        tabIndex={7}
                        disabled={isLoginButtonDisabled}
                        className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                        name="login"
                        id="kc-login"
                        type="submit"
                        value={msgStr("doLogIn")}
                    />
                </Box>
            )} */}
    </Template>
  );
}
