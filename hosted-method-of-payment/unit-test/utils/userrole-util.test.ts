
import { getUserRoleUtil, isStoredPaymentComponentChecked, getSelectedUserWalletId, maskEscapeChars } from './../../src/service/viewModel/util/userrole-util';

let channel:any = Object.assign({});
channel.channelData = Object.assign({});
channel.channelData.channelDetails = {
    sourceServerId: "localhost",
    sourceSystemId: 'CONSUMER_INT',
    timestamp: new Date().toISOString(), 
    trackingId: 3,
    partnerId: "Comcast",
    channelName: "CONSUMER_INT", 
    enableFraudManager: true,
    cpcMessageDisplayLocation: "top", 
    customerClass:"business",
    requirePaymentMethodSelection:true
  };
  channel.channelData.customerDetails = {
    walletId: 'Dcust559903',
    paymentToken: '6950159517636930504008',
    billingArrangementId:'8919101010393451',
    firstName: 'Art',
    lastName: 'Van',
    displayAddress:false,
    displayAddressOverride:false,
    addressLabel:'Xfinity billing address on file',
    address: "3940 Baltimore Avenue",
    addressLine2: "Apt 2B",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19104",
};
channel.channelData.agentDetails = {
}
channel.channelData.config = {
    displayStoredPaymentOption: true,
    displayAutoPayEnroll: true,
    enableMultipleUserSelection: true,
}
channel.channelData.paymentAmount = '10.00';
channel.channelData.isSubmitPayment = true;
channel.channelData.requirePaymentMethodSelection = true;
channel.channelData.customerDetails.userRoleList = [
    {
      defaultUserRole: true,
      userId:'mendozariley',
      role: 'Primary user',
      walletId: 'cust559904',
    },
    {
      defaultUserRole: false,
      userId:'debbie_d',
      role: 'Account manager',
      walletId: 'cust559905',
    }    
  ];

describe('getUserRoleUtil', () => {
  it('should return selected user when all conditions are met', () => {
    const mockChannel = channel;
    mockChannel.channelData.config = {
        displayStoredPaymentOption: true,
        displayAutoPayEnroll: true,
        enableMultipleUserSelection: true,
      }
    mockChannel.channelData.customerDetails = {
        walletId: 'mockWalletId',
        userRoleList: [
          { walletId: 'userRole1' },
          { walletId: 'userRole2' },
        ],
      }
      document.querySelector = jest.fn(() => ({
        checked: true,
      }));
  
    const pageType = 'cc'
    isStoredPaymentComponentChecked(pageType);
    
    const formSubmitWalletId = 'cust123';

    const result = getUserRoleUtil(mockChannel, pageType, formSubmitWalletId);
    expect(result).toBe('userRole2'); // Assuming the first user is selected
  });

  it('should return formSubmitWalletId when provided', () => {
    const mockChannel = channel
    mockChannel.channelData.config = {
        displayStoredPaymentOption: true,
        displayAutoPayEnroll: true,
        enableMultipleUserSelection: true,
      }
    mockChannel.channelData.customerDetails = {
        walletId: 'mockWalletId',
        userRoleList: [],
      }
    const pageType = 'mockPageType';
    const formSubmitWalletId = 'formSubmitWalletId';

    const result = getUserRoleUtil(mockChannel, pageType, formSubmitWalletId);
    expect(result).toBe('formSubmitWalletId');
  });
  it('should return formSubmitWalletId when enableMultipleUserSelection is false', () => {
    const mockChannel = channel
    mockChannel.channelData.config = {
        displayStoredPaymentOption: true,
        displayAutoPayEnroll: true,
        enableMultipleUserSelection: false,
      }
    mockChannel.channelData.customerDetails = {
        walletId: 'mockWalletId',
        // userRoleList: [
        //     { walletId: 'userRole1' },
        //     { walletId: 'userRole2' },
        // ],
      }
    const pageType = 'mockPageType';
    const formSubmitWalletId = 'formSubmitWalletId';

    const result = getUserRoleUtil(mockChannel, pageType, formSubmitWalletId);
    expect(result).toBe('formSubmitWalletId');
  });
  it('should return formSubmitWalletId when displayStoredPaymentOption is false', () => {
    const mockChannel = channel
    mockChannel.channelData.config = {
        displayStoredPaymentOption: false,
        displayAutoPayEnroll: true,
        enableMultipleUserSelection: false,
      }
    mockChannel.channelData.customerDetails = {
        walletId: 'mockWalletId',
        // userRoleList: [
        //     { walletId: 'userRole1' },
        //     { walletId: 'userRole2' },
        // ],
      }
    const pageType = 'mockPageType';
    const formSubmitWalletId = 'formSubmitWalletId';

    const result = getUserRoleUtil(mockChannel, pageType, formSubmitWalletId);
    expect(result).toBe('formSubmitWalletId');
  });
  it('should return formSubmitWalletId when displayStoredPaymentOption is false and enableMultipleUserSelection is true', () => {
    const mockChannel = channel
    mockChannel.channelData.config = {
        displayStoredPaymentOption: false,
        displayAutoPayEnroll: true,
        enableMultipleUserSelection: true,
      }
    mockChannel.channelData.customerDetails = {
        walletId: 'mockWalletId',
        // userRoleList: [
        //     { walletId: 'userRole1' },
        //     { walletId: 'userRole2' },
        // ],
      }
    const pageType = 'mockPageType';
    const formSubmitWalletId = 'formSubmitWalletId';

    const result = getUserRoleUtil(mockChannel, pageType, formSubmitWalletId);
    expect(result).toBe('formSubmitWalletId');
  });
  it('should return config walletId', () => {
    const mockChannel = channel
    mockChannel.channelData.config = {
        displayStoredPaymentOption: false,
        displayAutoPayEnroll: true,
        enableMultipleUserSelection: false,
      }
    mockChannel.channelData.customerDetails = {
        walletId: 'mockWalletId',
        // userRoleList: [
        //     { walletId: 'userRole1' },
        //     { walletId: 'userRole2' },
        // ],
      }
    const pageType = 'mockPageType';
    const formSubmitWalletId = 'formSubmitWalletId';

    const result = getUserRoleUtil(mockChannel, pageType, '');
    expect(result).toBe('mockWalletId');
  });

  // Add more test cases for different scenarios
});

describe('isTcChecked', () => {
  it('should return true when tc checkbox is checked', () => {
    // Mock document.querySelector to return a checked checkbox
    document.querySelector = jest.fn(() => ({
      checked: true,
    }));

    const pageType = 'mockPageType';
    const result = isStoredPaymentComponentChecked(pageType);
    expect(result).toBe(true);
  });

  it('should return false when tc checkbox is not checked', () => {
    // Mock document.querySelector to return an unchecked checkbox
    document.querySelector = jest.fn(() => ({
      checked: false,
    }));

    const pageType = 'mockPageType';
    const result = isStoredPaymentComponentChecked(pageType);
    expect(result).toBe(false);
  });

  // Add more test cases for different scenarios
});

describe('getSelectedUserWalletId', () => {
  it('should return selected user role when inputEle is checked', () => {
    // Mock document.querySelector to return a checked input element
    document.querySelector = jest.fn(() => ({
      checked: true,
    }));

    const pageType = 'mockPageType';
    const userRole = { walletId: 'userRole1' };
    const result = getSelectedUserWalletId(pageType, userRole);
    expect(result).toBe('userRole1');
  });

  it('should return undefined when inputEle is not checked', () => {
    // Mock document.querySelector to return an unchecked input element
    document.querySelector = jest.fn(() => ({
      checked: false,
    }));

    const pageType = 'mockPageType';
    const userRole = { walletId: 'userRole1' };
    const result = getSelectedUserWalletId(pageType, userRole);
    expect(result).toBe(undefined);
  });

  // Add more test cases for different scenarios
});

describe('maskEscapeChars', () => {
  it('should escape special characters', () => {
    const input = 'userrole-$1-page';
    const result = maskEscapeChars(input);
    expect(result).toBe('userrole-\\$1-page');
  });

  // Add more test cases for different scenarios
});
