import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
        HTMLElement: 'readonly',
        IntersectionObserver: 'readonly'
      }
    }
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'warn'
    }
  },
  {
    ignores: ['dist', 'node_modules', 'coverage', '*.config.js', '*.config.ts', 'env.d.ts']
  }
]