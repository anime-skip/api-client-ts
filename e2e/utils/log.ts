export function logSection(title: string): () => void {
  process.stdout.write('\n');
  process.stdout.write(`\x1b[1m\x1b[96m== ${title.toUpperCase()} ==\x1b[0m\n`);

  return function end() {
    process.stdout.write(`\x1b[1m\x1b[96m== ${title.toUpperCase()} DONE ==\x1b[0m\n`);
    process.stdout.write('\n');
  };
}

const COLOR = '\x1b[2m';
const RESET = '\x1b[0m';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function println(...messages: any[]): void {
  const strings = messages.map(message => {
    if (typeof message === 'object') return JSON.stringify(message, null, 2);
    return String(message);
  });
  const lines = strings.flatMap(str => str.split('\n')).map(line => `${COLOR}${line}${RESET}`);
  process.stdout.write(lines.join('\n') + '\n');
}
