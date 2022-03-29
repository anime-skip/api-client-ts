export function capitalize(string: string | undefined): string | undefined {
  if (!string) return string;

  const firstChar = string.substr(0, 1).toUpperCase();
  const ending = string.substr(1);
  return firstChar + ending;
}
