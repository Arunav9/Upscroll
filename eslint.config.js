// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // react-hooks' React Compiler-oriented "recommended" set (pulled in by
      // eslint-config-expo) flags every `useRef(...).current` read as unsafe,
      // and flags async data-loading effects that setState after an await.
      // This app doesn't use the compiler yet, and both patterns are safe,
      // standard RN/React idioms used throughout — kept as warnings rather
      // than disabled outright so real issues stay visible.
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);
