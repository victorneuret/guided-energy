import baseConfig, {
  restrictEnvAccess,
} from "@guided-energy/eslint-config/base";
import nextjsConfig from "@guided-energy/eslint-config/nextjs";
import reactConfig from "@guided-energy/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
