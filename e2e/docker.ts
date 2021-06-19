import { AxiosInstance } from 'axios';
import * as compose from 'docker-compose';
import fs from 'fs';
import path from 'path';

const debug = process.env.DEBUG_DOCKER === 'true';
const composeOptions: compose.IDockerComposeOptions = {
  cwd: __dirname,
  log: debug,
};

// eslint-disable-next-line no-control-regex
const textFormatRegex = /\x1b\[.+?m/g;

function sleep(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

async function waitUntilRunning(axios: AxiosInstance) {
  const isRunning = async (): Promise<boolean> => {
    try {
      await axios.get('/status');
      return true;
    } catch (err) {
      return false;
    }
  };

  let retries = 0;
  let started: boolean;
  while (!(started = await isRunning()) && retries < 100) {
    await sleep(100);
    retries++;
  }
  if (!started) {
    console.error('\n\x1b[1m\x1b[91mCould not start docker services\x1b[0m\n');
    process.exit(1);
  }
}

export async function startServices(axios: AxiosInstance): Promise<void> {
  if (process.env.DONT_PULL !== 'true') {
    await compose.pullAll(composeOptions);
  }
  await compose.upAll({ ...composeOptions, commandOptions: ['-V'] });
  await waitUntilRunning(axios);
}

export async function stopServices(): Promise<void> {
  const logs = await compose.logs(['backend', 'db'], { ...composeOptions, log: false });
  fs.writeFileSync(path.resolve(__dirname, 'e2e.log'), logs.out.replace(textFormatRegex, ''), {
    encoding: 'utf-8',
  });
  await compose.down(composeOptions);
  if (debug) console.log('Stopped docker:');
}
