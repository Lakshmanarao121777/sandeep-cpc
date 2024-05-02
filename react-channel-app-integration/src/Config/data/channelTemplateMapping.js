import { mappingEnv } from "./modal";

export const DEFAULT_ACCOUNT_TYPE = 'default';
export const CORPORATE_DEFAULT_ACCOUNT_TYPE = 'corporatedefault';
export const CORPORATE_ACCOUNT_TYPE = 'corporate';

export const channelTemplateMapping = [
  {
    'channel': 'CBPC_QUICKPAY',
    'template': 'CardOrBank',
    'accountType': CORPORATE_DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CBPC_ONETIME',
    'template': 'CardOrBank',
    'accountType': CORPORATE_DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CBPC_RECURRING',
    'template': 'CardOrBank',
    'accountType': CORPORATE_DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CBPC_ONETIME',
    'template': 'CardBankOrExisting',
    'accountType': CORPORATE_DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CBPC_RECURRING',
    'template': 'CardBankOrExisting',
    'accountType': CORPORATE_DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'CardOrBank',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'BankOrCard',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'CardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'AchOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'MinCardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'MinAchOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'MinCardOnlyWithEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'CardOrExisting',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'CardBankOrExisting',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'EINSTEIN_TKN',
    'template': 'CardOrBank',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'EINSTEIN_TKN',
    'template': 'CardBankOrExisting',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'EINSTEIN_TKN',
    'template': 'CardOnlyWithEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'EINSTEIN_TKN',
    'template': 'AchOnlyWithEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'XFINITY_MOBILE_LITE_TKN',
    'template': 'MinCardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'XFINITY_MOBILEBUS_LITE',
    'template': 'MinCardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'SMB_LITE',
    'template': 'CardOrBank',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'SMB_LITE',
    'template': 'CardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'SMB_LITE',
    'template': 'AchOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'SMB',
    'template': 'CardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'SMB',
    'template': 'AchOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'MMCES_LITE',
    'template': 'CardOrBank',
    'accountType': CORPORATE_ACCOUNT_TYPE
  },
  {
    'channel': 'MMCES_LITE',
    'template': 'CardOnly',
    'accountType': CORPORATE_ACCOUNT_TYPE
  },
  {
    'channel': 'MMCES_LITE',
    'template': 'AchOnly',
    'accountType': CORPORATE_ACCOUNT_TYPE
  },
  {
    'channel': 'MMCES_ONETIME',
    'template': 'CardOnly',
    'accountType': CORPORATE_ACCOUNT_TYPE
  },
  {
    'channel': 'MMCES_ONETIME',
    'template': 'AchOnly',
    'accountType': CORPORATE_ACCOUNT_TYPE
  },
  {
    'channel': 'MMCES_ONETIME',
    'template': 'MinCardOnly',
    'accountType': CORPORATE_ACCOUNT_TYPE
  },
  {
    'channel': 'MMCES_ONETIME',
    'template': 'MinAchOnly',
    'accountType': CORPORATE_ACCOUNT_TYPE
  },
  {
    'channel': 'XFINITY_MOBILEBUS',
    'template': 'MinCardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'XFINITY_MOBILEBUS',
    'template': 'MinCardOnlyWithEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'XFINITY_MOBILE_TKN',
    'template': 'MinCardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'XFINITY_MOBILE_TKN',
    'template': 'MinCardOnlyWithEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CAFE',
    'template': 'CardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CAFE',
    'template': 'AchOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'CardOnlyWithEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CAFE',
    'template': 'CardOnlyWithEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'AchOnlyWithEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CAFE',
    'template': 'AchOnlyWithEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CAFE',
    'template': 'MinCardOnlyWithEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CAFE',
    'template': 'CardExpirationEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'PREPAID_TKN',
    'template': 'CardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'PREPAID_TKN',
    'template': 'CardOrExisting',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'PREPAID_TKN',
    'template': 'CardExpirationEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'PREPAID_LITE',
    'template': 'CardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'PREPAID_LITE',
    'template': 'CardExpirationEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'XFINITY_MOBILEIG',
    'template': 'CardOrExisting',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'XFINITY_MOBILEIG',
    'template': 'CardBankOrExisting',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'XFINITY_MOBILEIG',
    'template': 'CardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'BSD_DIGITAL_SALES',
    'template': 'CardOrBank',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'BSD_DIGITAL_SALES',
    'template': 'BankOrCard',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CONSUMER_INT',
    'template': 'WalletMgmtNoAutopay',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CBPC_ONETIME',
    'template': 'WalletMgmtNoAutopay',
    'accountType': CORPORATE_DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'CBPC_RECURRING',
    'template': 'WalletMgmtNoAutopay',
    'accountType': CORPORATE_DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'WEB_MY_ACCT',
    'template': 'CardExpirationEdit',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'WEB_MY_ACCT',
    'template': 'CardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'WEB_MY_ACCT',
    'template': 'AchOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'WEB_MY_ACCT',
    'template': 'CardOrBank',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'WEB_MY_ACCT',
    'template': 'CardBankOrExisting',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'WEB_LITE_MY_ACCT',
    'template': 'CardOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'WEB_LITE_MY_ACCT',
    'template': 'AchOnly',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
  {
    'channel': 'WEB_LITE_MY_ACCT',
    'template': 'CardOrBank',
    'accountType': DEFAULT_ACCOUNT_TYPE
  },
];
export const channelEnvironmentKeynameMapping = {
  'local': [
    {
      'channel': 'XFINITY_MOBILEIG',
      'keyName': 'I_XMIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'XFINITY_MOBILEBUSIG',
      'keyName': 'I_XMBUSIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'CAFEIG',
      'keyName': 'I_CAFEIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'EINSTEINIG',
      'keyName': 'I_EINSTEINIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'EINSTEIN_TKN',
      'keyName': 'I_EINSTEIN_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'PREPAIDIG',
      'keyName': 'I_PREPAIDIG_CPC001',
      'iguardEnvironment': 'test'
    }

  ],
  'development': [
    {
      'channel': 'XFINITY_MOBILEIG',
      'keyName': 'I_XMIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'XFINITY_MOBILEBUSIG',
      'keyName': 'I_XMBUSIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'CAFEIG',
      'keyName': 'I_CAFEIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'EINSTEINIG',
      'keyName': 'I_EINSTEINIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'EINSTEIN_TKN',
      'keyName': 'I_EINSTEIN_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'PREPAIDIG',
      'keyName': 'I_PREPAIDIG_CPC001',
      'iguardEnvironment': 'test'
    }
  ],
  'integration': [
    {
      'channel': 'XFINITY_MOBILEIG',
      'keyName': 'I_XMIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'XFINITY_MOBILEBUSIG',
      'keyName': 'I_XMBUSIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'CAFEIG',
      'keyName': 'I_CAFEIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'EINSTEINIG',
      'keyName': 'I_EINSTEINIG_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'EINSTEIN_TKN',
      'keyName': 'I_EINSTEIN_CPC001',
      'iguardEnvironment': 'test'
    },
    {
      'channel': 'PREPAIDIG',
      'keyName': 'I_PREPAIDIG_CPC001',
      'iguardEnvironment': 'test'
    }
  ],
  'preproduction': [
    {
      'channel': 'XFINITY_MOBILEIG',
      'keyName': 'P_XMIG_CPC001',
      'iguardEnvironment': 'preprod'
    },
    {
      'channel': 'XFINITY_MOBILEBUSIG',
      'keyName': 'P_XMBUSIG_CPC001',
      'iguardEnvironment': 'preprod'
    },
    {
      'channel': 'CAFEIG',
      'keyName': 'P_CAFEIG_CPC_001',
      'iguardEnvironment': 'preprod'
    },
    {
      'channel': 'EINSTEINIG',
      'keyName': 'P_EINSTEINIG_CPC001',
      'iguardEnvironment': 'preprod'
    },
    {
      'channel': 'EINSTEIN_TKN',
      'keyName': 'P_EINSTEIN_CPC001',
      'iguardEnvironment': 'preprod'
    },
    {
      'channel': 'PREPAIDIG',
      'keyName': 'P_PREPAIDIG_CPC001',
      'iguardEnvironment': 'preprod'
    }
  ],
  'production': [
    {
      'channel': 'XFINITY_MOBILEIG',
      'keyName': 'P_XMIG_CPC001',
      'iguardEnvironment': 'production'
    },
    {
      'channel': 'XFINITY_MOBILEBUSIG',
      'keyName': 'P_XMBUSIG_CPC001',
      'iguardEnvironment': 'production'
    },
    {
      'channel': 'CAFEIG',
      'keyName': 'P_CAFEIG_CPC_001',
      'iguardEnvironment': 'production'
    },
    {
      'channel': 'EINSTEINIG',
      'keyName': 'P_EINSTEINIG_CPC001',
      'iguardEnvironment': 'production'
    },
    {
      'channel': 'EINSTEIN_TKN',
      'keyName': 'P_EINSTEIN_CPC001',
      'iguardEnvironment': 'production'
    },
    {
      'channel': 'PREPAIDIG',
      'keyName': 'P_PREPAIDIG_CPC001',
      'iguardEnvironment': 'production'
    }
  ]
};