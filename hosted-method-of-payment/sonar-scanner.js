/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-var-requires */

const sonarUrl = process.env.SONAR_URL;
const sonarToken = process.env.SONAR_USER;
const sonarProjectKey = "common-payment.hosted-method-of-payment";

const sonarqubeScanner = require("sonarqube-scanner");

sonarqubeScanner(
  {
    serverUrl: `${sonarUrl}`,
    token: `${sonarToken}`,
    options: {
      "sonar.projectKey": `${sonarProjectKey}`,
      "sonar.sources": "src",
    },
  },
  () => process.exit()
);
