// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {AppConfig} from './AppConfig';

export const environment = {
  // tslint:disable:max-line-length
  albumListPageTitle: 'PhotoGallery',
  albumListUrl: 'http://127.0.0.1:4000/assets/json/albums.json',
  albumBaseUrl: 'https://d2ef3t29h6sl4.cloudfront.net/',
  albumFileNameUrl: '/album.json',
  useHash: false,
  isProduction: false
} as AppConfig;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
