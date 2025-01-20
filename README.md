# NOTE

`@openepi/react-ui`, `@openepi/icons` and `@openepi/styled-system` is not available yet as npm packages.
Therefore, you have to link to them locally. This can be done like this:

```bash
npm install --save <path_to_repo>/frontend-packages/packages/react-ui
npm install --save <path_to_repo>/frontend-packages/packages/icons
npm install --save <path_to_repo>/frontend-packages/packages/styled-system
```

# Quick start

```bash
npm install
npm run storyboard
```

# Documentation

[Documentation](https://docs.keycloakify.dev/)

# When developing

If you want to add a new page to customize, use

```bash
npx keycloakify add-story
npx keycloakify eject-page
```

and add the code from the terminal to `KcPage.tsx`. We want to save the original file, so create a copy of the file and add `__` in for to indicate it is not in use.

### Outside keycloak

To see your changes on save, use

```bash
npm run storyboard
```

### Inside keycloak

You can also use it inside a test keycloak using

```bash
npx keycloakify start-keycloak
```

# Deploy

```bash
npm run build-keycloak-theme
docker buildx build --platform linux/amd64 --tag ghcr.io/openearthplatforminitiative/keycloak-theme:latest --push .
```

If you want to create a test build, replace `:latest` with e.g. `:test`
