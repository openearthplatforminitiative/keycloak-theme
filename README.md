# Note

This repo uses @openepi/react-ui, @openepi/styled-system and @openepi/icons
Since these repos are not yet available, you need to change package.json and refer to them locally

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

and add the code from the terminal to `KcPage.tsx`

To see your changes on save, use

```bash
npm run storyboard
```

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
