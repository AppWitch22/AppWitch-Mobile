// Vitest config — jsdom env per simulare window/document.
// I file js/*.js sono script classici (no ESM): vengono caricati
// dinamicamente nei test tramite `test/loader.js`.

export default {
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['test/**/*.test.js'],
    setupFiles: ['./test/setup.js'],
  },
};
