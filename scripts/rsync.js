const { exec } = require('child_process');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const destinationEnvVar = args.destination || 'DESTINATION_PATH';
const destination = process.env[destinationEnvVar];
const sourceEnvVar = args.source || 'SOURCE_PATH';
const source = process.env[sourceEnvVar];
const portEnvVar = args.port || 'SSH_PORT';
const port = process.env[portEnvVar] || 22;
const userEnvVar = args.user || 'SSH_USER';
const user = process.env[userEnvVar];
const rsyncCommand = `rsync -vaz --rsh="ssh -p ${port} -l ${user}" ${source} ${destination} --exclude=node_modules`;

console.log(`Executing rsync command: ${rsyncCommand}`);

exec(rsyncCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing rsync: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`rsync stderr: ${stderr}`);
    return;
  }
  console.log(`rsync stdout: ${stdout}`);
});
