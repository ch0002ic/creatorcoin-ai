import { defineConfig } from "@lynx-js/rspeedy";
import { pluginQRCode } from "@lynx-js/qrcode-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
  // @ts-ignore - Source configuration is valid for Lynx framework
  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },
  plugins: [
    pluginReactLynx({
      enableCSSInheritance: false, // Disable to reduce complexity
      defaultDisplayLinear: true,  // Enable for better layout stability
    }),
    pluginQRCode(),
    pluginSass(),
    pluginTypeCheck(),
  ],
  environments: {
    web: {
      output: {
        assetPrefix: '/',
      },
    },
    lynx: {},
  },
  output: {
    assetPrefix: process.env.NODE_ENV === 'production' 
      ? 'https://creatorcoin-ai-frontend.vercel.app/' 
      : undefined,
    cleanDistPath: true,
  },
  dev: {
    assetPrefix: true,
  },
});
