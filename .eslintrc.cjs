module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'indent': ['error', 2, { SwitchCase: 1 }],
    'no-tabs': 'error',
    'camelcase': ['error', { properties: 'never', ignoreDestructuring: true }],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.config.*'],
};
