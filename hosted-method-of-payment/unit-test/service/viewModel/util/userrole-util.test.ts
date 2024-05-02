import { ACH, CC } from '../../../../src/constant/app.constant';
import { ChannelService } from '../../../../src/service/channel-service';
import { getUserRoleUtil } from '../../../../src/service/viewModel/util/userrole-util';
import { ViewModelData } from '../../../test-data/view-model.data';

describe('enableManualEntry', () => {
    let inputField: any;
    let addEventListenerSpy: jest.SpyInstance;
    const formSubmitWalletId = 'BA123456.fonrSubmit';
    const viewModelData:ViewModelData = new ViewModelData('cardonly');
    const channelData = new ChannelService(viewModelData.getChannelData());

    beforeEach(() => {
    // Create a mock input field and spy on addEventListener
        inputField = document.createElement('input');
        inputField.setAttribute('type','checkbox');
        inputField.setAttribute('name','jump-tc-checkbox');
        addEventListenerSpy = jest.spyOn(inputField, 'addEventListener');        
        const usrrolelist = document.createElement('div');
        usrrolelist.setAttribute('name','jump-userrole-list');

        channelData.channelData.customerDetails.userRoleList.forEach(userrole => {
            let componentId = 'userrole-' + userrole.walletId + '-' + CC.toLowerCase();
            const useroleDiv = document.createElement('div');
            useroleDiv.setAttribute('id',componentId);
            const inputFieldUr = document.createElement('input');
            inputFieldUr.setAttribute('name','jump-userrole-id');
            addEventListenerSpy = jest.spyOn(inputFieldUr, 'addEventListener'); 
            useroleDiv.append(inputFieldUr);
            usrrolelist.append(useroleDiv);
            componentId = 'userrole-' + userrole.walletId + '-' + ACH.toLowerCase();
            useroleDiv.setAttribute('id',componentId);
            inputFieldUr.setAttribute('name','jump-userrole-id');
            addEventListenerSpy = jest.spyOn(inputFieldUr, 'addEventListener'); 
            useroleDiv.append(inputFieldUr);
        });
        console.log(usrrolelist);
    });

    afterEach(() => {
    // Clear any mocks and reset the input field
        jest.clearAllMocks();
        inputField = null;
    });

    it('get formSubmited WalletId CC', () => {
        const pageType = CC;
        const userrole = getUserRoleUtil(channelData ,pageType, formSubmitWalletId);
        expect(userrole).toBe(formSubmitWalletId);
    });
    it('get config Submitted WalletId CC', () => {
        const pageType = CC;
        const userrole = getUserRoleUtil(channelData ,pageType,'');
        expect(userrole).toBe('cust559903');
    });
    it('get formSubmited WalletId ACH', () => {
        const pageType = ACH;
        const userrole = getUserRoleUtil(channelData ,pageType, formSubmitWalletId);
        expect(userrole).toBe(formSubmitWalletId);
    });
    it('get config Submitted WalletId ACH', () => {
        const pageType = ACH;
        const userrole = getUserRoleUtil(channelData ,pageType,'');
        expect(userrole).toBe('cust559903');
    });
});