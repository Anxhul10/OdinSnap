// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
// @ts-check

import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  [globalIgnores(['./examples','./dist', '!*.ts'])]
);