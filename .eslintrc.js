module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    // Regras específicas para o projeto
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',

    // Regras menos rigorosas para produção
    '@next/next/no-img-element': 'warn',
    '@next/next/no-html-link-for-pages': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/alt-text': 'warn',
  },
  ignorePatterns: ['node_modules/', '.next/', 'out/', 'build/', 'dist/', '*.config.js', '*.config.mjs'],
};
