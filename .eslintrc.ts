module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {},
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        moduleDirectory: ['node_modules'],
      },
    },
  },
};
