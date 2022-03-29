export function expectQueryResolves<T>(
  query: Promise<T>,
): jest.AndNot<jest.Matchers<Promise<void>, Promise<T>>> {
  return expect(query).resolves;
}

export function expectFailure<T>(
  query: Promise<T>,
): jest.AndNot<jest.Matchers<Promise<void>, Promise<T>>> {
  return expect(query).rejects;
}
