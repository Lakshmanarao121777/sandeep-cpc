// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  domain: 'https://localhost:4200/',
  hostedAppUrl:'integration',
  cssUrl: 'https://common-payment.int.xfinity.com/1.0.0/hosted-method-of-payment/assets/css/jump-light.css',
  paymentType: 'paymentTypeSelection',
  labelCase:'CapOnlyFirst',
  iframeHeight: '880px',
  iframeWidth: '90%',
  iframeBorder: 'none'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *git
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
