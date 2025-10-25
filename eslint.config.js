import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

import unicorn from 'eslint-plugin-unicorn'
import perfectionist from 'eslint-plugin-perfectionist'
import functional from 'eslint-plugin-functional'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'functional/no-expression-statements': 'off',
      'functional/no-return-void': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.app.json',
      },
    },
    plugins: {
      unicorn,
      perfectionist,
      functional,
    },
    rules: {
      semi: ['error', 'always'],
      ...unicorn.configs.recommended.rules,
      ...perfectionist.configs['recommended-natural'].rules,
      ...functional.configs.recommended.rules,
      'functional/functional-parameters': 'off',
      'functional/no-return-void': 'off',
      'functional/no-expression-statements': 'off',
      // Allow common abbreviations like 'utils'
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            utils: true,
            props: true,
            Props: true,
            ref: true,
            param: true,
            params: true,
            args: true,
            env: true,
            fn: true,
            dev: true,
            prod: true,
            config: true,
            req: true,
            res: true,
            err: true,
            cb: true,
            ctx: true
          }
        }
      ],
    },
  },
])
