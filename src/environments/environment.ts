// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

var AdminUrl="http://103.249.98.101:82/admin/data/"; //Dev
//var apiUrl='http://103.249.98.101:3002/'; // Dev URL
//var  apiUrl='http://103.249.98.246:3002/'; // Prod URL
//var  apiUrl='http://192.168.1.156:3002/'; //local
  //var apiUrl='http://192.168.1.156:3003/'; //local soa
var apiUrl='http://103.249.98.101:3000/' //dev soa
//var siteUrl='http://103.249.98.101:82/uppcl';//dev
//var siteUrl='http://103.249.98.101:3000/';  //prod
//var siteUrl='http://103.249.98.101:82'; // dev soa
 var siteUrl="http://localhost:4200";
export const environment = {
  production: false,
  adimageUrl:AdminUrl+"ads/3/",
  missionImage:AdminUrl+"edit_message",
  importantLinksIcones:AdminUrl+"link_icon",
  apiUrl:apiUrl,
  logoUrl:AdminUrl+"other/",
  no_image:"../assets/images/no-image-found.jpg",
  logo_not_found:'../assets/images/no-logo.png',
  icon_img:AdminUrl+"/icon_img/",
  siteUrl:siteUrl
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
