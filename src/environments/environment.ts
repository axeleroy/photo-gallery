// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {AppConfig} from './AppConfig';

export const environment = {
  // tslint:disable:max-line-length
  albumListPageTitle: 'Albums',
  albumListUrl: 'https://axel-leroy-sh-pictures-storage.s3.eu-central-1.amazonaws.com/albums.json',
  albumBaseUrl: 'https://axel-leroy-sh-pictures-storage.s3.eu-central-1.amazonaws.com/',
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
