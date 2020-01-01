export interface AppConfig {
  /**
   * If set, the title of the main page.
   */
  albumListPageTitle?: string
  /**
   * URL to the albums list JSON.
   */
  albumListUrl: string;
  /**
   * URL to the folder containing the albums to display.
   */
  albumBaseUrl: string;
  /**
   * Name of the album JSON file, with file extension.
   * NOTE: for a given album, the app will fetch the JSON at albumBaseUrl + albumId + albumFileNameUrl
   */
  albumFileNameUrl: string;
  /**
   * Whether to use Hash URL instead of HTML5 pushState
   */
  useHash: boolean;
  isProduction: boolean;
}
