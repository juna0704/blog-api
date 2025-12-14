// tests/mocks/jsdom.js
module.exports = {
  JSDOM: class JSDOM {
    constructor(html) {
      this.window = {
        document: {
          createElement: () => ({}),
          body: {},
        },
        DOMPurify: {
          sanitize: (dirty) => dirty,
        },
      };
    }
  },
  __esModule: true,
};
