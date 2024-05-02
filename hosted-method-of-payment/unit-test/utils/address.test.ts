import { getAddressDetailsFromChannelData } from '../../src/utils/address';

describe('getAddressDetailsFromChannelData', () => {
    const channelDataEmpty = Object.assign({});
    const channelDataEmptyAddress = Object.assign({'address':'','addressLine2':null, 'city':'', 'state':'', 'zip':''});
    const channelDataValidAddress = Object.assign({'address':'183','addressLine2':'Inverness Dr W', 'city':'Englewood', 'state':'CO', 'zip':'80112'});

    it('Check Address & City values returned from getAddressDetailsFromChannelData method', () => {
        expect(getAddressDetailsFromChannelData(channelDataEmptyAddress).defaultAddress).toBe(undefined);
        expect(getAddressDetailsFromChannelData(channelDataEmptyAddress).address).toBe('');
        expect(getAddressDetailsFromChannelData(channelDataEmptyAddress).addressLine2).toBe(null);
        expect(getAddressDetailsFromChannelData(channelDataValidAddress).city).toBe('Englewood');
    });      
  }
);