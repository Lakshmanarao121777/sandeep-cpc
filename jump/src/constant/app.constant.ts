/* eslint @typescript-eslint/no-var-requires: "off" */
const ConfigData = require('ConfigData');
export const EVN_CPC_READY = 'CPC_READY';
export const EVN_CPC_CONFIG_SUBMIT = 'CPC_CONFIG_SUBMIT';
export const EVN_CPC_CONFIG_READY = 'CPC_CONFIG_READY';
export const EVN_CPC_FORM_SUBMIT_RESPONSE = 'CPC_FORM_SUBMIT_RESPONSE';
export const EVN_CPC_PAGE_RESIZE = 'CPC_PAGE_RESIZE';
export const ERR_MESSAGE_IFRAME = 'We are experiencing system issues, please try again later.';
//export const ERR_CPC_ENV = 'Please provide the correct cpc environment.';
//export const ERR_CPC_PAGE_TYPE = 'Please provide the correct cpc page type.';
export const CPC_ERROR = 'CPC_ERROR';
export const ERR_HOSTED_APP_NOT_FOUND = 'Channel is not configured to load page on hosted method of payment!';
export const CURRENT_CHANNEL_DOMAIN = ConfigData.CURRENT_CHANNEL_DOMAIN;
export const ALLOWED_CHANNEL_DOMAIN_LIST = ConfigData.ALLOWED_CHANNEL_DOMAIN_LIST;
export const DEFAULT_ACCOUNT_TYPE = 'default';
export const CORPORATE_DEFAULT_ACCOUNT_TYPE = 'corporatedefault';
export const CORPORATE_ACCOUNT_TYPE = 'corporate';
