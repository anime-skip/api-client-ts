import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { log } from './utils/log';

const logFile = resolve(__dirname, 'e2e.log');

function writeLogs() {
  log(`Writing logs to ${logFile}`);
  const logs = execSync('docker-compose logs --no-color --timestamps', {
    cwd: __dirname,
    encoding: 'utf-8',
  });
  writeFileSync(logFile, logs, { encoding: 'utf-8' });
}

function stopDocker() {
  console.log('Killing docker...');
  execSync('docker-compose down', {
    cwd: __dirname,
    stdio: 'inherit',
  });
}

export default function teardown(): void {
  writeLogs();
  stopDocker();
}
