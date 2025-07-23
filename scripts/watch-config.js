const fs = require('fs');
const path = require('path');

const configDir = '/usr/share/nginx/html/assets/config';
const configFile = path.join(configDir, 'runtime-config.json');
const secretsDir = '/etc/secrets';

function generateConfig() {
  // Read secrets from mounted files
  const config = {
    apiUrl: fs.existsSync(`${secretsDir}/api-url`) ? 
      fs.readFileSync(`${secretsDir}/api-url`, 'utf8') : '',
    authToken: fs.existsSync(`${secretsDir}/auth-token`) ? 
      fs.readFileSync(`${secretsDir}/auth-token`, 'utf8') : '',
    lastUpdated: new Date().toISOString()
  };

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configFile, JSON.stringify(config));
  console.log(`Config updated at ${new Date().toISOString()}`);
}

// Generate config immediately
generateConfig();

// Watch for changes in the secrets directory
fs.watch(secretsDir, () => {
  console.log('Secret files changed, updating config...');
  generateConfig();
});