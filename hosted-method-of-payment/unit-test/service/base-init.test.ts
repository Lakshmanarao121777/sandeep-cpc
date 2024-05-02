/**
 * @jest-environment jsdom
 */
import { createAddressOptionDynamically, createAddressOptionForNewComponent, getFormattedAddressList } from '../../src/service/util/address';
import { ConfigData } from '../test-data/config.data';


describe('', () => {
    describe('Should validate address functions', () => {
        const configData = new ConfigData('mincardonly');
        const address = configData.getAddressObj().address;
        const fullAddress = configData.getAddressObj().fullAddress;


        test('Should Validate Address String Without AddressLine 2', async () => {
            const addressStr = getFormattedAddressList(address);
            expect(addressStr).toEqual('1701 JFK Blvd, Philadelphia PA, 19103');
        });

        test('Should Validate Address String with AddressLine 2', async () => {
            const addressStr = getFormattedAddressList(fullAddress);
            expect(addressStr).toEqual('1701 JFK Blvd, Cals dw, Philadelphia PA, 19103');
        });

        test('Should Validate New Address Elemetnt is created or not', async () => {
            const newAddressObj = createAddressOptionForNewComponent('newAddressOptionAch','cc');
            expect(newAddressObj.addressFor).toEqual('cc');
            expect(newAddressObj.addressLabel).toEqual('New address');
            expect(newAddressObj.fullAddress).toEqual('');
        });

        test('Should Validate dynamic address created or not', async () => {
            const addressObj = createAddressOptionDynamically('newAddressOptionAch',address);
            expect(addressObj.fullAddress).toEqual('1701 JFK Blvd, Philadelphia PA, 19103');
            expect(addressObj.id).toEqual('newAddressOptionAch');
            expect(addressObj.addressLabel).toEqual('Primary Address');
            
        });
    
    });
});