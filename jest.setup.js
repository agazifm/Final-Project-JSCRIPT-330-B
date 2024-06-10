const dotenv = require('dotenv');

dotenv.config();

// Polyfill for TextEncoder and TextDecoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Polyfill for performance
global.performance = require('perf_hooks').performance;
