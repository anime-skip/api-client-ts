import { Api, ApiImplementation } from '@anime-skip/types';
import Axios, { AxiosError } from 'axios';
import md5 from 'md5';

const axios = Axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' ? 'http://api.anime-skip.com/' : 'http://localhost:8000/',
});

if (process.env.NODE_ENV !== 'production') {
  axios.interceptors.request.use((config): any => {
    /* eslint-disable no-console */
    console.groupCollapsed(
      `%cAPI  %c/${config.url}`,
      'font-weight: 600; color: default;',
      'font-weight: 400; color: black;',
    );
    console.log(`URL: %c${config.baseURL}${config.url}`, 'color: #137AF8');
    const headers = {
      ...config.headers,
      ...config.headers.common,
      ...config.headers[config.method || 'get'],
    };
    delete headers.get;
    delete headers.post;
    delete headers.put;
    delete headers.delete;
    delete headers.patch;
    delete headers.head;
    console.log('Headers: ', headers);
    if (config.params) {
      console.log('Parameters: ', config.params);
    }
    if (config.data) {
      console.log(`GraphQL:\n%c${AxiosApi.formatGraphql(config.data.query)}`, 'color: #137AF8');
      if (config.data.variables) {
        console.log('Variables: ', config.data.variables);
      }
    }
    /* eslint-enable no-console */
    return config;
  });
}

function query(q: string): Api.GraphQlBody {
  return { query: q };
}

function mutation(mutationString: string, vars: { [variableName: string]: any }): Api.GraphQlBody {
  return { query: mutationString, variables: vars };
}

const preferencesData = `
  enableAutoSkip enableAutoPlay
  skipBranding skipIntros skipNewIntros skipMixedIntros skipRecaps skipFiller skipCanon skipTransitions skipTitleCard skipCredits skipMixedCredits skipNewCredits skipPreview
`;

const loginRefreshData = `
  authToken refreshToken
`;

const loginData = `
  ${loginRefreshData}
  account {
    username emailVerified
    preferences {
      ${preferencesData}
    }
  }
`;

const showSearchData = `id name originalName`;

const showData = `id name originalName website image`;

const episodeSearchData = `id name season number absoluteNumber`;

const episodeData = `
  id absoluteNumber number season name 
  timestamps {
    id at typeId
  }
  show { 
    ${showData} 
  }
`;

const episodeUrlNoEpisodeData = `
  url
  createdAt
`;

const episodeUrlData = `
  ${episodeUrlNoEpisodeData}
  episode {
    ${episodeData}
  }
`;

const timestampData = `
  id
  at
  typeId
`;

export default class AxiosApi extends ApiImplementation {
  private getAccessToken: (
    refreshAccessToken: (refreshToken: string) => Promise<Api.LoginRefreshResponse>,
  ) => Promise<string>;

  /**
   * @param getAccessToken A async funtion that returns a token. This function should not only
   *                       return the access or refreshed access token, but also store the new
   *                       tokens for use inside this function again.
   */
  constructor(
    getAccessToken: (
      refreshAccessToken: (refreshToken: string) => Promise<Api.LoginRefreshResponse>,
    ) => Promise<string>,
  ) {
    super();
    this.getAccessToken = getAccessToken;
  }

  //#region Utils
  public static formatGraphql(data: string): string {
    const lines = data
      .split('\n')
      .map(line => line.trim())
      .filter(line => !!line);

    function addTabs(string: string, tabs: number): string {
      let result = string;
      for (let i = 0; i < tabs; i++) {
        result = '  ' + result;
      }
      return result;
    }

    let tabs = 0;
    const tabbedLines = lines.map(line => {
      if (line === '}') tabs--;
      const newLine = addTabs(line, tabs);
      if (line.endsWith('{')) tabs++;
      return newLine;
    });

    return tabbedLines.join('\n');
  }

  /* eslint-disable no-console */
  private async sendUnauthorizedGraphql<Q extends string, D>(
    data: Api.GraphQlBody,
  ): Promise<{ data: { [field in Q]: D } }> {
    return await this.sendGraphql(data, true);
  }

  private async sendGraphql<Q extends string, D>(
    data: Api.GraphQlBody,
    skipAuth = false,
  ): Promise<{ data: { [field in Q]: D } }> {
    try {
      const token = skipAuth ? undefined : await this.getAccessToken(this.loginRefresh);
      const response = await axios.post('graphql', data, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (response.data?.errors) {
        const error = new Error(
          `GraphQL Request failed with ${response.data.errors.length} errors`,
        ) as AxiosError;
        error.response = response;
        throw error;
      }

      console.log('Response: ', response.data);
      console.groupEnd();

      return response.data;
    } catch (err) {
      console.error(err.message, {
        status: err.response?.status,
        headers: err.response?.headers,
        errors: err.response?.data?.errors,
        response: err.response,
      });
      console.groupEnd();
      throw err;
    }
  }
  /* eslint-enable no-console */
  //#endregion

  //#region Account
  async createAccount(
    username: string,
    email: string,
    password: string,
    recaptchaResponse: string,
  ): Promise<Api.LoginResponse> {
    const m = mutation(
      `mutation CreateAccount($username: String!, $email: String!, $passwordHash: String!, $recaptchaResponse: String!) {
        createAccount(username: $username, email: $email, passwordHash: $passwordHash, recaptchaResponse: $recaptchaResponse) {
          ${loginData}
        }
      }`,
      {
        username,
        email,
        passwordHash: md5(password),
        recaptchaResponse,
      },
    );
    const response = await this.sendUnauthorizedGraphql<'createAccount', Api.LoginResponse>(m);
    return response.data.createAccount;
  }

  async loginManual(username: string, password: string): Promise<Api.LoginResponse> {
    const q = query(
      `{
        login(usernameEmail: "${username}", passwordHash: "${md5(password)}") {
          ${loginData}
        }
      }`,
    );
    const response = await this.sendUnauthorizedGraphql<'login', Api.LoginResponse>(q);
    return response.data.login;
  }

  async loginRefresh(refreshToken: string): Promise<Api.LoginRefreshResponse> {
    const q = query(
      `{
        loginRefresh(refreshToken: "${refreshToken}") {
          ${loginRefreshData}
        }
      }`,
    );
    const response = await this.sendUnauthorizedGraphql<'loginRefresh', Api.LoginRefreshResponse>(
      q,
    );
    return response.data.loginRefresh;
  }
  //#endregion

  //#region Preferences
  async updatePreferences(prefs: Api.Preferences): Promise<void> {
    const m = mutation(
      `mutation SavePreferences($prefs: InputPreferences!) {
        savePreferences(preferences: $prefs) {
          ${preferencesData}
        }
      }`,
      {
        prefs,
      },
    );
    await this.sendGraphql(m);
  }
  //#endregion

  //#region Shows
  async createShow(data: Api.InputShow): Promise<Api.Show> {
    const m = mutation(
      `mutation CreateShow($data: InputShow!) {
        createShow(showInput: $data, becomeAdmin: false) {
          ${showData}
        }
      }`,
      {
        data,
      },
    );
    const response = await this.sendGraphql<'createShow', Api.ShowSearchResult>(m);
    return response.data.createShow;
  }

  async searchShows(name: string): Promise<Api.ShowSearchResult[]> {
    const q = query(`{
      searchShows(search: "${name}", limit: 5) {
        ${showSearchData}
      }
    }`);
    const response = await this.sendGraphql<'searchShows', Api.ShowSearchResult[]>(q);
    return response.data.searchShows;
  }
  //#endregion

  //#region Episodes
  async createEpisode(data: Api.InputEpisode, showId: string): Promise<Api.EpisodeSearchResult> {
    const m = mutation(
      `mutation CreateEpisode($data: InputEpisode!, $showId: ID!) {
        createEpisode(episodeInput: $data, showId: $showId) {
          ${episodeSearchData}
        }
      }`,
      {
        data,
        showId,
      },
    );
    const response = await this.sendGraphql<'createEpisode', Api.EpisodeSearchResult>(m);
    return response.data.createEpisode;
  }

  async searchEpisodes(name: string, showId?: string): Promise<Api.EpisodeSearchResult[]> {
    const params: string[] = [`search: "${name}"`, 'limit: 5'];
    if (showId != null) {
      params.push(`showId: "${showId}"`);
    }
    const q = query(`{
      searchEpisodes(${params.join(', ')}) {
        ${episodeSearchData}
      }
    }`);
    console.log({ q });
    const response = await this.sendUnauthorizedGraphql<
      'searchEpisodes',
      Api.EpisodeSearchResult[]
    >(q);
    return response.data.searchEpisodes;
  }
  //#endregion

  //#region Episode Urls
  async createEpisodeUrl(data: Api.InputEpisodeUrl, episodeId: string): Promise<Api.EpisodeUrl> {
    const m = mutation(
      `mutation CreateEpisodeUrl($data: InputEpisodeUrl!, $episodeId: ID!) {
        createEpisodeUrl(episodeUrlInput: $data, episodeId: $episodeId) {
          ${episodeUrlData}
        }
      }`,
      {
        data,
        episodeId,
      },
    );
    const response = await this.sendGraphql<'createEpisodeUrl', Api.EpisodeUrl>(m);
    return response.data.createEpisodeUrl;
  }

  async deleteEpisodeUrl(episodeUrl: string): Promise<Api.EpisodeUrlNoEpisode> {
    const m = mutation(
      `mutation DeleteEpisodeUrl($episodeUrl: String!) {
        deleteEpisodeUrl(episodeUrl: $episodeUrl) {
          ${episodeUrlNoEpisodeData}
        }
      }`,
      {
        episodeUrl,
      },
    );
    const response = await this.sendGraphql<'deleteEpisodeUrl', Api.EpisodeUrl>(m);
    return response.data.deleteEpisodeUrl;
  }

  async fetchEpisodeByUrl(url: string): Promise<Api.EpisodeUrl> {
    const q = query(
      `{
        findEpisodeUrl(episodeUrl: "${url}") {
          ${episodeUrlData}
        }
      }`,
    );
    const response = await this.sendUnauthorizedGraphql<'findEpisodeUrl', Api.EpisodeUrl>(q);
    return response.data.findEpisodeUrl;
  }
  //#endregion

  //#region Timestamps
  async createTimestamp(
    episodeId: string,
    { at, typeId }: Api.InputTimestamp,
  ): Promise<Api.Timestamp> {
    const m = mutation(
      `mutation CreateTimestamp($data: InputTimestamp!, $episodeId: ID!) {
        createTimestamp(timestampInput: $data, episodeId: $episodeId) {
          ${timestampData}
        }
      }`,
      {
        episodeId,
        data: { at, typeId },
      },
    );
    const response = await this.sendGraphql<'createTimestamp', Api.Timestamp>(m);
    return response.data.createTimestamp;
  }

  async updateTimestamp({ id, at, typeId }: Api.Timestamp): Promise<Api.Timestamp> {
    const m = mutation(
      `mutation UpdateTimestamp($data: InputTimestamp!, $timestampId: ID!) {
        updateTimestamp(newTimestamp: $data, timestampId: $timestampId) {
          ${timestampData}
        }
      }`,
      {
        timestampId: id,
        data: { at, typeId },
      },
    );
    const response = await this.sendGraphql<'createTimestamp', Api.Timestamp>(m);
    return response.data.createTimestamp;
  }

  async deleteTimestamp(timestampId: string): Promise<Api.Timestamp> {
    const m = mutation(
      `mutation DeleteTimestamp($timestampId: ID!) {
        deleteTimestamp(timestampId: $timestampId) {
          ${timestampData}
        }
      }`,
      {
        timestampId,
      },
    );
    const response = await this.sendGraphql<'createTimestamp', Api.Timestamp>(m);
    return response.data.createTimestamp;
  }
  //#endregion
}
