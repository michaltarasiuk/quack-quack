import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  test: {
    passWithNoTests: true,
  },
  fmt: {
    ignorePatterns: [".next/**", "node_modules/**", "out/**", "dist/**", "build/**"],
  },
  lint: {
    plugins: ["eslint", "typescript", "unicorn", "react", "nextjs", "oxc"],
    categories: {
      correctness: "error",
    },
    ignorePatterns: ["node_modules/**", ".next/**", "out/**", "dist/**", "build/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
    },
  },
});
