import { ACCOUNT_TYPE_COMPONENT, ACH_COMPONENT, ADDRESS_COMPONENT, CARD_COMPONENT, MIN_ACH_COMPONENT, USERROLE_LIST_COMPONENT_CC, USERROLE_LIST_COMPONENT_ACH  } from '../constant/app.constant';
import { ActionObserverService } from '../service/action-observer-service';

export class Globals {
    private static instance: Globals = Globals.getInstance();
    public appState: Map<string, any>;
    public templates: Map<string, string>;
    public errorMessageList: any;
    public errorMessageMap: Map<string, string>;
    public errorMessageResponse: any;
    public globalContentList: any;
    public globalContentResponse: any;
    public globalContentMap: Map<string, string>;
    public actionObserverService: ActionObserverService;
    public templateContent: any = Object.assign({});
    public subscriptionMap: Map<string, boolean>;
    public updateVmMap: Map<string, boolean>;

    // Constructor will set
    private constructor() {
        this.appState = new Map<string, any>();
        this.subscriptionMap = new Map<string, boolean>();
        this.updateVmMap = new Map<string, boolean>();
        this.templates = new Map<string, string>();
        this.errorMessageList = Object.assign({});
        this.globalContentList = Object.assign({});
        this.errorMessageMap = new Map<string, string>();
        this.globalContentMap = new Map<string, string>();
        this.actionObserverService = new ActionObserverService();
        this.subsConfig();
        this.updateMap();
        this.fillTemplate();
    }
    private updateMap() {
        this.updateVmMap.set(CARD_COMPONENT, false);
        this.updateVmMap.set(ADDRESS_COMPONENT, false);
        this.updateVmMap.set(ACH_COMPONENT, false);
        this.updateVmMap.set(ACCOUNT_TYPE_COMPONENT, false);
        this.updateVmMap.set(MIN_ACH_COMPONENT, false);
        this.updateVmMap.set(USERROLE_LIST_COMPONENT_CC, false);
        this.updateVmMap.set(USERROLE_LIST_COMPONENT_ACH, false);
    }


    private subsConfig() {
        this.subscriptionMap.set('CardOnlyWebComponent', false);
        this.subscriptionMap.set('AddressWebComponentCc', false);
        this.subscriptionMap.set('AddressWebComponentAch', false);
        this.subscriptionMap.set('AddressOptionWebComponent', false);
        this.subscriptionMap.set('AccountTypeWebComponent', false);
        this.subscriptionMap.set('AchOnlyWebComponent', false);
        this.subscriptionMap.set('MinCardOnlyWebComponent', false);
        this.subscriptionMap.set('MinAchOnlyWebComponent', false);
        this.subscriptionMap.set('CardListWebComponent', false);
        this.subscriptionMap.set('AutoPayWebComponentAch', false);
        this.subscriptionMap.set('AutoPayWebComponentCc', false);
        this.subscriptionMap.set('TermsWebComponentAch', false);
        this.subscriptionMap.set('TermsWebComponentCc', false);
        this.subscriptionMap.set('DefaultPaymentWebComponentCc', false);
        this.subscriptionMap.set('DefaultPaymentWebComponentAch', false);

        this.subscriptionMap.set('UserroleListWebComponentCc', false);
        this.subscriptionMap.set('UserroleListWebComponentAch', false);
        this.subscriptionMap.set('UserroleWebComponent', false);
    }

    // Return the instance of the service as singleton
    public static getInstance(): Globals {
        // set new instance if current instance is null
        if (Globals.instance === null || Globals.instance === undefined) {
            Globals.instance = new Globals();
        }

        return Globals.instance;
    }

    //Reset All Data 
    public RemoveAll(): void {
        this.appState.clear();
    }
    public fillTemplate(){
        this.templates.set('CardOnly','cardonly');
        this.templates.set('AchOnly','achonly');
        this.templates.set('CardOrBank','cardorbank');
        this.templates.set('MinCardOnly','mincardonly');
        this.templates.set('MinCardOnlyWithEdit','mincardonlywithedit');
        this.templates.set('CardOrExisting','cardorexisting');
        this.templates.set('CardBankOrExisting','cardbankorexisting');
        this.templates.set('MinAchOnly','minachonly');
        this.templates.set('CardOnlyWithEdit','cardonlywithedit');
        this.templates.set('AchOnlyWithEdit','achonlywithedit');
        this.templates.set('WalletMgmtNoAutopay','walletmgmtnoautopay');
        this.templates.set('BankOrCard','bankorcard');
        this.templates.set('BankCardOrExisting','bankcardorexisting');
        this.templates.set('CardExpirationEdit','cardexpirationedit');
    }
    private getErrorCode(key: string, subKey1?: string, subKey2?: string, subKey3?: string, subKey4?: string): string {
        const errorList: any = this.errorMessageList;
        if (!errorList || !errorList.channel) return '';
        let result = Object.assign({});

        const getDefaultErrorText = (result: string, cat: string): string => {
            if (!result) {
                result = errorList[cat].default;
            }
            return result;
        };

        switch (key) {
        case 'form':
            if (subKey1) {
                if (subKey2) {
                    if (subKey3) {
                        if (subKey4) {
                            result = errorList.form[subKey1][subKey2][subKey3][subKey4];
                        } else {
                            result = errorList.form[subKey1][subKey2][subKey3];
                        }

                    } else {
                        result = errorList.form[subKey1][subKey2];
                    }
                } else {
                    result = errorList.form[subKey1];
                }
            } else {
                result = errorList.form.default;
            }
            result = getDefaultErrorText(result, 'form');
            break;
        case 'service':
            if (subKey1) {
                result = errorList.service[subKey1];
            } else {
                result = errorList.service.default;
            }
            result = getDefaultErrorText(result, 'service');
            break;
        case 'communication':
            if (subKey1) {
                result = errorList.communication[subKey1];
            } else {
                result = errorList.communication.default;
            }
            result = getDefaultErrorText(result, 'communication');
            break;
        case 'system':
            if (subKey1) {
                result = errorList.system[subKey1];
            } else {
                result = errorList.system.default;
            }
            result = getDefaultErrorText(result, 'system');
            break;
        }
        result = getDefaultErrorText(result, 'system');
        return result;
    }

    private getErrorDescription(key: string): string | undefined {
        return this.errorMessageMap.get(key);
    }
    public getErrorMessage(key: string, subKey1?: string, subKey2?: string, subKey3?: string, subKey4?: string): string {
        const errorKey = this.getErrorCode(key, subKey1, subKey2, subKey3, subKey4);
        let errorMessage = this.getErrorDescription(errorKey);
        if (!errorMessage) {
            errorMessage = '';
        }
        return errorMessage;
    }
    public getContentDescription(key: string, subKey1?: string, subKey2?: string, subKey3?: string, subKey4?: string): string {
        const contentList: any = this.globalContentList;
        if (!contentList || !contentList.channel) return '';
        let result = Object.assign({});
        const getDefaultErrorText = (result: string, cat: string): string => {
            if (!result) {
                result = contentList[cat].default;
            }
            return result;
        };
        switch (key) {
        case 'auto-pay-base-template':
            if (subKey1) {
                if (subKey2) {
                    if (subKey3) {
                        if (subKey4) {
                            result = contentList[key][subKey1][subKey2][subKey3][subKey4];
                        } else {
                            result = contentList[key][subKey1][subKey2][subKey3];
                        }

                    } else {
                        result = contentList[key][subKey1][subKey2];
                    }
                } else {
                    result = contentList[key][subKey1];
                }
            } else {
                result = contentList[key].default;
            }

            result = getDefaultErrorText(result, 'auto-pay-base-template');
            break;
        case 'terms-conditions-base-template':
            if (subKey1) {
                if (subKey2) {
                    if (subKey3) {
                        if (subKey4) {
                            result = contentList[key][subKey1][subKey2][subKey3][subKey4];
                        } else {
                            result = contentList[key][subKey1][subKey2][subKey3];
                        }

                    } else {
                        result = contentList[key][subKey1][subKey2];
                    }
                } else {
                    result = contentList[key][subKey1];
                }
            } else {
                result = contentList[key].default;
            }
            result = getDefaultErrorText(result, 'terms-conditions-base-template');
            break;
        case 'card-only-base-template':
            if (subKey1) {
                if (subKey2) {
                    if (subKey3) {
                        if (subKey4) {
                            result = contentList[key][subKey1][subKey2][subKey3][subKey4];
                        } else {
                            result = contentList[key][subKey1][subKey2][subKey3];
                        }

                    } else {
                        result = contentList[key][subKey1][subKey2];
                    }
                } else {
                    result = contentList[key][subKey1];
                }
            } else {
                result = contentList[key].default;
            }
            result = getDefaultErrorText(result, 'card-only-base-template');
            break;
        case 'wallet-mgmt-no-autopay-template':
            if (subKey1) {
                if (subKey2) {
                    if (subKey3) {
                        if (subKey4) {
                            result = contentList[key][subKey1][subKey2][subKey3][subKey4];
                        } else {
                            result = contentList[key][subKey1][subKey2][subKey3];
                        }

                    } else {
                        result = contentList[key][subKey1][subKey2];
                    }
                } else {
                    result = contentList[key][subKey1];
                }
            } else {
                result = contentList[key].default;
            }
            result = getDefaultErrorText(result, 'wallet-mgmt-no-autopay-template');
            break;
        case 'user-selection-base-title':
            if (subKey1) {
                if (subKey2) {
                    if (subKey3) {
                        if (subKey4) {
                            result = contentList[key][subKey1][subKey2][subKey3][subKey4];
                        } else {
                            result = contentList[key][subKey1][subKey2][subKey3];
                        }

                    } else {
                        result = contentList[key][subKey1][subKey2];
                    }
                } else {
                    result = contentList[key][subKey1];
                }
            } else {
                result = contentList[key].default;
            }
            result = getDefaultErrorText(result, 'user-selection-base-title');
            break;
        }
        return result;
    }
    public getContent(key: string, subKey1?: string, subKey2?: string, subKey3?: string, subKey4?: string): string {
        const contentDescription = this.getContentDescription(key, subKey1, subKey2, subKey3, subKey4);
        if (!contentDescription) {
            return '';
        }
        return contentDescription;
    }
}