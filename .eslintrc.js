module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },

  plugins: ['react', 'mongodb'],
  ignorePatterns: ['src/seed/'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'mongodb/no-replace': 0,
    'no-unused-vars': [
      'error',
      {
        args: 'none',
      },
    ],
  },
};
