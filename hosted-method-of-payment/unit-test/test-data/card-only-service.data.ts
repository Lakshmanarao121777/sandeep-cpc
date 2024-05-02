import { IInputReference } from '../../src/model/view.model';
import { IViewModel } from '../../src/model/viewModel/view-model';

export class CardData{
    getCardInfo():IViewModel{
        const cardVm:IViewModel = Object.assign({});
        cardVm.cardInfo = Object.assign({});
        cardVm.cardInfo.ccNo = '44444444444444448';
        cardVm.cardInfo.expMonth = '01';
        cardVm.cardInfo.expYear = '2030';
        cardVm.cardInfo.cvv = '123';
        cardVm.cardInfo.cardType = 'Visa';
        cardVm.personalInfo = Object.assign({});
        cardVm.personalInfo.firstName = 'Test User S';
        cardVm.personalInfo.lastName = 'Test User A';                
        cardVm.personalInfo.addressInfo = Object.assign({});
        cardVm.personalInfo.addressInfo.address = '1701 JFK Blvd';
        cardVm.personalInfo.addressInfo.addressLine2 = 'Studio C';
        cardVm.personalInfo.addressInfo.city = 'Philadelphia';
        cardVm.personalInfo.addressInfo.state = 'PA';
        cardVm.personalInfo.addressInfo.zipCode = '19103';
        return cardVm;
    }
    getInputReference():IInputReference{
        const inputReference = Object.assign({});
        const cardVm = this.getCardInfo();

        inputReference.cc = Object.assign({});
        inputReference.cc.value = cardVm.cardInfo.ccNo;
        inputReference.expMM = Object.assign({});
        inputReference.expMM.value = cardVm.cardInfo.expMonth;
        inputReference.expYY = Object.assign({});
        inputReference.expYY.value = cardVm.cardInfo.expYear;
        inputReference.expiration = Object.assign({});
        inputReference.expiration.value = cardVm.cardInfo.expMonth + '/' + cardVm.cardInfo.expYear;
        inputReference.cvv = Object.assign({});
        inputReference.cvv.value = cardVm.cardInfo.cvv;
        inputReference.cardType = cardVm.cardInfo.cardType;
        inputReference.firstName = Object.assign({});
        inputReference.firstName.value = cardVm.personalInfo.firstName;
        inputReference.lastName = Object.assign({});
        inputReference.lastName.value = cardVm.personalInfo.lastName;
        
        return inputReference;
    }

}