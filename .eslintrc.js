module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true,
    },
    "extends": [
        "airbnb-base"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
      'implicit-arrow-linebreak': 0,
      'no-param-reassign': 0,
      'comma-dangle': 0,
      'arrow-parens': ['error', 'as-needed'],
      'no-unused-expressions': 0,
    }
};
