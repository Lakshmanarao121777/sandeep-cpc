import { Globals } from './globals';
import { ErrorType } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';

//TODO move getPaymentConfiguration Call here from common-service.

export function getBlockingErrorMessage(cardBlock:boolean, bankBlock:boolean) : string {
    let  errorMessage = '';

    if (cardBlock && bankBlock) {
        errorMessage = Globals.getInstance().getErrorMessage(ErrorType.system,ErrorType.card_and_bank_block);
    } else if (cardBlock) {
        errorMessage = Globals.getInstance().getErrorMessage(ErrorType.system,ErrorType.card_block);
    } else if (bankBlock) {
        errorMessage = Globals.getInstance().getErrorMessage(ErrorType.system,ErrorType.bank_block);
    }

    return errorMessage;  
}

export function showBlockError(sender:any, eventName:string, message:string, messageDisplayLocation:string, actionObserverService:ActionObserverService): void {
    const data = Object.assign({});
    data.errorMessage = message;
    data.displayMessageLocation = messageDisplayLocation;
    data.showError = true;
    actionObserverService.fire(sender,{detail:{action:eventName,data:data}});        
}