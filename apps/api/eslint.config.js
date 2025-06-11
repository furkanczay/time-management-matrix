import config from "@repo/eslint-config/base";

export default [
  ...config,
  {
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    ignores: ["dist/**", "node_modules/**", "src/generated/**"],
  },
];
