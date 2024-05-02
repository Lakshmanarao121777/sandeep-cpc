
export const getAddressDetailsFromChannelData = (channelData: any) => {
    const addressDeatils = {
        defaultAddress: channelData.defaultAddress,
        addressLabel: channelData.addressLabel,
        address: channelData.address,
        addressLine2: channelData.addressLine2,
        city: channelData.city,
        state: channelData.state,
        zip: channelData.zip,
    };
    return addressDeatils;
};


