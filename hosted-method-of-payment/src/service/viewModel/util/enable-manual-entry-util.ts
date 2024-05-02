import {ACH_ONLY, CARD_ONLY, ACH_ONLY_WITH_EDIT, CARD_ONLY_WITH_EDIT, CPC_CARD_BANK_OR_EXISTING, CARD_OR_EXISTING } from '../../../constant/app.constant';

export const enableManualEntry = (enableManualEntry:any, inputField:any, cpcPageType:string):void => {
    if(cpcPageType === ACH_ONLY.toLowerCase() || cpcPageType === CARD_ONLY.toLowerCase() || cpcPageType === ACH_ONLY_WITH_EDIT.toLowerCase() || cpcPageType === CARD_ONLY_WITH_EDIT.toLowerCase() || cpcPageType === CPC_CARD_BANK_OR_EXISTING.toLowerCase() || cpcPageType === CARD_OR_EXISTING.toLowerCase()) {
        if(enableManualEntry === true) {
            inputField?.addEventListener('contextmenu', (event:any):void => {
                event?.preventDefault();
            });
            inputField?.addEventListener('copy', (event:any):void => {
                event?.preventDefault();
            });
            inputField?.addEventListener('cut', (event:any):void => {
                event?.preventDefault();
            });
        }
    }
};
