import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'dist-site/**',
      '.astro/**',
      'test-results/**',
      'playwright-report/**',
      'src/data/generated/**',
    ],
  },
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  { rules: { '@typescript-eslint/no-explicit-any': 'error' } },
];
