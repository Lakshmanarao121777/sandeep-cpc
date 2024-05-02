const env = process.env.CPC_ENV;
const lowerEnvAllowedDomainList = ['xfinity.com','comcast.com','comcast.net','amdocs.com','xfinityprepaid.com','xfinityprepaid.net','cmilvcmdomni','cmilvcmmomni','localhost','illnqw','mwhlvcmd','mwhlvcqdomni','mwhlvcxmomni','mwhlvcmdomni','mwhlvcdpomni','mwhlvcmponi','mwhlvcmmoni','mwhlvcmk','herodigital'];
const prodEnvAllowedDomainList = ['xfinity.com','comcast.com','comcast.net','amdocs.com','xfinityprepaid.com','xfinityprepaid.net','cmilvcmdomni','cmilvcmmomni'];
const autopayChannelList = ['BSD_DIGITAL_SALES'];

if(env === 'preproduction') {
    prodEnvAllowedDomainList.push('localhost');
}

const configDataAll = {
    development: {
        CURRENT_CHANNEL_DOMAIN: { URI:'https://common-payment.dev.xfinity.com' },
        ALLOWED_CHANNEL_DOMAIN_LIST: lowerEnvAllowedDomainList,
        BUSINESS_AUTO_PAY_CHANNEL_LIST: autopayChannelList,
        ALLOWED_CHANNEL_QUANTUM_METRIC : ['XFINITY_MOBILEBUS']
    },
    integration: {
        CURRENT_CHANNEL_DOMAIN : { URI:'https://common-payment.int.xfinity.com' },
        ALLOWED_CHANNEL_DOMAIN_LIST : lowerEnvAllowedDomainList,
        BUSINESS_AUTO_PAY_CHANNEL_LIST: autopayChannelList,
        ALLOWED_CHANNEL_QUANTUM_METRIC : ['XFINITY_MOBILEBUS']
    },
    preproduction: {
        CURRENT_CHANNEL_DOMAIN : { URI:'https://common-payment.preprod.xfinity.com' },
        ALLOWED_CHANNEL_DOMAIN_LIST : prodEnvAllowedDomainList,
        BUSINESS_AUTO_PAY_CHANNEL_LIST: autopayChannelList,
        ALLOWED_CHANNEL_QUANTUM_METRIC : ['XFINITY_MOBILEBUS']
    },
    production: {
        CURRENT_CHANNEL_DOMAIN : { URI:'https://common-payment.xfinity.com' },
        ALLOWED_CHANNEL_DOMAIN_LIST : prodEnvAllowedDomainList,
        BUSINESS_AUTO_PAY_CHANNEL_LIST: autopayChannelList,
        ALLOWED_CHANNEL_QUANTUM_METRIC : ['XFINITY_MOBILEBUS']
    }
};

export let ConfigData = Object.assign({});
if(env === 'development') {
    ConfigData = configDataAll.development;
} else if(env === 'integration') {
    ConfigData = configDataAll.integration;
} else if(env === 'preproduction') {
    ConfigData = configDataAll.preproduction;
} else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.log = () => { };
    ConfigData = configDataAll.production;
}
