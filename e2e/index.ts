import { execSync } from 'child_process';
import setup from './setup';
import teardown from './teardown';
import { logSection } from './utils/log';

(async () => {
  let end = logSection('Setup');
  await setup();
  end();

  end = logSection('Tests');
  let error = false;
  try {
    execSync(process.argv[2], { stdio: 'inherit' });
  } catch (err) {
    error = true;
  }
  end();

  end = logSection('Teardown');
  await teardown();
  end();

  if (error) {
    process.exit(1);
  }
})();
