import { FetchData } from '../api/fetch-data';
import { JUMP_CARD_LIST_COMPONENT_LOADED, JUMP_NEW_CARD_OPTION, JUMP_NEW_BANK_OPTION, JUMP_NEW_PAYMENT_OPTION, 
    JUMP_ACH_COMPONENT_RESET, JUMP_ACCOUNT_TYPE_COMPONENT_RESET, JUMP_ACH_ADDRESS_COMPONENT_RESET, JUMP_CC_COMPONENT_RESET, 
    JUMP_CC_ADDRESS_COMPONENT_RESET, JUMP_AUTO_PAY_COMPONENT_RESET, JUMP_TC_COMPONENT_RESET, NEW_PAYMENT_OPTION_RADIO, ACH, CC, 
    JUMP_UPDATE_VIEW_MODEL, EVN_CPC_MANAGE_PAYMENT_MODAL, CURRENT_CHANNEL_DOMAIN, CPC_WALLET_MGMT_NO_AUTOPAY_EDIT_SELECTED, 
    CPC_WALLET_MGMT_NO_AUTOPAY_REMOVE_SELECTED, WALLET_MGMT_NO_AUTOPAY, DELETE, JUMP_ERROR_MESSAGE_LOADED, CARD_EXPIRATION_EDIT, CPC_GLOBAL_IMAGES_CARD_URL, CPC_GLOBAL_CONTENT_MAPPING_URL, CPC_GLOBAL_IMAGES_BANK_URL,
    CPC_CARD_EXPIRATION_EDIT_CANCEL_SELECTED, CPC_CARD_EXPIRATION_EDIT_UPDATE_SELECTED, CPC_CARD_EXPIRATION_EDIT_EDIT_SELECTED, CPC_CARD_EXPIRATION_EDIT_REMOVE_SELECTED
} from '../constant/app.constant';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';
import { DataLayerService } from '../service/data-layer.service';
import { Validation } from '../utils/validation';
import { setIcon } from '../utils/card-type';
import { IViewModel } from '../model/viewModel/view-model';
import { WALLET_MGMT_CANCEL_TEXT, WALLET_MGMT_REMOVE_TEXT, WALLET_MGMT_MANAGE_AUTO_PAY_TEXT, WALLET_MGMT_VIEW_SCHEDULED_PAYMENTS_TEXT} from '../constant/modal.constant';
import { LABEL_SAVINGS, LABEL_CHECKING, SERVICE_SAVINGS_VALUE, SERVICE_CHECKING_VALUE, LABEL_CORPORATE_CHECKING, SERVICE_CORPORATE_CHECKING_VALUE, translatePaymentServiceBankAccountTypeToLabel } from '../constant/bank-account-type';
import { waitForElementToLoad } from '../utils/elementLoader';
export class CardListWebComponent extends HTMLElement {  
    _content: DocumentFragment = Object.assign({});
    cardListActionDispatcher:ActionObserverService;
    _paymentlistfor = '';
    _cardImage = '';
    _cardNo = '';
    _cardType = '';
    _paymentToken = '';
    _cardDescription = '';
    _cardExpiry = '';
    _routerNo = '';
    _defaultInstrument = 'false';
    _autoPayLabel = '';
    _walletId = '';
    global:Globals;
    public validations = new Validation();
    private dataLayerService:DataLayerService = Object.assign({});
    private fetchData:FetchData;
    static get observedAttributes(): string[] {
        return ['payment-list-for','payment-token','router-no','card-url','card-no','card-type','default-instrument','autopay-label','card-description','card-expiry', 'wallet-id'];
    }
    get routerNo(){
        return this._routerNo;
    } 
    set routerNo(value) {
        if(value) {
            this.setAttribute('router-no', value);
            this._routerNo = value;
        }
    }
    get walletId(){
        return this._walletId;
    } 
    set walletId(value) {
        if(value) {
            this.setAttribute('wallet-id', value);
            this._walletId = value;
        }
    }
    get PaymentToken(){
        return this._paymentToken;
    } 
    set PaymentToken(value) {
        if(value) {
            this.setAttribute('payment-token', value);
            this._paymentToken = value;
        }
    }
    get PaymentListFor(){
        return this._paymentlistfor;
    } 
    set PaymentListFor(value) {
        if(value) {
            this.setAttribute('payment-list-for', value);
            this._paymentlistfor = value;
        }
    }
    get cardImage(){
        return this._cardImage;
    } 
    set cardImage(value) {
        if(value) {
            this.setAttribute('card-url', value);
            this._cardImage = value;
        }
    }
    get cardNo(){
        return this._cardNo;
    } 
    set cardNo(value) {
        if(value) {
            this.setAttribute('card-no', value);
            this._cardNo = value;
        }
    }
    get cardType(){
        return this._cardType;
    } 
    set cardType(value) {
        if(value) {
            this.setAttribute('card-type', value);
            this._cardType = value;
        }
    }
    get cardDescription(){
        return this._cardDescription;
    } 
    set cardDescription(value) {
        if(value) {
            this.setAttribute('card-description', value);
            this._cardDescription = value;
        }
    }
    get cardExpiry(){
        return this._cardExpiry;
    } 
    set cardExpiry(value) {
        if(value) {
            this.setAttribute('card-expiry', value);
            this._cardExpiry = value;
        }
    }
    get defaultInstrument(){
        return this._defaultInstrument;
    } 
    set defaultInstrument(value) {
        if(value) {
            this.setAttribute('default-instrument', value);
            this._defaultInstrument = value;
        }
    }
    get autoPayLabel(){
        return this._autoPayLabel;
    }
    set autoPayLabel(value) {
        if(value) {
            this.setAttribute('autopay-label', value);
            this._autoPayLabel = value;
        }
    }
    constructor(){
        super();        
        this._content = new DocumentFragment();
        this.global = Globals.getInstance();
        this.cardListActionDispatcher = Globals.getInstance().actionObserverService;
        this.dataLayerService = new DataLayerService();
        this.fetchData = new FetchData();
        this.init();        
    }
    // attributeChangedCallback(attrName:string, oldValue:string, newValue:string) :void {}
    init(): void {     
        if(!this._content) {
            return;
        }
        const rootUrl = this.global.appState.get('config').envConfig.cpcEnv.split('/');
        const displayTcStyle = this.global.appState.get('channelData')?.config?.displayExistingListType;
        let url:string = this.global.appState.get('config').envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/base/card-list-base-template.html';
        if(displayTcStyle && displayTcStyle === 'stacked') {
            url = this.global.appState.get('config').envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/base/card-list-label-base-template.html';
        }
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
        if (cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
            url = this.global.appState.get('config').envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/base/card-list-edit-base-template.html';
        } 
        if (cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
            url = this.global.appState.get('config').envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/base/card-list-expiration-edit-base-template.html';
        }  
        this.fetchTemplate(url);            
    }
    async fetchTemplate(url: string) { 
        const data  = await this.fetchData.get(url);
        if(data) {
            this.render(data);
            this.cardListActionDispatcher.fire(this,{detail: {action : JUMP_CARD_LIST_COMPONENT_LOADED, componentId:this.id}});            
        }
    }
    render(data: any): void {
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');      
        const template = Object.assign({});
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
        if(cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
            template.cc = domContent.documentElement.querySelector('[id="CardListExpirationEditBaseTemplate"]');
        } else {
            template.cc = domContent.documentElement.querySelector('[id="CardListBaseTemplate"]');
        }
        if(template.cc){
            template.ccContent =template.cc?.content?.cloneNode(true);
            this._content.appendChild(template.ccContent);            
            this.appendChild(this._content);  
            this.setTemplateProps();            
        }
    }
    setTemplateProps(){
        const globalUrl = this.global.appState.get('config').envConfig.globalUrl;
        const componentId = this.id;
        let cardDesc:any = document.querySelector('#' + componentId + ' [name="jump-card-description"]');
        const cardExpiry:any = document.querySelector('#' + componentId + ' [name="jump-card-expiry"]');
        const cardListOption:any = document.querySelector('#' + componentId + ' [name="jump-card-list-option"]');
        const cardDefault:any = document.querySelector('#' + componentId + ' [name="jump-card-default"]');
        const cardAutoPay:any = document.querySelector('#' + componentId + ' [name="jump-card-autopay"]');
     
        document.querySelector('#' + componentId + ' [name="jump-card-list-option"]')?.setAttribute('aria-labelledby',`${componentId}`); // input
        document.querySelector('#' + componentId + ' [name="jump-card-description"]')?.setAttribute('id',`${componentId}`); // label
        
        cardListOption?.addEventListener('click',(e:any)=>{this.handleClick(e);});
        const isExpired = this.checkExpire(this.cardExpiry);
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
        let cardImage:any = '';
        if(document.querySelector('#' + componentId + ' [name="jump-card-url"]')){
            cardImage = document.querySelector('#' + componentId + ' [name="jump-card-url"]');
        }
        let cardType = '';
        let cardTypeImage = '';
        if(this.cardType?.toLowerCase() === 'visa'){
            cardType = 'Visa';
            cardTypeImage = 'visa.png';
        }else if(this.cardType?.toLowerCase() === 'mastercard'){
            cardType = 'Master Card';
            cardTypeImage = 'mastercard.png';
        }
        else if(this.cardType?.toLowerCase() === 'amex' || this.cardType?.toLowerCase() === 'americanexpress' || this.cardType?.toLowerCase() === 'american express'){
            cardType = 'Amex';
            cardTypeImage = 'amex.png';
        }
        else if(this.cardType?.toLowerCase() === 'discover'){
            cardType = 'Discover';
            cardTypeImage = 'discover.png';
        }
        else if(this.cardType?.toLowerCase() === 'bank'){
            cardType = 'Bank';
            cardTypeImage = 'bank-icon.svg';
        }
        let url = this.id === JUMP_NEW_CARD_OPTION ? '': `${globalUrl}${CPC_GLOBAL_IMAGES_CARD_URL}${cardTypeImage}`;
        let expiresText =  this.id === JUMP_NEW_CARD_OPTION ? '': this.PaymentListFor?.toLowerCase() === 'bank' ? this.cardExpiry : `Expires ${this.cardExpiry}`;
        const isDisabled = this.global.appState.get('channelData')?.config?.disableExpiredCards;
        if(!isExpired) {
            if(cardListOption) {
                cardListOption.checked = this.defaultInstrument === 'true'? true:false;
            }
            if(cardDefault) {
                cardDefault.innerHTML = this.defaultInstrument === 'true'? 'Default':'';
            }
            if(cardAutoPay){
                cardAutoPay.innerHTML = this.autoPayLabel === 'autopay' ? 'Automatic Payment':'';
            }
            if((cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase() || cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) && this.defaultInstrument === 'true') {
                if(cardDefault?.innerHTML === 'Default') {
                    cardDefault.style.padding = '0.35em 0.65em';
                }
            }
        }
        if(isExpired && isDisabled) {
            expiresText =  this.id === JUMP_NEW_CARD_OPTION ? '': `Expired ${this.cardExpiry}`;
            cardExpiry.classList.add('text-danger');
            cardListOption.parentElement?.parentElement?.classList?.add('disabled-radio-row');
            cardListOption.disabled = isDisabled;
            cardListOption.removeEventListener('click',(e:any)=>{this.handleClick(e);});
        }   
        if(this.PaymentListFor?.toLowerCase() === 'bank') {
            url = `${globalUrl}${CPC_GLOBAL_IMAGES_BANK_URL}${cardTypeImage}`;
        }
        if (cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
            this.cardListEdit();
            this.cardListRemove();
            const editIconId = '#' + componentId + ' [id="jump-pencil-square-icon"]';
            const editIcon:any = waitForElementToLoad(editIconId).then((element:any) => {
                setIcon(element,'pencil-square', this);
            });

            const removeIconId = '#' + componentId + ' [id="jump-trash-icon"]';
            const removeIcon:any = waitForElementToLoad(removeIconId).then((element:any) => {
                setIcon(element,'trash',this);
            });
            const desc:any = this.editTemplate(expiresText, componentId, url);
            url = desc?.url;
            expiresText = desc?.expiresText;
           
        }
        if(cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
            const bankTemplate =  document.querySelector('#bank-style-box');
            const cardTemplate = document.querySelector('#card-style-box');
            const cardEdit = document.querySelector('#cardListPlaceholderCard [name="jump-cee-col-edit"]');
            const bankEdit = document.querySelector('#cardListPlaceholderBank [name="jump-cee-col-edit"]');
            const bankRow = document.querySelector('#cardListPlaceholderBank [name="jump-cee-row-1-b"]');
            const cardRow = document.querySelector('#cardListPlaceholderCard [name="jump-cee-row-1-b"]');
        
            if(cardTemplate) {
                cardTemplate?.classList?.remove('card-style-box');
                cardEdit?.classList?.remove('jump-cee-col-edit');
                cardRow?.classList?.remove('jump-cee-row-1-b');
            }
            if(bankTemplate) {
                bankTemplate?.classList?.remove('bank-style-box');
                bankEdit?.classList?.remove('jump-cee-col-edit');
                bankRow?.classList?.remove('jump-cee-row-1-b');
            }
           
      
            this.cardListEdit();
            this.cardListRemove();
            const desc:any = this.editTemplate(expiresText, componentId, url);
            url = desc?.url;
            expiresText = desc?.expiresText;
        }
        if(this.cardType?.toLowerCase() === 'newpayment') {
            expiresText= '';
            url = '';
        }
        const newPaymentOption = this.global.appState.get('channelData')?.config?.newPaymentDisplayType;
        if(newPaymentOption === NEW_PAYMENT_OPTION_RADIO) {
            if(this.id === JUMP_NEW_BANK_OPTION) {
                url = '';
                expiresText = '';
            }
            if(this.id === JUMP_NEW_CARD_OPTION) {
                url = '';
                expiresText =  '';   
            }
        } 
        if(cardImage) {
            cardImage.src = url;
            // cardImage.alt = cardType;
        }   
        if(cardDesc) {
            cardDesc.innerHTML = this.editCardDescriptionText(this.cardDescription);
        } 
        if(this.id === JUMP_NEW_CARD_OPTION && !cardDesc) {
            const elementId = '#' + componentId + ' [name="jump-card-description"]';  
            waitForElementToLoad(elementId).then((elementDesc:any) => {
                cardDesc = elementDesc;
                cardDesc.innerHTML = this.editCardDescriptionText(this.cardDescription);
            });
        }
        if(this.id === JUMP_NEW_BANK_OPTION && !cardDesc) {
            const elementId = '#' + componentId + ' [name="jump-card-description"]';  
            waitForElementToLoad(elementId).then((elementDesc:any) => {
                cardDesc = elementDesc;
                cardDesc.innerHTML = this.editCardDescriptionText(this.cardDescription);
            });
        }
        if(cardExpiry) {
            cardExpiry.innerHTML = expiresText;
        } 
    }
    editCardDescriptionText(cardDescription:any):any {
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
        const newCardDesc:any = cardDescription;
        if(cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
            return newCardDesc.replace(/\*/g, function(match:any, offset:any):any {
                return offset === newCardDesc.indexOf('*') ? 'ending in' : '';
            });
        }
        return cardDescription;
    }
    editTemplate(expiresText:any, componentId:any, url:any ):any {
        const desc:any = {
            'url':url,
            'expiresText':expiresText,
        };
        this.fillExpiryYear(this.id);
        if(this.cardType === 'bank') {
            const bankDescription = expiresText.split(' ')[1];
            if(bankDescription) {
                expiresText = bankDescription;
                // desc.expiresText = expiresText;
            }
            const editOption = document.querySelector('#' + componentId + ' [id="jump-edit-icon"]');
            if(!editOption) {
                this.global.actionObserverService.fire(this,{detail:{action:JUMP_ERROR_MESSAGE_LOADED}});
            }
            if(editOption) {
                editOption.innerHTML = '';
                editOption.className = 'edit-option-col';
            }
            if(expiresText === LABEL_CHECKING) {
                const accountTypeChecking = document.querySelector('#' + this.id + ' [name="jump-card-expiry"]');
                // remove edit icon container
                document.querySelector('#' + this.id + ' [name="jump-edit-existing"]')?.remove();
                accountTypeChecking?.classList?.add('jump-account-checking');
            }

            if(expiresText === LABEL_SAVINGS) {
                const accountTypeSavings = document.querySelector('#' + this.id + ' [name="jump-card-expiry"]');
                // remove edit icon container
                document.querySelector('#' + this.id + ' [name="jump-edit-existing"]')?.remove();
                accountTypeSavings?.classList?.add('jump-account-savings');
            }
            if(expiresText === LABEL_CORPORATE_CHECKING) {
                const accountTypeSavings = document.querySelector('#' + this.id + ' [name="jump-card-expiry"]');
                // remove edit icon container
                document.querySelector('#' + this.id + ' [name="jump-edit-existing"]')?.remove();
                accountTypeSavings?.classList?.add('jump-account-savings');
            }
            
        }
        if(this.id === JUMP_NEW_BANK_OPTION) {
            desc.url = '';
            desc.expiresText = '';
            document.querySelector('#' + componentId + ' [id="jump-remove-icon"]')?.remove();
            document.querySelector('#' + componentId + ' [id="jump-edit-icon"]')?.remove();
            const plusCircleIconId:any = '#' + componentId + ' [id="jump-plus-circle-icon"]';
            const plusCircleIcon = waitForElementToLoad(plusCircleIconId).then((element:any) => {
                setIcon(element,'plus-circle', this);
            });
            document.querySelector('#' + componentId + ' [name="jump-card-description"]')?.setAttribute('class','jump-card-description');
            const pipeSymbol:any = document.querySelector(`#${this.id} [id="jump-col-3-pipe"]`);
            if(pipeSymbol){
                pipeSymbol?.remove();
            }
        }
        if(this.id === JUMP_NEW_CARD_OPTION) {
            desc.url = '';
            desc.expiresText =  '';
            document.querySelector('#' + componentId + ' [id="jump-remove-icon"]')?.remove();
            document.querySelector('#' + componentId + ' [id="jump-edit-icon"]')?.remove();
            const plusCircleIconId:any = '#' + componentId + ' [id="jump-plus-circle-icon"]';
            const plusCircleIcon = waitForElementToLoad(plusCircleIconId).then((element:any) => {
                setIcon(element,'plus-circle',this);
            });
            document.querySelector('#' + componentId + ' [name="jump-card-description"]')?.setAttribute('class','jump-card-description');
            const pipeSymbol:any = document.querySelector(`#${this.id} [id="jump-col-3-pipe"]`);
            if(pipeSymbol){
                pipeSymbol?.remove();
            }
        }
        return desc;
    }
    cardListRemove():void {
        const cardVm:IViewModel = Object.assign({});
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
        const selectedPaymentUpdate:any = document.querySelector('#' + this.id);
        if(selectedPaymentUpdate?.cardType === 'bank') {
            cardVm.accountInfo = Object.assign({});
            cardVm.accountInfo.bankAccountLast4Digits = selectedPaymentUpdate?.cardNo?.slice(-4);
            cardVm.accountInfo.maskedAccountNumber = selectedPaymentUpdate?.cardNo;
            cardVm.accountInfo.bankAccountType = selectedPaymentUpdate?.cardType;
            cardVm.accountInfo.token = selectedPaymentUpdate?.PaymentToken;
            cardVm.accountInfo.accountTypeChecking = selectedPaymentUpdate?.cardExpiry === LABEL_CHECKING ? SERVICE_CHECKING_VALUE: '';
            cardVm.accountInfo.accountTypeSaving = selectedPaymentUpdate?.cardExpiry === LABEL_SAVINGS ? SERVICE_SAVINGS_VALUE: '';
            cardVm.accountInfo.accountTypeCorporateChecking = selectedPaymentUpdate?.cardExpiry === LABEL_CORPORATE_CHECKING || selectedPaymentUpdate?.cardExpiry === SERVICE_CORPORATE_CHECKING_VALUE  ? SERVICE_CORPORATE_CHECKING_VALUE: '';
        } else {
            cardVm.cardInfo = Object.assign({});
            cardVm.cardInfo.token = selectedPaymentUpdate?.PaymentToken;
            cardVm.cardInfo.maskedCardNumber = selectedPaymentUpdate?.cardNo;
            cardVm.cardInfo.cardLast4Digits = selectedPaymentUpdate?.cardNo?.replaceAll('*','');
            cardVm.cardInfo.cardType = selectedPaymentUpdate?.cardType;
            cardVm.cardInfo.expirationDate = selectedPaymentUpdate?.cardExpiry?.replaceAll('/','');
        }
    
        const userToken = this.isTokenValid(selectedPaymentUpdate?.PaymentToken);
        const removeButton = document.querySelector('#' + this.id + ' [name="jump-modal-trigger-wallet"]');
        removeButton?.setAttribute('data-bs-toggle','modal');
        removeButton?.setAttribute('data-bs-target','#jumpModalDialog');
        let cardListRemove;
        if(!document.querySelector(`#${this.id} [id="jump-remove-existing"]`)) {
            cardListRemove = '';
        } else {
            cardListRemove = document.querySelector(`#${this.id} [id="jump-remove-existing"]`);
            cardListRemove?.addEventListener('click',(e:any)=>{
                if(cardVm?.cardInfo || cardVm?.accountInfo) {
                    if(userToken.isValid) {
                        this.launchModalPopup(userToken, '', cardVm);
                    } else {
                        this.launchModalPopup(userToken,DELETE, cardVm);
                    }
                }
                if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
                    this.dataLayerService.dispatchInfoEvent(CPC_WALLET_MGMT_NO_AUTOPAY_REMOVE_SELECTED, true);
                } else if(cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
                    this.dataLayerService.dispatchInfoEvent(CPC_CARD_EXPIRATION_EDIT_REMOVE_SELECTED, true);
                }
            });
        }
    }
    cardListEdit():void {
        let cardListEdit;
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
        if(!document.querySelector(`#${this.id} [id="jump-edit-existing"]`)) {
            cardListEdit = '';
        } else {
            cardListEdit = document.querySelector(`#${this.id} [id="jump-edit-existing"]`) as HTMLButtonElement;
            cardListEdit?.addEventListener('click',(e:any)=>{
                e.preventDefault();
                const editDate = document.querySelector('#' + this.id + ' [name="jump-expiration-date"]');
                editDate?.classList.remove('d-none');
                editDate?.classList.add('show');
                const editButton = document.querySelector('#' + this.id + ' [name="jump-edit-existing"]');
                editButton?.classList.add('d-none');
                
                if(cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
                    this.setExpirationMonth();
                    this.setExpirationYear();
                    const removeButtonText:any = document.querySelector(`#${this.id} [id="jump-remove-existing"]`);
                    const pipeSymbol:any = document.querySelector(`#${this.id} [id="jump-col-3-pipe"]`);
                    const cardExpiry :any = document.querySelector(`#${this.id} [name="jump-card-expiry"]`);
                    if(pipeSymbol && editDate?.classList?.contains('show')) {
                        pipeSymbol?.classList?.add('d-none');
                    } 
                    if(removeButtonText && editDate?.classList?.contains('show')) {
                        removeButtonText.innerText = 'Remove Payment Method'; 
                    }
                    if(cardExpiry?.classList?.contains('show')) {
                        cardExpiry?.classList?.add('d-none');
                        cardExpiry?.classList?.remove('show');
                    } 
                    this.dataLayerService.dispatchInfoEvent(CPC_CARD_EXPIRATION_EDIT_EDIT_SELECTED, true);
                } 
                if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
                    this.setExpirationMonth();
                    this.setExpirationYear();
                    this.dataLayerService.dispatchInfoEvent(CPC_WALLET_MGMT_NO_AUTOPAY_EDIT_SELECTED, true);
                }
            });
            if(this.global.appState.get('channelData')?.config?.expandTemplateOnRender === true && cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
                cardListEdit.click();
            }
        }
    }
    async setExpirationMonth():Promise<void> {
        const selectedPaymentUpdate:any = document.querySelector('#' + this.id);
        const expiration = await selectedPaymentUpdate?.cardExpiry?.split('/');
        const expirationMonth = expiration[0];
        const monthExpiry:any = document.querySelector('#' + this.id + ' [name="jump-expiry-mm"]');                                                                           
        const monthExpiryLength:any = +monthExpiry?.options?.length;
        const monthExpiryLengthArray = new Array(monthExpiryLength).fill(null);
        monthExpiryLengthArray.forEach((_, index) => {
            if(monthExpiry?.options[index]?.value === expirationMonth) {
                monthExpiry.selectedIndex = index;
            }
        });
    }
    async setExpirationYear():Promise<void> { 
        const selectedPaymentUpdate:any = document.querySelector('#' + this.id);
        const expiration = await selectedPaymentUpdate?.cardExpiry?.split('/');
        const expirationYear = expiration[1];
        const yearExpiry:any = document.querySelector('#' + this.id + ' [name="jump-expiry-yy"]');
        const yearExpiryLength:any = +yearExpiry?.options?.length;
        const yearExpiryLengthArray = new Array(yearExpiryLength).fill(null);

        yearExpiryLengthArray?.forEach((_, index):void => {
            const expectedYear = yearExpiry?.options[index]?.value?.slice(2,4);
            if(expectedYear === expirationYear) {
                yearExpiry.selectedIndex = index;
            }
        });
    }
    isTokenValid(cardListToken:string):any {
        const result = Object.assign({});
        result.isValid = false;
        const paymentTokenPreventRemoveList = this.global.appState.get('channelData')?.channelDetails?.paymentTokenPreventRemoveList;
        if(paymentTokenPreventRemoveList) {
            Object?.keys(paymentTokenPreventRemoveList)?.forEach((i:any) => {
                if(paymentTokenPreventRemoveList[i]?.paymentToken === cardListToken) {
                    result.isValid = true;
                    result.cardInfo = paymentTokenPreventRemoveList[i];
                    return result;
                }
            });
        }
        return result;
    }
    async launchModalPopup(userToken:any, type:any, cardVm:any): Promise<void>{
        const modalPopupTitle: any = document.getElementById('jumpModalTitle');
        const modalPopupBody: any = document.getElementById('jumpModalBody'); 
        const modalPopupFooter = document.getElementById('jumpModalFooter');
        const walletMgmtType = userToken?.cardInfo?.type;
        const channelDisplayRemovePaymentBody = userToken?.cardInfo?.messageToDisplay;
        const config = this.global.appState.get('config');
        const globalContentUrl = config.envConfig.globalUrl + CPC_GLOBAL_CONTENT_MAPPING_URL;
        const globalConent = await this.getGlobalContent(globalContentUrl);
        const globalModalContent = this.getGlobalModalContent(globalConent);
        const modalContent = globalModalContent['wallet-mgmt-no-autopay-template'];
        const walletMgmtRemovePaymentTitle = modalContent['remove-payment-instrument-modal-title'];
        const walletMgmtUnableRemovePaymentTitle = modalContent['unable-remove-payment-instrument-modal-title'];
        const walletMgmtRemovePaymentBody = modalContent['remove-payment-instrument-modal-body'];
        const messageToDisplayModalBody = this.modalBodyContainer(channelDisplayRemovePaymentBody ? channelDisplayRemovePaymentBody : walletMgmtRemovePaymentBody);
        if(modalPopupTitle){
            if(type === DELETE) {
                modalPopupTitle.innerHTML = this.modalTitleContainer(walletMgmtRemovePaymentTitle).innerHTML;
            } else {
                modalPopupTitle.innerHTML = this.modalTitleContainer(walletMgmtUnableRemovePaymentTitle).innerHTML;
            } 
        }
        if(modalPopupBody){
            const cpcMessage = Object.assign({});
            cpcMessage.level= 'info';
            cpcMessage.message= 'Unable to Remove Payment Method';
            cpcMessage.data= cardVm;
            cpcMessage.action= EVN_CPC_MANAGE_PAYMENT_MODAL; 
            
            if(type === DELETE) {
                const style = { marginLeft: '35px', marginRight:'-10px'};
                this.updateModalBody(modalPopupBody, modalPopupFooter, messageToDisplayModalBody, this.modalFooterContainer(WALLET_MGMT_CANCEL_TEXT, WALLET_MGMT_REMOVE_TEXT, style, 'remove-btn'), cpcMessage, DELETE, 'remove-btn', cardVm );
            }
            if(walletMgmtType === 'autopay') {
                const style = { marginLeft: '15px'};
                this.updateModalBody(modalPopupBody, modalPopupFooter, messageToDisplayModalBody, this.modalFooterContainer(WALLET_MGMT_CANCEL_TEXT,WALLET_MGMT_MANAGE_AUTO_PAY_TEXT, style, 'autopay-btn'), cpcMessage, 'autopay', 'autopay-btn', '');
            } 
            if(walletMgmtType === 'scheduled') {
                const style = { marginLeft: '0px', marginRight:'20px'};
                this.updateModalBody(modalPopupBody, modalPopupFooter, messageToDisplayModalBody,this.modalFooterContainer(WALLET_MGMT_CANCEL_TEXT, WALLET_MGMT_VIEW_SCHEDULED_PAYMENTS_TEXT , style, 'scheduled-btn'), cpcMessage, 'scheduled', 'scheduled-btn', '');
            }
        } 
    }
    modalTitleContainer(title:string): HTMLSpanElement {
        const innerSpan = document.createElement('span');
        innerSpan.innerHTML = title;
        return innerSpan;
    }
    modalBodyContainer(title:string): HTMLDivElement {
        const parent = document.createElement('div');
        const child = document.createElement('p');
        child.className = 'jump-modal-body-text';
        child.innerText = title;
        parent.appendChild(child);
        return parent;
    }
    modalFooterContainer(cancelButtonText:string, manageButtonText:string, style:any, btnClass:string): HTMLDivElement {
        // Create the parent row div element with class and style attributes
        const parentElement = document.createElement('div');
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        rowDiv.style.marginRight = '-30px';

        // Create the first child col-3 div element
        const col3Div = document.createElement('div');
        col3Div.classList.add('col-3');

        // Create the cancel button element with class, style, and data attributes
        const cancelButton = document.createElement('button');
        cancelButton.classList.add('btn', 'wallet-btn');
        cancelButton.style.color = 'blue';
        cancelButton.style.background = 'white';
        cancelButton.setAttribute('data-bs-dismiss', 'modal');
        cancelButton.innerText = cancelButtonText;

        // Append the cancel button element to the col-3 div element
        col3Div.appendChild(cancelButton);

        // Create the second child col-9 div element
        const col9Div = document.createElement('div');
        col9Div.classList.add('col-9');
        
        // Create the manage auto pay button element with class and style attributes
        const manageAutoPayButton = document.createElement('button');
        manageAutoPayButton.classList.add('btn', 'btn-primary', 'wallet-btn', btnClass);
        manageAutoPayButton.style.marginLeft = style?.marginLeft;
        manageAutoPayButton.style.marginRight = style?.marginRight;
        manageAutoPayButton.innerText = manageButtonText;

        // Append the manage auto pay button element to the col-9 div element
        col9Div.appendChild(manageAutoPayButton);

        // Append the col-3 and col-9 div elements to the parent row div element
        rowDiv.appendChild(col3Div);
        rowDiv.appendChild(col9Div);
        // Append parent row div element to the parentElement
        parentElement.appendChild(rowDiv);
    
        // Return parentElement
        return parentElement;
    }
    getGlobalModalContent(modalContent:any):any {
        const channelName =this.global.appState.get('channelData')?.channelDetails?.channelName;
        if(modalContent && modalContent.cpc_content_mapping[1]?.channel) {
            modalContent.cpc_content_mapping[1]?.channel?.forEach((businessChannel:string):any => {
                if(channelName === businessChannel) {
                    return modalContent.cpc_content_mapping[1];    
                }
            });
            return modalContent.cpc_content_mapping[0];
        }
        return null;
    }
    async getGlobalContent(url:string): Promise<any> {
        const response = await this.fetchData.getErrorMessageJson(url);
        return response;
    }
    updateModalBody(modalPopupBody:any,modalPopupFooter:any, bodyRemoveContent:any, footerRemoveContent:any, cpcMessage:any, cpcMessageType:string, buttonType:string, cardVm:any):void {
        modalPopupBody.innerHTML = bodyRemoveContent.innerHTML;
        if(modalPopupFooter?.firstChild) {
            modalPopupFooter?.removeChild(modalPopupFooter?.firstChild);
        }
        if(modalPopupFooter) {
            modalPopupFooter.innerHTML = footerRemoveContent.innerHTML;
        }
        const modalPaymentButton = document.getElementsByClassName('modal')[0].getElementsByClassName(buttonType)[0];
        modalPaymentButton?.addEventListener('click', () => {
            cpcMessage.type= cpcMessageType;
            if(cpcMessageType === DELETE) {
                cpcMessage.message= 'Removed Payment Method';
                this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'wallet-remove-cardtype',data:cardVm }});
            }
            parent.postMessage(JSON.stringify({...cpcMessage}), CURRENT_CHANNEL_DOMAIN.URI);
        });
    }
    checkExpire(expireDate:string):boolean {   
        const expirationArr = expireDate.split('/');
        const dateOne = new Date(); //Year, Month, Date   
        const getYear =  dateOne.getFullYear(); // get current year
        const currentCentury = getYear.toString().substring(0, 2); 
        const dateTwo = new Date(parseInt(currentCentury+expirationArr[1]), parseInt(expirationArr[0]), 1); //Year, Month, Date    
        if (dateOne > dateTwo) {    
            return true;   
        }else {    
            return false;   
        }    
    }
    handleClick(e:any){
        console.log(`Type: ${this.cardType}, Description: ${this.cardDescription}, Expiry: ${this.cardExpiry}`);
        const paymentMethodID = e.target?.parentElement?.parentElement?.parentElement?.parentElement?.id;
        const paymentMethodType = this.cardType.toLowerCase();
        this.validations.disPatchInfoEvent(paymentMethodType, paymentMethodID, this.dataLayerService);
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
        if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase() || cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
            const updateExpirationButton = document.querySelector('#' + this.id + ' [id="jump-update-expiration"]');
            updateExpirationButton?.setAttribute('disabled', 'true');
            this.handleExpirationClick();
        }
        this.removeErrorNode();
        if(this.id === JUMP_NEW_BANK_OPTION) {
            const paymentSelectErrorMessage = document.getElementById('jump-error-web-component-card-bank-or-existing');
            if(paymentSelectErrorMessage) {
                paymentSelectErrorMessage?.remove();
            }
            this.resetAch();
            this.resetCC();
            this.displayAddress(true,'jump-bank-container', '');
            this.global.appState.get('channelData').selectedPaymentType = 'achonly';
        } else {
            this.resetCC();
            this.displayAddress(false,'jump-bank-container', ACH);
        }
        if(this.id === JUMP_NEW_CARD_OPTION){
            const paymentSelectErrorMessage = document.getElementById('jump-error-web-component-card-bank-or-existing');
            if(paymentSelectErrorMessage) {
                paymentSelectErrorMessage?.remove();
            }
            this.resetAch();
            this.resetCC();
            this.displayAddress(true,'jump-card-container', '');
            this.global.appState.get('channelData').selectedPaymentType = 'cardonly';
        }  else {
            this.resetAch();
            this.displayAddress(false,'jump-card-container', CC);
        }

        if(this.id === JUMP_NEW_PAYMENT_OPTION) {
            const paymentMethodID = e.target?.parentElement?.parentElement?.parentElement?.parentElement?.id;
            document.querySelector(`#${paymentMethodID} [name="jump-payment-option-hr"]`)?.remove();
            this.displayAddress(true,'jump-new-container', '');
        } else {
            this.displayAddress(false,'jump-new-container', '');
        }
    }
    handleExpirationClick():void {
        const cancelExpiration = document.querySelector('#' + this.id + ' [id="jump-cancel-expiration"]');
        cancelExpiration?.addEventListener('click', (e) => {
            e.preventDefault();
            this.dataLayerService.dispatchInfoEvent(CPC_CARD_EXPIRATION_EDIT_CANCEL_SELECTED, true);
            const hideExpiration = document.querySelector('#' + this.id + ' [name="jump-expiration-date"]');
            hideExpiration?.classList.remove('show');
            hideExpiration?.classList.add('d-none');
            const editButton= document.querySelector('#' + this.id + ' [name="jump-edit-existing"]');
            editButton?.classList.remove('d-none');
            editButton?.classList.add('show');
            const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
            if(cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
                const removeButtonText:any = document.querySelector(`#${this.id} [id="jump-remove-existing"]`);
                const pipeSymbol:any = document.querySelector(`#${this.id} [id="jump-col-3-pipe"]`);
                const editIcon:any = document.querySelector(`#${this.id} [id="jump-edit-icon"]`);
                const cardExpiry :any = document.querySelector(`#${this.id} [name="jump-card-expiry"]`);

                if(removeButtonText && editButton?.classList?.contains('show')) {
                    removeButtonText.innerText = 'Remove';
                }
                if(pipeSymbol && editIcon?.classList?.contains('show')) {
                    pipeSymbol?.classList?.remove('d-none');
                    pipeSymbol?.classList?.add('show');
                }
                if(cardExpiry?.classList?.contains('d-none')){
                    cardExpiry?.classList?.add('show');
                    cardExpiry?.classList?.remove('d-none');
                } 
            }
        });
        const updateExpiration = document.querySelector('#' + this.id + ' [id="jump-update-expiration"]');
        const expirationMonth:any = document.querySelector('#' + this.id + ' [name="jump-expiry-mm"]');
        const expirationYear:any = document.querySelector('#' + this.id + ' [name="jump-expiry-yy"]');
        // console.log(expirationMonth?.value)
        let expiryMonth= '';
        let expiryYear = '';
       
        updateExpiration?.addEventListener('click', () => {
            const cardVm:IViewModel = Object.assign({});
            const selectedPaymentUpdate:any = document.querySelector('#' + this.id);
            
            cardVm.cardInfo = Object.assign({});
            cardVm.cardInfo.token = selectedPaymentUpdate?.PaymentToken;
            cardVm.cardInfo.maskedCardNumber = selectedPaymentUpdate?.cardNo;
            cardVm.cardInfo.cardLast4Digits = selectedPaymentUpdate?.cardNo.replaceAll('*','');
            cardVm.cardInfo.cardType = selectedPaymentUpdate?.cardType;
            cardVm.cardInfo.expirationDate = expiryMonth+expiryYear?.slice(2,4);
            cardVm.cardInfo.id = this.id;
            cardVm.personalInfo = Object.assign({});
            if(expiryMonth && expiryYear) {
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_EXPIRATION_EDIT_UPDATE_SELECTED, true);
                this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'wallet-edit-cc',data:cardVm }});  
            }
        });
        expirationMonth?.addEventListener('input', (e:any) => {
            if(e?.target?.value) {
                expiryMonth = e?.target?.value;
                expiryYear = expirationYear.value;
                if(expiryMonth && expiryYear) {
                    const updateExpiration = document.querySelector('#' + this.id + ' [id="jump-update-expiration"]');
                    updateExpiration?.removeAttribute('disabled');
                }
            }
        });
        expirationYear?.addEventListener('input', (e:any) => {
            if(e?.target?.value) {
                expiryYear = e?.target?.value;
                expiryMonth = expirationMonth.value;
                if(expiryMonth && expiryYear) {
                    const updateExpiration = document.querySelector('#' + this.id + ' [id="jump-update-expiration"]');
                    updateExpiration?.removeAttribute('disabled');
                }
            }
        });

    }
    fillExpiryYear(componentId:any): void {
        const currentYear = new Date().getFullYear();
        let options = '<option value="" disabled selected>Year</option>';
        for (let i = 0; i < 10; i++) {
            options =
          options +
          `<option value="${currentYear + i}">${currentYear + i}</option>`;
        }
        const setYear = document.querySelector('#' + this.id + ' [name="jump-expiry-yy"]');
        if(setYear){
            setYear.innerHTML = options;
        }
    }
    displayAddress(display:boolean,pageType:string, type:string){
        const cardComponent:any = document.querySelector('[name="'+pageType+'"]');
        const newCardHr = document.querySelector('[id="jump-new-card-hr"]');
        const newCardWalletHr = document.querySelector('#' + 'jump-new-card-option' + ' [id="jump-new-cardlist-hr"]');
        const newBankWalletHr = document.querySelector('#' + 'jump-new-bank-option' + ' [id="jump-new-cardlist-hr"]');
        if(!cardComponent) return;
        if(display) {
            newCardWalletHr?.classList?.add('d-none');
            newBankWalletHr?.classList?.remove('d-none');
            cardComponent.classList.remove('d-none');
            cardComponent.classList.add('show');
            newCardHr?.classList.remove('d-none');
            newCardHr?.classList.add('show');
        } else {
            newCardWalletHr?.classList?.remove('d-none');
            newBankWalletHr?.classList?.add('d-none');
            cardComponent.classList.add('d-none');
            cardComponent.classList.remove('show');
            newCardHr?.classList.remove('show');
            newCardHr?.classList.add('d-none');
        }
    }
    resetAch():void {
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_ACH_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_ACCOUNT_TYPE_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_ACH_ADDRESS_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_AUTO_PAY_COMPONENT_RESET}}); 
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_TC_COMPONENT_RESET}});
    }
    resetCC():void {
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_CC_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_CC_ADDRESS_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_AUTO_PAY_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_TC_COMPONENT_RESET}});
    }
    private removeErrorNode(){
        const errorElement = document.getElementById('jump-error-template');
        if(errorElement){
            errorElement.remove();
        }
    }           
} 
customElements.define('jump-card-list-web-component', CardListWebComponent);