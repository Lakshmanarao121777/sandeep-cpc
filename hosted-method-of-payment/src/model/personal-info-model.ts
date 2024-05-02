import { IAddressModel } from './address-model';

export interface IPersonalInfoModel{
    firstName:string;
    lastName:string;
    addressInfo:IAddressModel;
}
