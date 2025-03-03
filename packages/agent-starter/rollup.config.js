import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";

const external = [
  "@xmtp/content-type-primitives",
  "@xmtp/content-type-text",
  "@xmtp/content-type-reaction",
  "@xmtp/content-type-reply",
  "@xmtp/content-type-remote-attachment",
  "@xmtp/content-type-read-receipt",
  "@xmtp/node-sdk",
  "@xmtp/proto",
  "@xmtp/node-bindings",
  "cross-fetch",
  "node-fetch",
  "node:path",
  "node:crypto",
  "viem",
  "dotenv",
  "viem/accounts",
  "node:fs/promises",
  "node:fs",
  "viem/chains",
  "dotenv/config",
];

const plugins = [
  typescript({
    declaration: false,
    declarationMap: false,
  }),
];

export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
      sourcemap: true,
    },
    plugins,
    external,
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs",
      format: "cjs",
      sourcemap: true,
    },
    plugins,
    external,
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
]);
