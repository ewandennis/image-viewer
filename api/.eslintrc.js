module.exports = {
  env: {
    node: true
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script'
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  rules: {
    'max-len': ['error', { code: 120 }],
    'class-methods-use-this': 'off',
  }
};
