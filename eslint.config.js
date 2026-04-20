// ESLint flat config — Step A5 piano qualità.
//
// Nota: `no-undef` è disabilitato perché ridondante con TypeScript checkJs
// (vedi tsconfig.json + js/globals.d.ts). Le regole qui sono complementari:
// si concentrano su safety/style che TS non copre.

import js from '@eslint/js';
import globals from 'globals';

export default [
  // Ignore patterns (sostituisce .eslintignore della v8)
  {
    ignores: [
      'node_modules/**',
      'presets.js',          // file generato compresso
      'gen_mapping.js',      // tool one-shot
      'package-lock.json',
      '.github/**',          // YAML, non JS
    ],
  },

  // Base recommended
  js.configs.recommended,

  // js/*.js — script classici browser, vanilla, no ESM
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // TS checkJs copre undefined: disabilitato per non duplicare
      'no-undef': 'off',
      // Disabilitato in js/*.js: in vanilla classic le top-level
      // `function foo()` diventano window.foo e sono chiamate da HTML
      // `onclick="foo()"`, ma ESLint non vede l'HTML → 177 falsi positivi.
      // Per locali davvero inutilizzati ci pensa la review/Fase B.
      'no-unused-vars': 'off',
      // no-cond-assign: usa default 'except-parens' (consente regex iteration
      // pattern: while ((m = re.exec(s)) !== null), comune in export.js)
      // Bug catcher: var ridichiarate
      'no-redeclare': 'off',  // top-level globals condivisi tra file
      // Style: blocca dichiarazione var senza let/const? troppo invasivo per ora
      'no-empty': ['warn', { allowEmptyCatch: true }],
      // Catch parameter sempre opzionale
      'no-unused-private-class-members': 'off',
      // Le funzioni vanilla usano molto `this` legato al chiamante
      'no-prototype-builtins': 'off',
      // Console permesso (uso intenzionale per debug + IS_STAGING banner)
      'no-console': 'off',
    },
  },

  // test/*.js — ESM, environment node + jsdom
  {
    files: ['test/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
    },
  },

  // Config files (vitest.config.js, eslint.config.js) — ESM node
  {
    files: ['*.config.js', 'vitest.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
];
