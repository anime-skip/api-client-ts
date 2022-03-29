const RESERVED_KEYWORDS = ['delete'];

export function getSafeName(unsafeName: string): string {
  return RESERVED_KEYWORDS.includes(unsafeName) ? unsafeName + '_' : unsafeName;
}
