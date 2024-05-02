import { UserRoleDetails } from '../../../model/channel-data';
import { ChannelService } from '../../channel-service';
import { Validation } from '../../../utils/validation';
export const getUserRoleUtil = (channel: ChannelService, pageType: string, formSubmitWalletId: string): string => {
    let selectedUser = '';
    const validationService = new Validation();
    // const tc = document.querySelector(`#jump-${pageType}-web-component [name="jump-tc-checkbox"]`) as HTMLInputElement;
    if(channel.channelData?.config?.displayStoredPaymentOption || channel.channelData?.config?.displayAutoPayEnroll){
        if(isStoredPaymentComponentChecked(pageType)){
            const config = validationService.setStoredPaymentValidationSelectionRequirement();
            const storedPaymentValidationSelection = validationService.setStoredPaymentValidationSelection(config.displayAutoPayEnroll, config.displayStoredPaymentMethod, config.requireStoredPaymentSelection, config.selectStoredPaymentOnLoad);
            if (channel.channelData?.config?.enableMultipleUserSelection || storedPaymentValidationSelection.displayStorePaymentComponent) {
                if(channel.channelData.customerDetails?.userRoleList && Array.isArray(channel.channelData.customerDetails?.userRoleList) && channel.channelData.customerDetails?.userRoleList.length > 0){
                    channel.channelData.customerDetails?.userRoleList?.map((userrole: UserRoleDetails) => {
                        const selectedUserWalletId = getSelectedUserWalletId(pageType, userrole);
                        if(selectedUserWalletId) {
                            selectedUser = selectedUserWalletId;
                        }
                    });
                    return selectedUser;
                } else{
                    selectedUser = channel.channelData.customerDetails.walletId;
                } 
            }else{
                selectedUser = channel.channelData.customerDetails.walletId;
            } 
        }else{
            selectedUser = channel.channelData.customerDetails.walletId;
        }
    }else{
        selectedUser = channel.channelData.customerDetails.walletId;
    }

    if (formSubmitWalletId) {
        selectedUser = formSubmitWalletId;
    }
    return selectedUser;
};
export const isStoredPaymentComponentChecked = (pageType:string):boolean => {
    const tc = document.querySelector(`#jump-${pageType}-web-component [name="jump-tc-checkbox"]`) as HTMLInputElement;
    if(tc && tc.checked) {
        return true;
    } else {
        return false;
    }
};
export const getSelectedUserWalletId = (pageType:string, userrole:any):any => {
    const componentId = 'userrole-' + userrole.walletId + '-' + pageType.toLowerCase();
    const inputEle = document.querySelector('#' + maskEscapeChars(componentId) + ' [name="jump-userrole-id"]') as HTMLInputElement;
    let selectedUserWalletId;
    if (inputEle) {
        if (inputEle?.checked) {
            selectedUserWalletId = userrole.walletId;
        }
    }
    return selectedUserWalletId;
};
export const maskEscapeChars = (componentId : string):string =>{
    let componentIdEscaped = componentId;
    componentIdEscaped= componentIdEscaped.replace(/[.*+?^${}()|[\]\\'"]/g, '\\$&');
    return componentIdEscaped;
};
