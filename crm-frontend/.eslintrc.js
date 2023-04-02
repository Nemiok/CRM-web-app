/* eslint-disable-next-line no-undef */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-alert': 0,
    'no-param-reassign': [2, { props: false }],
    'no-plusplus': 0,
    'no-iterator': 0,
    'no-restricted-syntax': [2, 'WithStatement'],
    'func-style': 0,
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
  },
};
