import { execSync } from 'child_process';

async function startDocker() {
  console.log('Starting docker...');
  execSync('docker-compose up --renew-anon-volumes --detach', {
    cwd: __dirname,
    stdio: 'inherit',
  });
}

export default async function setup(): Promise<void> {
  await startDocker();
}
