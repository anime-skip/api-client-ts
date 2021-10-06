export function logSection(title: string): () => void {
  process.stdout.write('\n');
  process.stdout.write(`\x1b[1m\x1b[96m== ${title.toUpperCase()} ==\x1b[0m\n`);

  return function end() {
    process.stdout.write(`\x1b[1m\x1b[96m== ${title.toUpperCase()} DONE ==\x1b[0m\n`);
    process.stdout.write('\n');
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(...message: any[]): void {
  process.stdout.write(`\x1b[2m${message.join('')}\x1b[0m\n`);
}
