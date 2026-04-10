const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
    rules: {
      'arrow-parens': ['error', 'as-needed'],
      'comma-dangle': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-param-reassign': 'off',
      'no-unused-expressions': 'off',
    },
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
      },
    },
  },
];
