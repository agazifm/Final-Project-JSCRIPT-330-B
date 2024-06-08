const { TextEncoder } = require('text-encoding');

global.TextEncoder = TextEncoder;

jest.mock('async_hooks', () => ({
    __esModule: true,
    default: jest.fn(),
  }));