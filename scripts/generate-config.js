const fs = require('fs');

// Create a config object from environment variables
const config = {
  // Add your Kubernetes secret environment variables here
  apiUrl: process.env.API_URL,
  authToken: process.env.AUTH_TOKEN,
  // Add any other environment variables you need
};

// Create directory if it doesn't exist
if (!fs.existsSync('./dist/assets/config')) {
  fs.mkdirSync('./dist/assets/config', { recursive: true });
}

// Write the config to a JSON file
fs.writeFileSync(
  './dist/assets/config/runtime-config.json',
  JSON.stringify(config)
);

console.log('Runtime configuration generated');