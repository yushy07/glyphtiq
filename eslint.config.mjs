import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "drizzle/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
