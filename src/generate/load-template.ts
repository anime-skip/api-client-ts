import fs from 'fs';
import path from 'path';

export function loadTemplate(name: string, values: Record<string, string | undefined>): string {
  const content = fs.readFileSync(path.resolve(__dirname, `templates/${name}`), {
    encoding: 'utf-8',
  });
  const parts = /\/\/ KEYS:\s(.*)\/\/ VARS:.*\/\/ TEMPLATE:\n(.*)/ms.exec(content);
  if (parts == null || parts.length != 3) {
    throw Error(
      'Could not load template, KEYS, VARS, or TEMPLATE sections missing: ' +
        JSON.stringify(parts, null, 2),
    );
  }
  const keys = parts[1];
  let template = parts[2];

  // Verify all the required keys were passed
  const requiredKeys = keys
    .split('\n')
    .map(line => line.replace('// - ', '').trim())
    .filter(key => !!key);
  const passedKeys = new Set(Object.keys(values));
  for (const requiredKey of requiredKeys) {
    if (!passedKeys.has(requiredKey))
      throw Error(
        `Template (${name}) required '${requiredKey}', but it was not passed: ${JSON.stringify(
          values,
          null,
          2,
        )}`,
      );
  }

  // Return the template
  for (const key in values) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const value = values[key]!;
    template = template.replace(RegExp('\\$' + key + '\\$', 'gm'), value);
  }
  return template.trimRight();
}
