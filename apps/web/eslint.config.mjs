import config from "@repo/eslint-config/next-js";

export default [
  ...config,
  {
    ignores: [".next/**", "node_modules/**"],
  },
];
