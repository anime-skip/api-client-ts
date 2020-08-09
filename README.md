A class that extends `Api.Implementation`. You can use this library as is, or extend it if more functionality is needed.

## Extending

```ts
class ExtendedAxiosApi extends AxiosApi {
  async someOtherApiCall(): Promise<ReturnType> {
    const response = this.sendGraphql<'queryName', ReturnType>({
      query: '<insert query/mutation>',
    });
    return response.queryName;
  }
}
```
