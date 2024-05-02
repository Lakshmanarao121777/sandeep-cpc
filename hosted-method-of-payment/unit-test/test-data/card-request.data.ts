import { IViewModel } from "../../src/model/viewModel/view-model";

export class CardRequestData{
    public cpcPageType:string;
    constructor(cpcPageType:string){
        this.cpcPageType = cpcPageType;
    }
    getRequest(): IViewModel {
        const vm:IViewModel = Object.assign({});
        vm.personalInfo= Object.assign({});
        vm.personalInfo.firstName = 'Test First Name';
        vm.personalInfo.lastName = 'Test Last Name';
        vm.personalInfo.addressInfo = Object.assign({});
        vm.personalInfo.addressInfo.address = '3940 Baltimore Avenue';
        vm.personalInfo.addressInfo.addressLine2 = 'Apt 2B';
        vm.personalInfo.addressInfo.city = 'Philadelphia';
        vm.personalInfo.addressInfo.state = 'PA';
        vm.personalInfo.addressInfo.zipCode = '19104';

        vm.cardInfo = Object.assign({});        
        vm.cardInfo.ccNo = '4444 4444 4444 4448';
        vm.cardInfo.expMonth = '12';
        vm.cardInfo.expMonth = '34';
        vm.cardInfo.cvv = '123';
        vm.cardInfo.cardType = 'Visa';
        vm.cpcPageType = this.cpcPageType;
        return vm;
    }
    getEditRequest(): IViewModel {
        const vm:IViewModel = Object.assign({});
        vm.personalInfo= Object.assign({});
        vm.personalInfo.firstName = 'Test First Name';
        vm.personalInfo.lastName = 'Test Last Name';
        vm.personalInfo.addressInfo = Object.assign({});
        vm.personalInfo.addressInfo.address = '3940 Baltimore Avenue';
        vm.personalInfo.addressInfo.addressLine2 = 'Apt 2B';
        vm.personalInfo.addressInfo.city = 'Philadelphia';
        vm.personalInfo.addressInfo.state = 'PA';
        vm.personalInfo.addressInfo.zipCode = '19104';

        vm.cardInfo = Object.assign({});        
        vm.cardInfo.ccNo = '#### #### #### 4448';
        vm.cardInfo.expMonth = '12';
        vm.cardInfo.expMonth = '34';
        vm.cardInfo.cvv = '***';
        vm.cardInfo.cardType = 'Visa';
        vm.cpcPageType = this.cpcPageType;
        return vm;
    }
}