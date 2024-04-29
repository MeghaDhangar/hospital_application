module.exports = {
   env: { browser: true, es2020: true },
   plugins: ['unused-imports'],
   extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
   ],
   parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
   },
   settings: { react: { version: '18.2' } },
   rules: {
      'unused-imports/no-unused-imports': 'error',
      'react/prop-types': 'off',
      warnings: 'off',
   },
}
