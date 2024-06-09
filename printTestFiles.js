const { glob } = require('glob');
const path = require('path');

// Adjust the path to match your directory structure
const pattern = path.join(__dirname, 'src/tests/**/*.test.js');

console.log('Pattern used for glob:', pattern); // Debugging line

glob(pattern, (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    process.exit(1);
  }
  if (files.length === 0) {
    console.log('No test files found.');
  } else {
    console.log('Test files found:', files);
  }
});
