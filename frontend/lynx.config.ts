import { defineConfig } from "@lynx-js/rspeedy";
import { pluginQRCode } from "@lynx-js/qrcode-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },
  plugins: [
    pluginReactLynx({
      enableCSSInheritance: true,
      defaultDisplayLinear: false,
    }),
    pluginQRCode(),
    pluginSass(),
    pluginTypeCheck(),
  ],
  environments: {
    web: {},
    lynx: {},
  },
  output: {
    assetPrefix: process.env.NODE_ENV === 'production' 
      ? 'https://creatorcoin-ai.vercel.app/' 
      : undefined,
    cleanDistPath: true,
  },
  dev: {
    assetPrefix: true,
  },
});
