# `@anime-skip/axios-api`

You has all the necessary API calls to be used in a JS/TS application. It's return types are typed from the [`@anime-skip/types`](https://github.com/anime-skip/lib-types/packages/349467) package. You do not need to install both if these are the only types used.

It includes a class called `AxiosApi` that extends `@anime-skip/types#ApiImplementation`. You can use this library as is, or extend it if more functionality/methods are required.

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
