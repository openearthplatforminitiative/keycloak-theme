import { preset } from "@openepi/react-ui";
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
    presets: [preset],
    // Whether to use css reset
    preflight: true,

    // Where to look for your css declarations
    include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

    // Files to exclude
    exclude: [],

    importMap: "@openepi/styled-system",

    // Useful for theme customization
    theme: {
        extend: {}
    },

    jsxFramework: "react",

    // The output directory for your css system
    outdir: "styled-system"
});
