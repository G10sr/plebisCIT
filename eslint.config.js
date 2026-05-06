/**
 * CONFIGURACIÓN: ESLINT
 * 
 * Reglas de linting para mantener calidad de código.
 * 
 * Incluye:
 * - Recomendaciones de JavaScript (js.configs.recommended)
 * - Reglas para hooks de React
 * - Configuración para React Fast Refresh
 * - Soporte para JSX
 * 
 * Reglas personalizadas:
 * - no-unused-vars: Ignora variables que comienzan con mayúscula o _ (constantes/tipos)
 * 
 * Archivos ignorados:
 * - /dist (compilación final)
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
