// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {AppConfig} from './AppConfig';

export const environment = {
  // tslint:disable:max-line-length
  albumListUrl: 'https://gist.githubusercontent.com/axeleroy/ef1aef17265609bb05457f55a20ee847/raw/1f9324302d8c812b9d3483869041ebf98665e9e5/albums.json',
  albumBaseUrl: 'https://gist.githubusercontent.com/axeleroy/ef1aef17265609bb05457f55a20ee847/raw/1f9324302d8c812b9d3483869041ebf98665e9e5/',
  albumFileNameUrl: '.json',
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
