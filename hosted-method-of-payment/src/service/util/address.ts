import { AddressDetails } from '../../model/view.model';

export function getFormattedAddressList(addressObj:any):string { 
    let addressStr = '';
    if(addressObj){
        if(!addressObj.addressLine2 || typeof addressObj.addressLine2 === 'undefined') {
            addressStr= `${addressObj.address}, ${addressObj.city} ${addressObj.state}, ${addressObj.zip}`;
        } else {
            addressStr= `${addressObj.address}, ${addressObj.addressLine2}, ${addressObj.city} ${addressObj.state}, ${addressObj.zip}`;
        }
    }        
    return addressStr;
}
export function createAddressOptionDynamically(componentId:string,addressList:AddressDetails){        
    const addressOption:any = document.createElement('jump-address-option-component');
    addressOption.id = componentId;
    addressOption.addressLabel = addressList.addressLabel;
    addressOption.fullAddress = getFormattedAddressList(addressList);
    return addressOption;
}   

export function createAddressOptionForNewComponent(newAddressId:string,addressFor:string){        
    const newAddressOption:any = document.createElement('jump-address-option-component');
    newAddressOption.id = newAddressId;
    newAddressOption.addressLabel = 'New address';
    newAddressOption.fullAddress = '';
    newAddressOption.addressFor = addressFor;
    return newAddressOption;
}
