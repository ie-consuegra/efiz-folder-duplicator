module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    'googleappsscript/googleappsscript': true,
  },
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
  },
  plugins: [
    'googleappsscript',
  ],
};
