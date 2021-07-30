import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

export type GqlResponse<K extends string, T> = AxiosResponse<{
  data: { [requestName in K]: T };
  errors?: Array<
    {
      message: string;
      path?: string | string[];
      locations: Array<{
        line: number;
        column: number;
      }>;
    } & Record<string, unknown>
  >;
}>;

export class GqlError {
  readonly graphql = true;

  constructor(readonly status: number, readonly errors: GqlResponse<any, any>['data']['errors']) {}

  get message(): string {
    return `Graphql request failed with status ${this.status} (${JSON.stringify(
      this.errors,
      null,
      2,
    )})`;
  }
}

export interface GqlAccount {
  id: GqlID;
  createdAt: GqlTime;
  deletedAt?: GqlTime;
  username: GqlString;
  email: GqlString;
  profileUrl: GqlString;
  adminOfShows: Array<GqlShowAdmin>;
  emailVerified: GqlBoolean;
  role: GqlRole;
  preferences: GqlPreferences;
}

export type GqlBoolean = boolean;

export interface GqlEpisode {
  id: GqlID;
  createdAt: GqlTime;
  createdByUserId: GqlID;
  createdBy: GqlUser;
  updatedAt: GqlTime;
  updatedByUserId: GqlID;
  updatedBy: GqlUser;
  deletedAt?: GqlTime;
  deletedByUserId?: GqlID;
  deletedBy?: GqlUser;
  season?: GqlString;
  number?: GqlString;
  absoluteNumber?: GqlString;
  baseDuration?: GqlFloat;
  name?: GqlString;
  show: GqlShow;
  showId: GqlID;
  timestamps: Array<GqlTimestamp>;
  urls: Array<GqlEpisodeUrl>;
  template?: GqlTemplate;
}

export enum GqlEpisodeSource {
  UNKNOWN = 'UNKNOWN',
  VRV = 'VRV',
  FUNIMATION = 'FUNIMATION',
}

export interface GqlEpisodeUrl {
  url: GqlString;
  createdAt: GqlTime;
  createdByUserId: GqlID;
  createdBy: GqlUser;
  updatedAt: GqlTime;
  updatedByUserId: GqlID;
  updatedBy: GqlUser;
  duration?: GqlFloat;
  timestampsOffset?: GqlFloat;
  episodeId: GqlID;
  episode: GqlEpisode;
  source: GqlEpisodeSource;
}

export type GqlFloat = number;

export type GqlID = string;

export interface GqlInputEpisode {
  season?: GqlString;
  number?: GqlString;
  absoluteNumber?: GqlString;
  name?: GqlString;
  baseDuration?: GqlFloat;
}

export interface GqlInputEpisodeUrl {
  url: GqlString;
  duration?: GqlFloat;
  timestampsOffset?: GqlFloat;
}

export interface GqlInputExistingTimestamp {
  id: GqlID;
  timestamp: GqlInputTimestamp;
}

export interface GqlInputPreferences {
  enableAutoSkip?: GqlBoolean;
  enableAutoPlay?: GqlBoolean;
  minimizeToolbarWhenEditing?: GqlBoolean;
  hideTimelineWhenMinimized?: GqlBoolean;
  skipBranding?: GqlBoolean;
  skipIntros?: GqlBoolean;
  skipNewIntros?: GqlBoolean;
  skipMixedIntros?: GqlBoolean;
  skipRecaps?: GqlBoolean;
  skipFiller?: GqlBoolean;
  skipCanon?: GqlBoolean;
  skipTransitions?: GqlBoolean;
  skipCredits?: GqlBoolean;
  skipNewCredits?: GqlBoolean;
  skipMixedCredits?: GqlBoolean;
  skipPreview?: GqlBoolean;
  skipTitleCard?: GqlBoolean;
}

export interface GqlInputShow {
  name: GqlString;
  originalName?: GqlString;
  website?: GqlString;
  image?: GqlString;
}

export interface GqlInputShowAdmin {
  showId: GqlID;
  userId: GqlID;
}

export interface GqlInputTemplate {
  showId: GqlID;
  type: GqlTemplateType;
  seasons?: Array<GqlString>;
  sourceEpisodeId: GqlID;
}

export interface GqlInputTemplateTimestamp {
  templateId: GqlID;
  timestampId: GqlID;
}

export interface GqlInputTimestamp {
  at: GqlFloat;
  typeId: GqlID;
  source?: GqlTimestampSource;
}

export interface GqlInputTimestampOn {
  episodeId: GqlID;
  timestamp: GqlInputTimestamp;
}

export interface GqlInputTimestampType {
  name: GqlString;
  description: GqlString;
}

export type GqlInt = number;

export interface GqlLoginData {
  authToken: GqlString;
  refreshToken: GqlString;
  account: GqlAccount;
}

export interface GqlAddTimestampToTemplateArgs {
  templateTimestamp: GqlInputTemplateTimestamp;
}

export interface GqlCreateAccountArgs {
  username: GqlString;
  email: GqlString;
  passwordHash: GqlString;
  recaptchaResponse: GqlString;
}

export interface GqlCreateEpisodeArgs {
  showId: GqlID;
  episodeInput: GqlInputEpisode;
}

export interface GqlCreateEpisodeUrlArgs {
  episodeId: GqlID;
  episodeUrlInput: GqlInputEpisodeUrl;
}

export interface GqlCreateShowArgs {
  showInput: GqlInputShow;
  becomeAdmin: GqlBoolean;
}

export interface GqlCreateShowAdminArgs {
  showAdminInput: GqlInputShowAdmin;
}

export interface GqlCreateTemplateArgs {
  newTemplate: GqlInputTemplate;
}

export interface GqlCreateTimestampArgs {
  episodeId: GqlID;
  timestampInput: GqlInputTimestamp;
}

export interface GqlCreateTimestampTypeArgs {
  timestampTypeInput: GqlInputTimestampType;
}

export interface GqlDeleteAccountArgs {
  deleteToken: GqlString;
}

export interface GqlDeleteAccountRequestArgs {
  passwordHash: GqlString;
}

export interface GqlDeleteEpisodeArgs {
  episodeId: GqlID;
}

export interface GqlDeleteEpisodeUrlArgs {
  episodeUrl: GqlString;
}

export interface GqlDeleteShowArgs {
  showId: GqlID;
}

export interface GqlDeleteShowAdminArgs {
  showAdminId: GqlID;
}

export interface GqlDeleteTemplateArgs {
  templateId: GqlID;
}

export interface GqlDeleteTimestampArgs {
  timestampId: GqlID;
}

export interface GqlDeleteTimestampTypeArgs {
  timestampTypeId: GqlID;
}

export interface GqlRemoveTimestampFromTemplateArgs {
  templateTimestamp: GqlInputTemplateTimestamp;
}

export interface GqlSavePreferencesArgs {
  preferences: GqlInputPreferences;
}

export interface GqlUpdateEpisodeArgs {
  episodeId: GqlID;
  newEpisode: GqlInputEpisode;
}

export interface GqlUpdateEpisodeUrlArgs {
  episodeUrl: GqlString;
  newEpisodeUrl: GqlInputEpisodeUrl;
}

export interface GqlUpdateShowArgs {
  showId: GqlID;
  newShow: GqlInputShow;
}

export interface GqlUpdateTemplateArgs {
  templateId: GqlID;
  newTemplate: GqlInputTemplate;
}

export interface GqlUpdateTimestampArgs {
  timestampId: GqlID;
  newTimestamp: GqlInputTimestamp;
}

export interface GqlUpdateTimestampsArgs {
  create: Array<GqlInputTimestampOn>;
  update: Array<GqlInputExistingTimestamp>;
  delete: Array<GqlID>;
}

export interface GqlUpdateTimestampTypeArgs {
  timestampTypeId: GqlID;
  newTimestampType: GqlInputTimestampType;
}

export interface GqlVerifyEmailAddressArgs {
  validationToken: GqlString;
}

export interface GqlMutation {
  addTimestampToTemplate(
    query: string,
    args: GqlAddTimestampToTemplateArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTemplateTimestamp | null>;
  createAccount(
    query: string,
    args: GqlCreateAccountArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlLoginData | null>;
  createEpisode(
    query: string,
    args: GqlCreateEpisodeArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlEpisode | null>;
  createEpisodeUrl(
    query: string,
    args: GqlCreateEpisodeUrlArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlEpisodeUrl | null>;
  createShow(
    query: string,
    args: GqlCreateShowArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlShow | null>;
  createShowAdmin(
    query: string,
    args: GqlCreateShowAdminArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlShowAdmin | null>;
  createTemplate(
    query: string,
    args: GqlCreateTemplateArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTemplate | null>;
  createTimestamp(
    query: string,
    args: GqlCreateTimestampArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTimestamp | null>;
  createTimestampType(
    query: string,
    args: GqlCreateTimestampTypeArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTimestampType | null>;
  deleteAccount(
    query: string,
    args: GqlDeleteAccountArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlAccount | null>;
  deleteAccountRequest(
    query: string,
    args: GqlDeleteAccountRequestArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlAccount | null>;
  deleteEpisode(
    query: string,
    args: GqlDeleteEpisodeArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlEpisode | null>;
  deleteEpisodeUrl(
    query: string,
    args: GqlDeleteEpisodeUrlArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlEpisodeUrl | null>;
  deleteShow(
    query: string,
    args: GqlDeleteShowArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlShow | null>;
  deleteShowAdmin(
    query: string,
    args: GqlDeleteShowAdminArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlShowAdmin | null>;
  deleteTemplate(
    query: string,
    args: GqlDeleteTemplateArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTemplate | null>;
  deleteTimestamp(
    query: string,
    args: GqlDeleteTimestampArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTimestamp | null>;
  deleteTimestampType(
    query: string,
    args: GqlDeleteTimestampTypeArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTimestampType | null>;
  removeTimestampFromTemplate(
    query: string,
    args: GqlRemoveTimestampFromTemplateArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTemplateTimestamp | null>;
  resendVerificationEmail(query: string): Promise<GqlBoolean | null>;
  savePreferences(
    query: string,
    args: GqlSavePreferencesArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlPreferences | null>;
  updateEpisode(
    query: string,
    args: GqlUpdateEpisodeArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlEpisode | null>;
  updateEpisodeUrl(
    query: string,
    args: GqlUpdateEpisodeUrlArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlEpisodeUrl | null>;
  updateShow(
    query: string,
    args: GqlUpdateShowArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlShow | null>;
  updateTemplate(
    query: string,
    args: GqlUpdateTemplateArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTemplate | null>;
  updateTimestamp(
    query: string,
    args: GqlUpdateTimestampArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTimestamp | null>;
  updateTimestamps(
    query: string,
    args: GqlUpdateTimestampsArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlUpdatedTimestamps | null>;
  updateTimestampType(
    query: string,
    args: GqlUpdateTimestampTypeArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTimestampType | null>;
  verifyEmailAddress(
    query: string,
    args: GqlVerifyEmailAddressArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlAccount | null>;
}

export interface GqlPreferences {
  id: GqlID;
  createdAt: GqlTime;
  updatedAt: GqlTime;
  deletedAt?: GqlTime;
  userId: GqlID;
  user: GqlUser;
  enableAutoSkip: GqlBoolean;
  enableAutoPlay: GqlBoolean;
  minimizeToolbarWhenEditing: GqlBoolean;
  hideTimelineWhenMinimized: GqlBoolean;
  skipBranding: GqlBoolean;
  skipIntros: GqlBoolean;
  skipNewIntros: GqlBoolean;
  skipMixedIntros: GqlBoolean;
  skipRecaps: GqlBoolean;
  skipFiller: GqlBoolean;
  skipCanon: GqlBoolean;
  skipTransitions: GqlBoolean;
  skipCredits: GqlBoolean;
  skipNewCredits: GqlBoolean;
  skipMixedCredits: GqlBoolean;
  skipPreview: GqlBoolean;
  skipTitleCard: GqlBoolean;
}

export interface GqlFindEpisodeArgs {
  episodeId: GqlID;
}

export interface GqlFindEpisodeByNameArgs {
  name: GqlString;
}

export interface GqlFindEpisodesByShowIdArgs {
  showId: GqlID;
}

export interface GqlFindEpisodeUrlArgs {
  episodeUrl: GqlString;
}

export interface GqlFindEpisodeUrlsByEpisodeIdArgs {
  episodeId: GqlID;
}

export interface GqlFindShowArgs {
  showId: GqlID;
}

export interface GqlFindShowAdminArgs {
  showAdminId: GqlID;
}

export interface GqlFindShowAdminsByShowIdArgs {
  showId: GqlID;
}

export interface GqlFindShowAdminsByUserIdArgs {
  userId: GqlID;
}

export interface GqlFindTemplateArgs {
  templateId: GqlID;
}

export interface GqlFindTemplateByDetailsArgs {
  episodeId?: GqlID;
  showName?: GqlString;
  season?: GqlString;
}

export interface GqlFindTemplatesByShowIdArgs {
  showId: GqlID;
}

export interface GqlFindTimestampArgs {
  timestampId: GqlID;
}

export interface GqlFindTimestampsByEpisodeIdArgs {
  episodeId: GqlID;
}

export interface GqlFindTimestampTypeArgs {
  timestampTypeId: GqlID;
}

export interface GqlFindUserArgs {
  userId: GqlID;
}

export interface GqlFindUserByUsernameArgs {
  username: GqlString;
}

export interface GqlLoginArgs {
  usernameEmail: GqlString;
  passwordHash: GqlString;
}

export interface GqlLoginRefreshArgs {
  refreshToken: GqlString;
}

export interface GqlRecentlyAddedEpisodesArgs {
  limit?: GqlInt;
  offset?: GqlInt;
}

export interface GqlSearchEpisodesArgs {
  search?: GqlString;
  showId?: GqlID;
  offset?: GqlInt;
  limit?: GqlInt;
  sort?: GqlString;
}

export interface GqlSearchShowsArgs {
  search?: GqlString;
  offset?: GqlInt;
  limit?: GqlInt;
  sort?: GqlString;
}

export interface GqlQuery {
  account(query: string): Promise<GqlAccount | null>;
  allTimestampTypes(query: string): Promise<Array<GqlTimestampType> | null>;
  findEpisode(
    query: string,
    args: GqlFindEpisodeArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlEpisode | null>;
  findEpisodeByName(
    query: string,
    args: GqlFindEpisodeByNameArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<Array<GqlThirdPartyEpisode | null> | null>;
  findEpisodesByShowId(
    query: string,
    args: GqlFindEpisodesByShowIdArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<Array<GqlEpisode> | null>;
  findEpisodeUrl(
    query: string,
    args: GqlFindEpisodeUrlArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlEpisodeUrl | null>;
  findEpisodeUrlsByEpisodeId(
    query: string,
    args: GqlFindEpisodeUrlsByEpisodeIdArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<Array<GqlEpisodeUrl> | null>;
  findShow(
    query: string,
    args: GqlFindShowArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlShow | null>;
  findShowAdmin(
    query: string,
    args: GqlFindShowAdminArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlShowAdmin | null>;
  findShowAdminsByShowId(
    query: string,
    args: GqlFindShowAdminsByShowIdArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<Array<GqlShowAdmin> | null>;
  findShowAdminsByUserId(
    query: string,
    args: GqlFindShowAdminsByUserIdArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<Array<GqlShowAdmin> | null>;
  findTemplate(
    query: string,
    args: GqlFindTemplateArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTemplate | null>;
  findTemplateByDetails(
    query: string,
    args: GqlFindTemplateByDetailsArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTemplate | null>;
  findTemplatesByShowId(
    query: string,
    args: GqlFindTemplatesByShowIdArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<Array<GqlTemplate>>;
  findTimestamp(
    query: string,
    args: GqlFindTimestampArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTimestamp | null>;
  findTimestampsByEpisodeId(
    query: string,
    args: GqlFindTimestampsByEpisodeIdArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<Array<GqlTimestamp> | null>;
  findTimestampType(
    query: string,
    args: GqlFindTimestampTypeArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlTimestampType | null>;
  findUser(
    query: string,
    args: GqlFindUserArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlUser | null>;
  findUserByUsername(
    query: string,
    args: GqlFindUserByUsernameArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlUser | null>;
  login(
    query: string,
    args: GqlLoginArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlLoginData | null>;
  loginRefresh(
    query: string,
    args: GqlLoginRefreshArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GqlLoginData | null>;
  recentlyAddedEpisodes(
    query: string,
    args: GqlRecentlyAddedEpisodesArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<Array<GqlEpisode> | null>;
  searchEpisodes(
    query: string,
    args: GqlSearchEpisodesArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<Array<GqlEpisode> | null>;
  searchShows(
    query: string,
    args: GqlSearchShowsArgs,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<Array<GqlShow> | null>;
}

export enum GqlRole {
  DEV = 'DEV',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface GqlShow {
  id: GqlID;
  createdAt: GqlTime;
  createdByUserId: GqlID;
  createdBy: GqlUser;
  updatedAt: GqlTime;
  updatedByUserId: GqlID;
  updatedBy: GqlUser;
  deletedAt?: GqlTime;
  deletedByUserId?: GqlID;
  deletedBy?: GqlUser;
  name: GqlString;
  originalName?: GqlString;
  website?: GqlString;
  image?: GqlString;
  admins: Array<GqlShowAdmin>;
  episodes: Array<GqlEpisode>;
  templates: Array<GqlTemplate>;
  seasonCount: GqlInt;
  episodeCount: GqlInt;
}

export interface GqlShowAdmin {
  id: GqlID;
  createdAt: GqlTime;
  createdByUserId: GqlID;
  createdBy: GqlUser;
  updatedAt: GqlTime;
  updatedByUserId: GqlID;
  updatedBy: GqlUser;
  deletedAt?: GqlTime;
  deletedByUserId?: GqlID;
  deletedBy?: GqlUser;
  showId: GqlID;
  show: GqlShow;
  userId: GqlID;
  user: GqlUser;
}

export type GqlString = string;

export interface GqlTemplate {
  id: GqlID;
  createdAt: GqlTime;
  createdByUserId: GqlID;
  createdBy: GqlUser;
  updatedAt: GqlTime;
  updatedByUserId: GqlID;
  updatedBy: GqlUser;
  deletedAt?: GqlTime;
  deletedByUserId?: GqlID;
  deletedBy?: GqlUser;
  showId: GqlID;
  show: GqlShow;
  type: GqlTemplateType;
  seasons?: Array<GqlString>;
  sourceEpisodeId: GqlID;
  sourceEpisode: GqlEpisode;
  timestamps: Array<GqlTimestamp>;
  timestampIds: Array<GqlID>;
}

export interface GqlTemplateTimestamp {
  templateId: GqlID;
  template: GqlTemplate;
  timestampId: GqlID;
  timestamp: GqlTimestamp;
}

export enum GqlTemplateType {
  SHOW = 'SHOW',
  SEASONS = 'SEASONS',
}

export interface GqlThirdPartyEpisode {
  id?: GqlID;
  season?: GqlString;
  number?: GqlString;
  absoluteNumber?: GqlString;
  baseDuration?: GqlFloat;
  name?: GqlString;
  source?: GqlTimestampSource;
  timestamps: Array<GqlThirdPartyTimestamp>;
  showId: GqlString;
  show: GqlThirdPartyShow;
}

export interface GqlThirdPartyShow {
  name: GqlString;
  createdAt?: GqlTime;
  updatedAt?: GqlTime;
}

export interface GqlThirdPartyTimestamp {
  id?: GqlID;
  at: GqlFloat;
  typeId: GqlID;
  type: GqlTimestampType;
}

export type GqlTime = string;

export interface GqlTimestamp {
  id: GqlID;
  createdAt: GqlTime;
  createdByUserId: GqlID;
  createdBy: GqlUser;
  updatedAt: GqlTime;
  updatedByUserId: GqlID;
  updatedBy: GqlUser;
  deletedAt?: GqlTime;
  deletedByUserId?: GqlID;
  deletedBy?: GqlUser;
  at: GqlFloat;
  source: GqlTimestampSource;
  typeId: GqlID;
  type: GqlTimestampType;
  episodeId: GqlID;
  episode: GqlEpisode;
}

export enum GqlTimestampSource {
  ANIME_SKIP = 'ANIME_SKIP',
  BETTER_VRV = 'BETTER_VRV',
}

export interface GqlTimestampType {
  id: GqlID;
  createdAt: GqlTime;
  createdByUserId: GqlID;
  createdBy: GqlUser;
  updatedAt: GqlTime;
  updatedByUserId: GqlID;
  updatedBy: GqlUser;
  deletedAt?: GqlTime;
  deletedByUserId?: GqlID;
  deletedBy?: GqlUser;
  name: GqlString;
  description: GqlString;
}

export interface GqlUpdatedTimestamps {
  created: Array<GqlTimestamp>;
  updated: Array<GqlTimestamp>;
  deleted: Array<GqlTimestamp>;
}

export interface GqlUser {
  id: GqlID;
  createdAt: GqlTime;
  deletedAt?: GqlTime;
  username: GqlString;
  profileUrl: GqlString;
  adminOfShows: Array<GqlShowAdmin>;
}

export default function createAnimeSkipClient(baseUrl: string, clientId: string) {
  const axios = Axios.create({
    baseURL: baseUrl,
  });

  // Initialize queries
  const queries: GqlQuery = {
    async account<T extends Partial<GqlAccount | null>>(
      graphql: string,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'account', T> = await axios.post(
          '/graphql',
          {
            query: `
query Account {
  account ${graphql}
}
          `,
            operationName: 'Account',
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['account'];
      } catch (err) {
        if (err.resposne != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async allTimestampTypes<T extends Partial<Array<GqlTimestampType> | null>>(
      graphql: string,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'allTimestampTypes', T> = await axios.post(
          '/graphql',
          {
            query: `
query AllTimestampTypes {
  allTimestampTypes ${graphql}
}
          `,
            operationName: 'AllTimestampTypes',
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['allTimestampTypes'];
      } catch (err) {
        if (err.resposne != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findEpisode<T extends Partial<GqlEpisode | null>>(
      graphql: string,
      args: GqlFindEpisodeArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findEpisode', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindEpisode(
  $episodeId: ID!
) {
  findEpisode(
    episodeId: $episodeId
  ) ${graphql}
}
          `,
            operationName: 'FindEpisode',
            variables: {
              episodeId: args.episodeId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findEpisode'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findEpisodeByName<T extends Partial<Array<GqlThirdPartyEpisode | null> | null>>(
      graphql: string,
      args: GqlFindEpisodeByNameArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findEpisodeByName', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindEpisodeByName(
  $name: String!
) {
  findEpisodeByName(
    name: $name
  ) ${graphql}
}
          `,
            operationName: 'FindEpisodeByName',
            variables: {
              name: args.name,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findEpisodeByName'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findEpisodesByShowId<T extends Partial<Array<GqlEpisode> | null>>(
      graphql: string,
      args: GqlFindEpisodesByShowIdArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findEpisodesByShowId', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindEpisodesByShowId(
  $showId: ID!
) {
  findEpisodesByShowId(
    showId: $showId
  ) ${graphql}
}
          `,
            operationName: 'FindEpisodesByShowId',
            variables: {
              showId: args.showId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findEpisodesByShowId'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findEpisodeUrl<T extends Partial<GqlEpisodeUrl | null>>(
      graphql: string,
      args: GqlFindEpisodeUrlArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findEpisodeUrl', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindEpisodeUrl(
  $episodeUrl: String!
) {
  findEpisodeUrl(
    episodeUrl: $episodeUrl
  ) ${graphql}
}
          `,
            operationName: 'FindEpisodeUrl',
            variables: {
              episodeUrl: args.episodeUrl,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findEpisodeUrl'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findEpisodeUrlsByEpisodeId<T extends Partial<Array<GqlEpisodeUrl> | null>>(
      graphql: string,
      args: GqlFindEpisodeUrlsByEpisodeIdArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findEpisodeUrlsByEpisodeId', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindEpisodeUrlsByEpisodeId(
  $episodeId: ID!
) {
  findEpisodeUrlsByEpisodeId(
    episodeId: $episodeId
  ) ${graphql}
}
          `,
            operationName: 'FindEpisodeUrlsByEpisodeId',
            variables: {
              episodeId: args.episodeId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findEpisodeUrlsByEpisodeId'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findShow<T extends Partial<GqlShow | null>>(
      graphql: string,
      args: GqlFindShowArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findShow', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindShow(
  $showId: ID!
) {
  findShow(
    showId: $showId
  ) ${graphql}
}
          `,
            operationName: 'FindShow',
            variables: {
              showId: args.showId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findShow'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findShowAdmin<T extends Partial<GqlShowAdmin | null>>(
      graphql: string,
      args: GqlFindShowAdminArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findShowAdmin', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindShowAdmin(
  $showAdminId: ID!
) {
  findShowAdmin(
    showAdminId: $showAdminId
  ) ${graphql}
}
          `,
            operationName: 'FindShowAdmin',
            variables: {
              showAdminId: args.showAdminId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findShowAdmin'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findShowAdminsByShowId<T extends Partial<Array<GqlShowAdmin> | null>>(
      graphql: string,
      args: GqlFindShowAdminsByShowIdArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findShowAdminsByShowId', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindShowAdminsByShowId(
  $showId: ID!
) {
  findShowAdminsByShowId(
    showId: $showId
  ) ${graphql}
}
          `,
            operationName: 'FindShowAdminsByShowId',
            variables: {
              showId: args.showId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findShowAdminsByShowId'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findShowAdminsByUserId<T extends Partial<Array<GqlShowAdmin> | null>>(
      graphql: string,
      args: GqlFindShowAdminsByUserIdArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findShowAdminsByUserId', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindShowAdminsByUserId(
  $userId: ID!
) {
  findShowAdminsByUserId(
    userId: $userId
  ) ${graphql}
}
          `,
            operationName: 'FindShowAdminsByUserId',
            variables: {
              userId: args.userId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findShowAdminsByUserId'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findTemplate<T extends Partial<GqlTemplate | null>>(
      graphql: string,
      args: GqlFindTemplateArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findTemplate', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindTemplate(
  $templateId: ID!
) {
  findTemplate(
    templateId: $templateId
  ) ${graphql}
}
          `,
            operationName: 'FindTemplate',
            variables: {
              templateId: args.templateId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findTemplate'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findTemplateByDetails<T extends Partial<GqlTemplate | null>>(
      graphql: string,
      args: GqlFindTemplateByDetailsArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findTemplateByDetails', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindTemplateByDetails(
  $episodeId: ID, $showName: String, $season: String
) {
  findTemplateByDetails(
    episodeId: $episodeId, showName: $showName, season: $season
  ) ${graphql}
}
          `,
            operationName: 'FindTemplateByDetails',
            variables: {
              episodeId: args.episodeId,
              showName: args.showName,
              season: args.season,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findTemplateByDetails'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findTemplatesByShowId<T extends Partial<Array<GqlTemplate>>>(
      graphql: string,
      args: GqlFindTemplatesByShowIdArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findTemplatesByShowId', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindTemplatesByShowId(
  $showId: ID!
) {
  findTemplatesByShowId(
    showId: $showId
  ) ${graphql}
}
          `,
            operationName: 'FindTemplatesByShowId',
            variables: {
              showId: args.showId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findTemplatesByShowId'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findTimestamp<T extends Partial<GqlTimestamp | null>>(
      graphql: string,
      args: GqlFindTimestampArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findTimestamp', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindTimestamp(
  $timestampId: ID!
) {
  findTimestamp(
    timestampId: $timestampId
  ) ${graphql}
}
          `,
            operationName: 'FindTimestamp',
            variables: {
              timestampId: args.timestampId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findTimestamp'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findTimestampsByEpisodeId<T extends Partial<Array<GqlTimestamp> | null>>(
      graphql: string,
      args: GqlFindTimestampsByEpisodeIdArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findTimestampsByEpisodeId', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindTimestampsByEpisodeId(
  $episodeId: ID!
) {
  findTimestampsByEpisodeId(
    episodeId: $episodeId
  ) ${graphql}
}
          `,
            operationName: 'FindTimestampsByEpisodeId',
            variables: {
              episodeId: args.episodeId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findTimestampsByEpisodeId'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findTimestampType<T extends Partial<GqlTimestampType | null>>(
      graphql: string,
      args: GqlFindTimestampTypeArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findTimestampType', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindTimestampType(
  $timestampTypeId: ID!
) {
  findTimestampType(
    timestampTypeId: $timestampTypeId
  ) ${graphql}
}
          `,
            operationName: 'FindTimestampType',
            variables: {
              timestampTypeId: args.timestampTypeId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findTimestampType'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findUser<T extends Partial<GqlUser | null>>(
      graphql: string,
      args: GqlFindUserArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findUser', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindUser(
  $userId: ID!
) {
  findUser(
    userId: $userId
  ) ${graphql}
}
          `,
            operationName: 'FindUser',
            variables: {
              userId: args.userId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findUser'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async findUserByUsername<T extends Partial<GqlUser | null>>(
      graphql: string,
      args: GqlFindUserByUsernameArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'findUserByUsername', T> = await axios.post(
          '/graphql',
          {
            query: `
query FindUserByUsername(
  $username: String!
) {
  findUserByUsername(
    username: $username
  ) ${graphql}
}
          `,
            operationName: 'FindUserByUsername',
            variables: {
              username: args.username,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['findUserByUsername'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async login<T extends Partial<GqlLoginData | null>>(
      graphql: string,
      args: GqlLoginArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'login', T> = await axios.post(
          '/graphql',
          {
            query: `
query Login(
  $usernameEmail: String!, $passwordHash: String!
) {
  login(
    usernameEmail: $usernameEmail, passwordHash: $passwordHash
  ) ${graphql}
}
          `,
            operationName: 'Login',
            variables: {
              usernameEmail: args.usernameEmail,
              passwordHash: args.passwordHash,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['login'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async loginRefresh<T extends Partial<GqlLoginData | null>>(
      graphql: string,
      args: GqlLoginRefreshArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'loginRefresh', T> = await axios.post(
          '/graphql',
          {
            query: `
query LoginRefresh(
  $refreshToken: String!
) {
  loginRefresh(
    refreshToken: $refreshToken
  ) ${graphql}
}
          `,
            operationName: 'LoginRefresh',
            variables: {
              refreshToken: args.refreshToken,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['loginRefresh'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async recentlyAddedEpisodes<T extends Partial<Array<GqlEpisode> | null>>(
      graphql: string,
      args: GqlRecentlyAddedEpisodesArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'recentlyAddedEpisodes', T> = await axios.post(
          '/graphql',
          {
            query: `
query RecentlyAddedEpisodes(
  $limit: Int, $offset: Int
) {
  recentlyAddedEpisodes(
    limit: $limit, offset: $offset
  ) ${graphql}
}
          `,
            operationName: 'RecentlyAddedEpisodes',
            variables: {
              limit: args.limit,
              offset: args.offset,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['recentlyAddedEpisodes'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async searchEpisodes<T extends Partial<Array<GqlEpisode> | null>>(
      graphql: string,
      args: GqlSearchEpisodesArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'searchEpisodes', T> = await axios.post(
          '/graphql',
          {
            query: `
query SearchEpisodes(
  $search: String, $showId: ID, $offset: Int, $limit: Int, $sort: String
) {
  searchEpisodes(
    search: $search, showId: $showId, offset: $offset, limit: $limit, sort: $sort
  ) ${graphql}
}
          `,
            operationName: 'SearchEpisodes',
            variables: {
              search: args.search,
              showId: args.showId,
              offset: args.offset,
              limit: args.limit,
              sort: args.sort,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['searchEpisodes'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async searchShows<T extends Partial<Array<GqlShow> | null>>(
      graphql: string,
      args: GqlSearchShowsArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'searchShows', T> = await axios.post(
          '/graphql',
          {
            query: `
query SearchShows(
  $search: String, $offset: Int, $limit: Int, $sort: String
) {
  searchShows(
    search: $search, offset: $offset, limit: $limit, sort: $sort
  ) ${graphql}
}
          `,
            operationName: 'SearchShows',
            variables: {
              search: args.search,
              offset: args.offset,
              limit: args.limit,
              sort: args.sort,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['searchShows'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
  };

  // Initialize mutations
  const mutations: GqlMutation = {
    async addTimestampToTemplate<T extends Partial<GqlTemplateTimestamp | null>>(
      graphql: string,
      args: GqlAddTimestampToTemplateArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'addTimestampToTemplate', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation AddTimestampToTemplate(
  $templateTimestamp: InputTemplateTimestamp!
) {
  addTimestampToTemplate(
    templateTimestamp: $templateTimestamp
  ) ${graphql}
}
          `,
            operationName: 'AddTimestampToTemplate',
            variables: {
              templateTimestamp: args.templateTimestamp,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['addTimestampToTemplate'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async createAccount<T extends Partial<GqlLoginData | null>>(
      graphql: string,
      args: GqlCreateAccountArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'createAccount', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation CreateAccount(
  $username: String!, $email: String!, $passwordHash: String!, $recaptchaResponse: String!
) {
  createAccount(
    username: $username, email: $email, passwordHash: $passwordHash, recaptchaResponse: $recaptchaResponse
  ) ${graphql}
}
          `,
            operationName: 'CreateAccount',
            variables: {
              username: args.username,
              email: args.email,
              passwordHash: args.passwordHash,
              recaptchaResponse: args.recaptchaResponse,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['createAccount'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async createEpisode<T extends Partial<GqlEpisode | null>>(
      graphql: string,
      args: GqlCreateEpisodeArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'createEpisode', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation CreateEpisode(
  $showId: ID!, $episodeInput: InputEpisode!
) {
  createEpisode(
    showId: $showId, episodeInput: $episodeInput
  ) ${graphql}
}
          `,
            operationName: 'CreateEpisode',
            variables: {
              showId: args.showId,
              episodeInput: args.episodeInput,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['createEpisode'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async createEpisodeUrl<T extends Partial<GqlEpisodeUrl | null>>(
      graphql: string,
      args: GqlCreateEpisodeUrlArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'createEpisodeUrl', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation CreateEpisodeUrl(
  $episodeId: ID!, $episodeUrlInput: InputEpisodeUrl!
) {
  createEpisodeUrl(
    episodeId: $episodeId, episodeUrlInput: $episodeUrlInput
  ) ${graphql}
}
          `,
            operationName: 'CreateEpisodeUrl',
            variables: {
              episodeId: args.episodeId,
              episodeUrlInput: args.episodeUrlInput,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['createEpisodeUrl'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async createShow<T extends Partial<GqlShow | null>>(
      graphql: string,
      args: GqlCreateShowArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'createShow', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation CreateShow(
  $showInput: InputShow!, $becomeAdmin: Boolean!
) {
  createShow(
    showInput: $showInput, becomeAdmin: $becomeAdmin
  ) ${graphql}
}
          `,
            operationName: 'CreateShow',
            variables: {
              showInput: args.showInput,
              becomeAdmin: args.becomeAdmin,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['createShow'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async createShowAdmin<T extends Partial<GqlShowAdmin | null>>(
      graphql: string,
      args: GqlCreateShowAdminArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'createShowAdmin', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation CreateShowAdmin(
  $showAdminInput: InputShowAdmin!
) {
  createShowAdmin(
    showAdminInput: $showAdminInput
  ) ${graphql}
}
          `,
            operationName: 'CreateShowAdmin',
            variables: {
              showAdminInput: args.showAdminInput,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['createShowAdmin'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async createTemplate<T extends Partial<GqlTemplate | null>>(
      graphql: string,
      args: GqlCreateTemplateArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'createTemplate', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation CreateTemplate(
  $newTemplate: InputTemplate!
) {
  createTemplate(
    newTemplate: $newTemplate
  ) ${graphql}
}
          `,
            operationName: 'CreateTemplate',
            variables: {
              newTemplate: args.newTemplate,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['createTemplate'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async createTimestamp<T extends Partial<GqlTimestamp | null>>(
      graphql: string,
      args: GqlCreateTimestampArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'createTimestamp', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation CreateTimestamp(
  $episodeId: ID!, $timestampInput: InputTimestamp!
) {
  createTimestamp(
    episodeId: $episodeId, timestampInput: $timestampInput
  ) ${graphql}
}
          `,
            operationName: 'CreateTimestamp',
            variables: {
              episodeId: args.episodeId,
              timestampInput: args.timestampInput,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['createTimestamp'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async createTimestampType<T extends Partial<GqlTimestampType | null>>(
      graphql: string,
      args: GqlCreateTimestampTypeArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'createTimestampType', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation CreateTimestampType(
  $timestampTypeInput: InputTimestampType!
) {
  createTimestampType(
    timestampTypeInput: $timestampTypeInput
  ) ${graphql}
}
          `,
            operationName: 'CreateTimestampType',
            variables: {
              timestampTypeInput: args.timestampTypeInput,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['createTimestampType'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async deleteAccount<T extends Partial<GqlAccount | null>>(
      graphql: string,
      args: GqlDeleteAccountArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'deleteAccount', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation DeleteAccount(
  $deleteToken: String!
) {
  deleteAccount(
    deleteToken: $deleteToken
  ) ${graphql}
}
          `,
            operationName: 'DeleteAccount',
            variables: {
              deleteToken: args.deleteToken,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['deleteAccount'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async deleteAccountRequest<T extends Partial<GqlAccount | null>>(
      graphql: string,
      args: GqlDeleteAccountRequestArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'deleteAccountRequest', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation DeleteAccountRequest(
  $passwordHash: String!
) {
  deleteAccountRequest(
    passwordHash: $passwordHash
  ) ${graphql}
}
          `,
            operationName: 'DeleteAccountRequest',
            variables: {
              passwordHash: args.passwordHash,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['deleteAccountRequest'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async deleteEpisode<T extends Partial<GqlEpisode | null>>(
      graphql: string,
      args: GqlDeleteEpisodeArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'deleteEpisode', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation DeleteEpisode(
  $episodeId: ID!
) {
  deleteEpisode(
    episodeId: $episodeId
  ) ${graphql}
}
          `,
            operationName: 'DeleteEpisode',
            variables: {
              episodeId: args.episodeId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['deleteEpisode'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async deleteEpisodeUrl<T extends Partial<GqlEpisodeUrl | null>>(
      graphql: string,
      args: GqlDeleteEpisodeUrlArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'deleteEpisodeUrl', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation DeleteEpisodeUrl(
  $episodeUrl: String!
) {
  deleteEpisodeUrl(
    episodeUrl: $episodeUrl
  ) ${graphql}
}
          `,
            operationName: 'DeleteEpisodeUrl',
            variables: {
              episodeUrl: args.episodeUrl,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['deleteEpisodeUrl'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async deleteShow<T extends Partial<GqlShow | null>>(
      graphql: string,
      args: GqlDeleteShowArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'deleteShow', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation DeleteShow(
  $showId: ID!
) {
  deleteShow(
    showId: $showId
  ) ${graphql}
}
          `,
            operationName: 'DeleteShow',
            variables: {
              showId: args.showId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['deleteShow'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async deleteShowAdmin<T extends Partial<GqlShowAdmin | null>>(
      graphql: string,
      args: GqlDeleteShowAdminArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'deleteShowAdmin', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation DeleteShowAdmin(
  $showAdminId: ID!
) {
  deleteShowAdmin(
    showAdminId: $showAdminId
  ) ${graphql}
}
          `,
            operationName: 'DeleteShowAdmin',
            variables: {
              showAdminId: args.showAdminId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['deleteShowAdmin'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async deleteTemplate<T extends Partial<GqlTemplate | null>>(
      graphql: string,
      args: GqlDeleteTemplateArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'deleteTemplate', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation DeleteTemplate(
  $templateId: ID!
) {
  deleteTemplate(
    templateId: $templateId
  ) ${graphql}
}
          `,
            operationName: 'DeleteTemplate',
            variables: {
              templateId: args.templateId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['deleteTemplate'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async deleteTimestamp<T extends Partial<GqlTimestamp | null>>(
      graphql: string,
      args: GqlDeleteTimestampArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'deleteTimestamp', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation DeleteTimestamp(
  $timestampId: ID!
) {
  deleteTimestamp(
    timestampId: $timestampId
  ) ${graphql}
}
          `,
            operationName: 'DeleteTimestamp',
            variables: {
              timestampId: args.timestampId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['deleteTimestamp'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async deleteTimestampType<T extends Partial<GqlTimestampType | null>>(
      graphql: string,
      args: GqlDeleteTimestampTypeArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'deleteTimestampType', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation DeleteTimestampType(
  $timestampTypeId: ID!
) {
  deleteTimestampType(
    timestampTypeId: $timestampTypeId
  ) ${graphql}
}
          `,
            operationName: 'DeleteTimestampType',
            variables: {
              timestampTypeId: args.timestampTypeId,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['deleteTimestampType'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async removeTimestampFromTemplate<T extends Partial<GqlTemplateTimestamp | null>>(
      graphql: string,
      args: GqlRemoveTimestampFromTemplateArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'removeTimestampFromTemplate', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation RemoveTimestampFromTemplate(
  $templateTimestamp: InputTemplateTimestamp!
) {
  removeTimestampFromTemplate(
    templateTimestamp: $templateTimestamp
  ) ${graphql}
}
          `,
            operationName: 'RemoveTimestampFromTemplate',
            variables: {
              templateTimestamp: args.templateTimestamp,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['removeTimestampFromTemplate'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async resendVerificationEmail<T extends Partial<GqlBoolean | null>>(
      graphql: string,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'resendVerificationEmail', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation ResendVerificationEmail {
  resendVerificationEmail ${graphql}
}
          `,
            operationName: 'ResendVerificationEmail',
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['resendVerificationEmail'];
      } catch (err) {
        if (err.resposne != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async savePreferences<T extends Partial<GqlPreferences | null>>(
      graphql: string,
      args: GqlSavePreferencesArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'savePreferences', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation SavePreferences(
  $preferences: InputPreferences!
) {
  savePreferences(
    preferences: $preferences
  ) ${graphql}
}
          `,
            operationName: 'SavePreferences',
            variables: {
              preferences: args.preferences,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['savePreferences'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async updateEpisode<T extends Partial<GqlEpisode | null>>(
      graphql: string,
      args: GqlUpdateEpisodeArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'updateEpisode', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation UpdateEpisode(
  $episodeId: ID!, $newEpisode: InputEpisode!
) {
  updateEpisode(
    episodeId: $episodeId, newEpisode: $newEpisode
  ) ${graphql}
}
          `,
            operationName: 'UpdateEpisode',
            variables: {
              episodeId: args.episodeId,
              newEpisode: args.newEpisode,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['updateEpisode'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async updateEpisodeUrl<T extends Partial<GqlEpisodeUrl | null>>(
      graphql: string,
      args: GqlUpdateEpisodeUrlArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'updateEpisodeUrl', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation UpdateEpisodeUrl(
  $episodeUrl: String!, $newEpisodeUrl: InputEpisodeUrl!
) {
  updateEpisodeUrl(
    episodeUrl: $episodeUrl, newEpisodeUrl: $newEpisodeUrl
  ) ${graphql}
}
          `,
            operationName: 'UpdateEpisodeUrl',
            variables: {
              episodeUrl: args.episodeUrl,
              newEpisodeUrl: args.newEpisodeUrl,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['updateEpisodeUrl'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async updateShow<T extends Partial<GqlShow | null>>(
      graphql: string,
      args: GqlUpdateShowArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'updateShow', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation UpdateShow(
  $showId: ID!, $newShow: InputShow!
) {
  updateShow(
    showId: $showId, newShow: $newShow
  ) ${graphql}
}
          `,
            operationName: 'UpdateShow',
            variables: {
              showId: args.showId,
              newShow: args.newShow,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['updateShow'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async updateTemplate<T extends Partial<GqlTemplate | null>>(
      graphql: string,
      args: GqlUpdateTemplateArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'updateTemplate', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation UpdateTemplate(
  $templateId: ID!, $newTemplate: InputTemplate!
) {
  updateTemplate(
    templateId: $templateId, newTemplate: $newTemplate
  ) ${graphql}
}
          `,
            operationName: 'UpdateTemplate',
            variables: {
              templateId: args.templateId,
              newTemplate: args.newTemplate,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['updateTemplate'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async updateTimestamp<T extends Partial<GqlTimestamp | null>>(
      graphql: string,
      args: GqlUpdateTimestampArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'updateTimestamp', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation UpdateTimestamp(
  $timestampId: ID!, $newTimestamp: InputTimestamp!
) {
  updateTimestamp(
    timestampId: $timestampId, newTimestamp: $newTimestamp
  ) ${graphql}
}
          `,
            operationName: 'UpdateTimestamp',
            variables: {
              timestampId: args.timestampId,
              newTimestamp: args.newTimestamp,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['updateTimestamp'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async updateTimestamps<T extends Partial<GqlUpdatedTimestamps | null>>(
      graphql: string,
      args: GqlUpdateTimestampsArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'updateTimestamps', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation UpdateTimestamps(
  $create: Array<InputTimestampOn>!, $update: Array<InputExistingTimestamp>!, $delete: Array<ID>!
) {
  updateTimestamps(
    create: $create, update: $update, delete: $delete
  ) ${graphql}
}
          `,
            operationName: 'UpdateTimestamps',
            variables: {
              create: args.create,
              update: args.update,
              delete: args.delete,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['updateTimestamps'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async updateTimestampType<T extends Partial<GqlTimestampType | null>>(
      graphql: string,
      args: GqlUpdateTimestampTypeArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'updateTimestampType', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation UpdateTimestampType(
  $timestampTypeId: ID!, $newTimestampType: InputTimestampType!
) {
  updateTimestampType(
    timestampTypeId: $timestampTypeId, newTimestampType: $newTimestampType
  ) ${graphql}
}
          `,
            operationName: 'UpdateTimestampType',
            variables: {
              timestampTypeId: args.timestampTypeId,
              newTimestampType: args.newTimestampType,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['updateTimestampType'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
    async verifyEmailAddress<T extends Partial<GqlAccount | null>>(
      graphql: string,
      args: GqlVerifyEmailAddressArgs,
      axiosConfig?: AxiosRequestConfig,
    ): Promise<T> {
      try {
        const response: GqlResponse<'verifyEmailAddress', T> = await axios.post(
          '/graphql',
          {
            query: `
mutation VerifyEmailAddress(
  $validationToken: String!
) {
  verifyEmailAddress(
    validationToken: $validationToken
  ) ${graphql}
}
          `,
            operationName: 'VerifyEmailAddress',
            variables: {
              validationToken: args.validationToken,
            },
          },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig?.headers,
              'X-Client-ID': clientId,
            },
          },
        );
        if (response.data.errors != null) {
          throw new GqlError(response.status, response.data.errors);
        }
        return response.data.data['verifyEmailAddress'];
      } catch (err) {
        if (err.response != null) {
          throw new GqlError(err.response.status, err.response.data.errors);
        }
        throw err;
      }
    },
  };

  // Initialize subscriptions
  const subscriptions: {} = {};

  return {
    ...queries,
    ...mutations,
    ...subscriptions,
    axios,
  };
}
