import { channelInitData } from './channelInitData';

interface IData {
    key: string;
    value: any;
}
class ChannelDataBuilder {
    public data;
    constructor(initData?: any) {
        this.data = initData;
    }
    updateChannelDetails(values: IData | IData[] | string, value?: any) {
        if (Array.isArray(values)) {
            values.forEach((value) => {
                this.updateChannelDetails(value.key, value.value);
            });
        } else {
            if (typeof values === 'object') {
                this.updateChannelDetails(value.key, value.value);
            } else if (value) {
                const key = values;
                this.data.channelDetails[key] = value;
            }
        }
        return this;
    }
    removeChannelDetails(key: string | string[]) {
        if (Array.isArray(key)) {
            key.forEach((k) => {
                this.removeChannelDetails(key);
            });
        } else {
            delete this.data.channelDetails[key];
        }
        return this;
    }
    updateCustomerDetails(values: IData | IData[] | string, value?: any) {
        if (Array.isArray(values)) {
            values.forEach((value) => {
                this.updateCustomerDetails(value.key, value.value);
            });
        } else {
            if (typeof values === 'object') {
                this.updateCustomerDetails(value.key, value.value);
            } else if (value) {
                const key = values;
                this.data.customerDetails[key] = value;
            }
        }
        return this;
    }
    removeCustomerDetails(key: string | string[]) {
        if (Array.isArray(key)) {
            key.forEach((k) => {
                this.removeChannelDetails(key);
            });
        } else {
            delete this.data.customerDetails[key];
        }
        return this;
    }
    updateConfig(values: IData | IData[] | string, value?: any) {
        if (Array.isArray(values)) {
            values.forEach((value) => {
                this.updateConfig(value.key, value.value);
            });
        } else {
            if (typeof values === 'object') {
                this.updateConfig(value.key, value.value);
            } else if (value) {
                const key = values;
                this.data.config[key] = value;
            }
        }
        return this;
    }
    removeConfig(key: string | string[]) {
        if (Array.isArray(key)) {
            key.forEach((k) => {
                this.removeChannelDetails(key);
            });
        } else {
            delete this.data.config[key];
        }
        return this;
    }
    addAddress(value: any) {
        const addressList = this.data.customerDetails.customerDetails.addressList;
        addressList.push(value);
        this.data.customerDetails.customerDetails.addressList = addressList;
    }
    addUserRole(value: any) {
        const userRoleList = this.data.customerDetails.customerDetails.userRoleList;
        userRoleList.push(value);
        this.data.customerDetails.customerDetails.userRoleList = userRoleList;
    }
    build() {
        return this.data;
    }
}

// Example usage:
const channelData = new ChannelDataBuilder(channelInitData)
    .updateChannelDetails('channelName', 'consumerInt')
    .updateChannelDetails({ key: 'deviceFingerprintId', value: '1111' })
    .updateChannelDetails([
        { key: 'merchantId', value: '1111' },
        { key: 'deviceFingerprintId', value: '1111' },
    ])
    .updateCustomerDetails('enableDarkMode', true)
    .updateConfig('enableDarkMode', true)
    .build();

console.log(channelData);
