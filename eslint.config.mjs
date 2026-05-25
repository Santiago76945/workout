import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
    {
        ignores: [
            ".next/**",
            "node_modules/**",
            "out/**",
            "dist/**",
            "scripts/**",
            "next-env.d.ts"
        ]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir
            },
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        plugins: {
            "@next/next": nextPlugin,
            "react-hooks": reactHooks
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
            ...reactHooks.configs.recommended.rules,

            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                {
                    prefer: "type-imports"
                }
            ]
        }
    }
);