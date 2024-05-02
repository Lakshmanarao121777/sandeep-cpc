import { encryptRsaOaep } from '../utils/encryption';
import { importRsaKey } from '../utils/crypto-key-import';
import { IConfig, IViewModel, IViewModelEncrypted, PaymentType , AddressDetails, ErrorType } from '../model/view.model';
import { CPC_BANK_SUBMIT, CPC_CARD_SUBMIT, CPC_MIN_CARD_EDIT_SUBMIT, CPC_MIN_CARD_SUBMIT, EVN_CPC_FORM_PROCESSING, JUMP_ERROR_MESSAGE_LOADED, CPC_MIN_BANK_SUBMIT, CURRENT_CHANNEL_DOMAIN, CPC_CARD_OR_EXISTING_SUBMIT, CPC_CARD_BANK_OR_EXISTING_SUBMIT, JUMP_CARD_BLOCKED, JUMP_BANK_BLOCKED, CPC_PAYMENT_FREQUENCY_ONETIME, CPC_WALLET_MGMT_NO_AUTOPAY_SUBMIT, CPC_GLOBAL_ERROR_MAPPING_URL, CPC_GLOBAL_CONTENT_MAPPING_URL } from '../constant/app.constant';
import { DataLayerService } from './data-layer.service';
import { FetchData } from '../api/fetch-data';
import { Globals } from '../utils/globals';
import { ErrorMessageService } from './error-message.service';
import { ActionObserverService } from './action-observer-service';
import {IViewModel as ViewModelBase} from './../model/viewModel/view-model';
import { ChannelService } from './channel-service';
import { CPCContentService } from './cpc-content.service';
import { getAddressDetailsFromChannelData } from '../utils/address';
import { getBlockingErrorMessage, showBlockError } from '../utils/payment-config';

export class CommonService {
    private global:Globals;
    private paymentTypeCardOnly = PaymentType[PaymentType.CardOnly].toLowerCase();
    private paymentTypeCardOnlyWithEdit = PaymentType[PaymentType.CardOnlyWithEdit].toLowerCase();
    private paymentTypeAchOnly = PaymentType[PaymentType.AchOnly].toLowerCase();
    private paymentTypeAchOnlyWithEdit = PaymentType[PaymentType.AchOnlyWithEdit].toLowerCase();
    private paymentTypeCardOrBank = PaymentType[PaymentType.CardOrBank].toLowerCase();
    private paymentTypeBankOrCard = PaymentType[PaymentType.BankOrCard].toLowerCase();
    private paymentTypeMinCardOnly = PaymentType[PaymentType.MinCardOnly].toLowerCase();
    private paymentTypeMinCardOnlyWithEdit = PaymentType[PaymentType.MinCardOnlyWithEdit].toLowerCase();
    private paymentTypeCardOrExisting = PaymentType[PaymentType.CardOrExisting].toLowerCase();
    private paymentTypeCardBankOrExisting = PaymentType[PaymentType.CardBankOrExisting].toLowerCase();
    private paymentTypeBankCardOrExisting = PaymentType[PaymentType.BankCardOrExisting].toLowerCase();
    private paymentTypeWalletMgmtNoAutopay = PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase();
    private paymentTypeCardExpirationEdit = PaymentType[PaymentType.CardExpirationEdit].toLowerCase();
    private paymentTypeMinAchOnly = PaymentType[PaymentType.MinAchOnly].toLowerCase();
    private dataLayerService:DataLayerService = Object.assign({});
    public fetchData:FetchData;
    public publicKey:CryptoKey = Object.assign({});
    private actionObserverService:ActionObserverService;
    public channelService:ChannelService = Object.assign({});
    public config:IConfig = Object.assign({});
    private cardBlock  = false;
    private bankBlock = false;

    constructor(actionObserverService:ActionObserverService,channelService?:ChannelService,config?:IConfig) {
        this.global = Globals.getInstance();
        this.dataLayerService = new DataLayerService();
        this.fetchData = new FetchData();
        this.actionObserverService = actionObserverService;
        this.channelService = channelService? channelService:Object.assign({});
        if(config){
            this.config = config;
        }
        
    }

    getCardBlock(): boolean {
        return this.cardBlock;
    }

    getBankBlock(): boolean {
        return this.bankBlock;
    }

    async getEncryptedCCInfo(cpcPageType:string, viewModel:any): Promise<IViewModelEncrypted> {         
        const pciData:any = Object.assign({});
        //let validCard:boolean;
        //let validAddress:boolean;
        let pciEncryptedData:IViewModelEncrypted = Object.assign({});
        switch(cpcPageType) {
        case this.paymentTypeCardOnly:   
        case this.paymentTypeCardOnlyWithEdit:             
            this.notifyToChannel();
            pciData.ccNo = viewModel.cardInfo.ccNo;
            pciData.expiry = viewModel.cardInfo.expMonth + '/' + viewModel.cardInfo.expYear;
            pciData.cvv = viewModel.cardInfo.cvv;                
            pciEncryptedData = await this.encrypt(pciData , cpcPageType,viewModel);            
            break;
        case this.paymentTypeAchOnly:
        case this.paymentTypeMinAchOnly:
            this.notifyToChannel();
            pciData.accountNo = viewModel.accountInfo.accountNo;
            pciData.routingNo = viewModel.accountInfo.routingNo;                
            pciEncryptedData = await this.encrypt(pciData , cpcPageType,viewModel);            
            break;
        case this.paymentTypeMinCardOnly:
        case this.paymentTypeMinCardOnlyWithEdit:                    
            this.notifyToChannel();
            pciData.ccNo = viewModel.cardInfo.ccNo;
            pciData.expiry = viewModel.cardInfo.expMonth + '/' + viewModel.cardInfo.expYear;
            pciData.cvv = viewModel.cardInfo.cvv;
            pciEncryptedData = await this.encrypt(pciData , cpcPageType,viewModel);            
            break;
        }
        return pciEncryptedData;
    }

    dispatchDataLayerInfo(component:any,cpcPageType:string){
        let cardErrorMap:Map<string, boolean>;
        let accTypeErrorMap:Map<string, boolean>;
        let addressErrorMap:Map<string, boolean>;
        let ccListErrorMap:Map<string, boolean>;
        let finalErrorMap;

        switch(cpcPageType){
        case this.paymentTypeCardOnly:
        case this.paymentTypeCardOnlyWithEdit:
            cardErrorMap = component.cardWebComponent.cardOnlyService.formFieldStatusMap;
            addressErrorMap = component.addressComponentCc.formFieldStatusMap;
            finalErrorMap = new Map([...cardErrorMap,...addressErrorMap]);
            this.dataLayerService.dispatchInfoEvent(CPC_CARD_SUBMIT, finalErrorMap);
            break;
        case this.paymentTypeAchOnly:
        case this.paymentTypeAchOnlyWithEdit:
            cardErrorMap = component.achWebComponent.achOnlyService.formFieldStatusMap;
            accTypeErrorMap = component.accountTypeComponentAch.formFieldStatusMap;
            addressErrorMap = component.addressComponentAch.formFieldStatusMap;
            finalErrorMap = new Map([...cardErrorMap,...accTypeErrorMap,...addressErrorMap]);
            this.dataLayerService.dispatchInfoEvent(CPC_BANK_SUBMIT, finalErrorMap);
            break;            
        case this.paymentTypeMinCardOnly:
            cardErrorMap = component.minCardOnlyWebComponent.minCardOnlyService.formFieldStatusMap;
            finalErrorMap = new Map([...cardErrorMap]);
            this.dataLayerService.dispatchInfoEvent(CPC_MIN_CARD_SUBMIT, finalErrorMap);
            break;            
        case this.paymentTypeMinCardOnlyWithEdit:
            cardErrorMap = component.minCardOnlyWebComponent.minCardOnlyService.minCardEditService.formFieldStatusMap;
            finalErrorMap = new Map([...cardErrorMap]);
            this.dataLayerService.dispatchInfoEvent(CPC_MIN_CARD_EDIT_SUBMIT, finalErrorMap);
            break;
        case this.paymentTypeMinAchOnly:
            cardErrorMap = component.minAchOnlyWebComponent.minAchOnlyService.formFieldStatusMap;
            accTypeErrorMap = component.accountTypeComponentMinAchOnly.formFieldStatusMap;
            finalErrorMap = new Map([...cardErrorMap,...accTypeErrorMap]);
            this.dataLayerService.dispatchInfoEvent(CPC_MIN_BANK_SUBMIT, finalErrorMap);
            break;
        case this.paymentTypeCardOrExisting:
            cardErrorMap = component.cardWebComponent.cardOnlyService.formFieldStatusMap;
            ccListErrorMap = component.ccListComponent.cardListService.formFieldStatusMap;
            finalErrorMap = new Map([...cardErrorMap,...ccListErrorMap]);
            this.dataLayerService.dispatchInfoEvent(CPC_CARD_OR_EXISTING_SUBMIT, finalErrorMap);
            break;                        
        case this.paymentTypeCardBankOrExisting:
        case this.paymentTypeBankCardOrExisting:
            cardErrorMap = component.cardWebComponent.cardOnlyService.formFieldStatusMap;
            ccListErrorMap = component.cardBankExistingComponent.cardBankExistingService.formFieldStatusMap;
            finalErrorMap = new Map([...cardErrorMap,...ccListErrorMap]);
            this.dataLayerService.dispatchInfoEvent(CPC_CARD_BANK_OR_EXISTING_SUBMIT, finalErrorMap);
            break; 
        case this.paymentTypeWalletMgmtNoAutopay:
        case this.paymentTypeCardExpirationEdit:
            cardErrorMap = component.cardWebComponent.cardOnlyService.formFieldStatusMap;
            ccListErrorMap = component.cardBankExistingComponent.walletMgmtNoAutopayService.formFieldStatusMap;
            finalErrorMap = new Map([...cardErrorMap,...ccListErrorMap]);
            this.dataLayerService.dispatchInfoEvent(CPC_WALLET_MGMT_NO_AUTOPAY_SUBMIT, finalErrorMap);
            break;                        
        }
    }
    async encrypt(pciData: any , cpcPageType: string, viewModel:ViewModelBase): Promise<IViewModelEncrypted>{ 
    
        const paymentDetail:any = {};
        let onlyCcNo = '';


        if(cpcPageType === this.paymentTypeCardOnly || cpcPageType === this.paymentTypeCardOnlyWithEdit) {  
            onlyCcNo = pciData.ccNo.split(' ').join().replace(/,/g,'');
            paymentDetail.cardNumber =  await encryptRsaOaep(onlyCcNo, this.publicKey);
            paymentDetail.expirationDate = pciData.expiry;
            paymentDetail.cvv = pciData.cvv;
        } else if(cpcPageType === this.paymentTypeAchOnly || cpcPageType === this.paymentTypeMinAchOnly || cpcPageType === this.paymentTypeAchOnlyWithEdit) {  
            paymentDetail.accountNo  = await encryptRsaOaep(pciData.accountNo, this.publicKey);
            paymentDetail.routingNo = pciData.routingNo;
        }else if(cpcPageType === this.paymentTypeMinCardOnly || cpcPageType === this.paymentTypeMinCardOnlyWithEdit) {  
            onlyCcNo = pciData.ccNo.split(' ').join().replace(/,/g,'');
            paymentDetail.cardNumber = await encryptRsaOaep(onlyCcNo, this.publicKey);
            paymentDetail.expirationDate = pciData.expiry;
            paymentDetail.cvv = pciData.cvv;
        } 

        const vm:IViewModelEncrypted = Object.assign({});
        vm.firstName = viewModel.personalInfo.firstName;
        vm.lastName = viewModel.personalInfo.lastName;

        if(this.channelService.channelData.customerDetails){
            vm.address = this.channelService.channelData.customerDetails.address;
            vm.addressLine2 = this.channelService.channelData.customerDetails.addressLine2;
            vm.city = this.channelService.channelData.customerDetails.city;
            vm.state = this.channelService.channelData.customerDetails.state;
            vm.zipCode = this.channelService.channelData.customerDetails.zip;
        }
        

        vm.cpcPageType = viewModel.cpcPageType;
        vm.channelData = this.channelService.channelData;
        vm.paytmentDetailType = 'Encrypted';
        vm.paytmentDetail = paymentDetail;
        return vm;
    }
    setPaymentTypeError(message:string): void {
        const paymentType = document.getElementsByName('jump-payment-type-error')[0];
        paymentType.innerHTML = message;
    }

    getAddressValues(channelData:any):AddressDetails {
        return getAddressDetailsFromChannelData(channelData);
    }

    public async getPublicKey(): Promise<void> {
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.getPublicKey;
        const channel = this.channelService.channelData?.channelDetails?.channelName;
        const body = JSON.stringify({
            'channel':channel
        });
        const header = this.apiHeader();        
        const response = await this.fetchData.post(url,header,body).catch((e)=>{
            console.log('Something went wrong:( ', e);
        });
        if(response && response.publicKey) {
            this.publicKey = await importRsaKey(response.publicKey);
        }
        return response;

    }

    
    public async getErrorMessage(config:IConfig, channelName:string): Promise<void> {
        const url = config.envConfig.globalUrl+CPC_GLOBAL_ERROR_MAPPING_URL;
        const response  = await this.fetchData.getErrorMessageJson(url);
        Globals.getInstance().errorMessageResponse = response;
        this.parseErrorMessageResponse(channelName);
        this.actionObserverService.fire(this,{detail:{action:JUMP_ERROR_MESSAGE_LOADED, errorMessageLoaded:true}});

    }
    public parseErrorMessageResponse(channelName:string){
        const global = Globals.getInstance();
        const response = global.errorMessageResponse;
        if(response && global.errorMessageMap.size === 0){
            const errorMessageService:ErrorMessageService = new ErrorMessageService(response.cpc_error_response_mapping,response.cpc_response_messages);
            const channel =  errorMessageService.getErrorResponseMapping(channelName);
            const all =  errorMessageService.getErrorResponseMapping('ALL');
            errorMessageService.mergeErrors(channel,all);
            const mergeErrorResponse = all; //assing all after calling merge
            const errorMessageMap = errorMessageService.fillResponseErrorMessageMap();
            
            global.errorMessageList = mergeErrorResponse;
            console.log('global.errorMessageList ', global.errorMessageList);
            global.errorMessageMap = errorMessageMap;
            //setting back to null, releasing memory
            global.errorMessageResponse = null; 
        }        
    }
    public async getGlobalContent(config:IConfig, channelName:string): Promise<void> {
        const url = config.envConfig.globalUrl+CPC_GLOBAL_CONTENT_MAPPING_URL;
        const response  = await this.fetchData.getGlobalContentJson(url);
        Globals.getInstance().globalContentResponse = response;
        this.parseGlobalContentResponse(channelName);
        this.actionObserverService.fire(this,{detail:{action:JUMP_ERROR_MESSAGE_LOADED, errorMessageLoaded:true}});

    }
    public parseGlobalContentResponse(channelName:string){
        const global = Globals.getInstance();
        const response = global.globalContentResponse;
        if(response && global.globalContentMap.size === 0){
            const cpcContentService:CPCContentService = new CPCContentService(response.cpc_content_mapping);
            const channel =  cpcContentService.getcpcContentResponseMapping (channelName);
            const all =  cpcContentService.getcpcContentResponseMapping ('ALL');
            cpcContentService.mergecpcContents(channel,all);
            const mergeCPCContentResponse = all; //assing all after calling merge
            
            global.globalContentList = mergeCPCContentResponse;
            console.log('global.globalContentList ', global.globalContentList);
            //setting back to null, releasing memory
            global.globalContentResponse = null; 
        }        
    }
    apiHeader() {
        const header:any = {
            sourceServerId: this.channelService.channelData.channelDetails.sourceServerId,
            sourceSystemId: this.channelService.channelData.channelDetails.sourceSystemId,
            timestamp: this.channelService.channelData.channelDetails.timestamp,
            trackingId: this.channelService.channelData.channelDetails.trackingId,
            partnerId: this.channelService.channelData.channelDetails.partnerId,
            Channel: this.channelService.channelData.channelDetails.channelName,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
        if(this.channelService?.channelData?.customerDetails?.cimaUserToken){
            header.Authorization = 'Bearer ' + this.channelService.channelData.customerDetails.cimaUserToken;
        }else if(this.channelService?.channelData?.agentDetails?.azureAdToken){
            header.Authorization = 'Bearer ' + this.channelService.channelData.agentDetails.azureAdToken;
        }

        return header;
    }    
    notifyToChannel(){
        const data = Object.assign({});
        data.action = EVN_CPC_FORM_PROCESSING;
        data.message = 'Backend api call in progress';
        data.callInProgress = true;
        parent.postMessage(JSON.stringify(data), CURRENT_CHANNEL_DOMAIN.URI);
    }
    public getPaymentFrequency(viewModel:IViewModel):string{
        if(viewModel.channelData?.config?.paymentFrequency){
            return viewModel.channelData.config.paymentFrequency;
        }
        return CPC_PAYMENT_FREQUENCY_ONETIME;
    }
    public async getPaymentConfiguration(viewModel:IViewModel, config:IConfig): Promise<void> {
        const url = config.envConfig.methodOfPaymentServiceUrl.url + config.envConfig.methodOfPaymentServiceUrl.getPaymentConfiguration;
        const channel = viewModel?.channelData?.channelDetails?.channelName;
        const billingArrangementId = viewModel?.channelData?.customerDetails?.billingArrangementId;

        if (billingArrangementId) {
            const body = JSON.stringify({
                'channel':channel,
                'billingArrangementId':viewModel?.channelData?.customerDetails?.billingArrangementId,
                'paymentFrequency':this.getPaymentFrequency(viewModel)
            });
            const header = this.apiHeader();        
            const response = await this.fetchData.post(url,header,body).catch((e)=>{
                console.log('Something went wrong:( ', e);
            });      
            if(response && response.paymentConfigurationDetails){
                const paymentConfiguration = response.paymentConfigurationDetails;
                const messageDisplayLocation = this.global.appState.get('channelData').channelDetails.cpcMessageDisplayLocation;
                if(paymentConfiguration.cpcStatus.toLowerCase() === 'success'){        
                    this.cardBlock = paymentConfiguration.cardblockStatus;
                    this.bankBlock = paymentConfiguration.bankblockStatus;
                    if(this.cardBlock && this.bankBlock) {
                        this.cardBlock = true;
                        this.bankBlock = true;
                        this.global.appState.set(JUMP_CARD_BLOCKED, true);
                        this.global.appState.set(JUMP_BANK_BLOCKED, true);
                    } else {
                        if(this.bankBlock) {
                            this.bankBlock = true;
                            this.global.appState.set(JUMP_BANK_BLOCKED, true);
                        } 
                        if(this.cardBlock) {
                            this.cardBlock = true;
                            this.global.appState.set(JUMP_CARD_BLOCKED, true);
                        }
                    }           
                }
            }
            return response;
        }
    }

    cyberSourceConfiguration(viewModel:IViewModel, config:IConfig) {
        const org_id  = config.envConfig.orgId;
        const merchantId = viewModel?.channelData?.channelDetails?.merchantId;
        const deviceFingerprintId = viewModel?.channelData?.channelDetails?.deviceFingerprintId;
        const cyberSourceDessionsManagerUrl = config.envConfig.cyberSourceDessionsManagerUrl;
        const src =  `${cyberSourceDessionsManagerUrl}?org_id=${org_id}&session_id=${merchantId}${deviceFingerprintId}`;
        
        const script = document.createElement('script');
        script.setAttribute('src' , src);
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('async', 'false');
        //script.setAttribute('integrity', 'sha384-Mlo/dwEk6KEtjn0zFFQ6nu8aDon5mXEwSMxUM6cYNi26Ip99faTstU02TPw0oQIM');
        //script.setAttribute('crossOrigin', 'anonymous');
        
        const head = document.getElementsByTagName('head');
        if(head) {
            const hc =  head[0].cloneNode(true);
            hc.appendChild(script);
        }

        const iframe = document.createElement('iframe');
        iframe.setAttribute('src',src);
        iframe.setAttribute('height','0');
        iframe.setAttribute('width','0');
        //iframe.setAttribute('integrity', 'sha384-Mlo/dwEk6KEtjn0zFFQ6nu8aDon5mXEwSMxUM6cYNi26Ip99faTstU02TPw0oQIM');
        //iframe.setAttribute('crossOrigin', 'anonymous');

        const modal = document.getElementsByTagName('noscript');
        if(modal) {
            modal[0].appendChild(iframe);
        } 
        console.log(document);
        
    }
    loadIguardScript(viewModel:IViewModel, config:IConfig):void{
        const iguardUrl =  config.envConfig?.iGuardUrl;
        const script = document.createElement('script');
        script.setAttribute('src', iguardUrl);
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('async', 'false');
        //script.setAttribute('integrity', 'sha384-MpCPKoT7W42OkrEVPJTi75iKhq5rNn+egXs7Fq8ICLGBxDvTmymcFthuN2+CD8iy');
        //script.setAttribute('crossOrigin', 'anonymous');

        const head = document.getElementById('jump-web-component-head');
        if (head) {
            head.appendChild(script);
        }
    } 
    
    getCPCErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        switch(key){
        case ErrorType.payment_type:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.payment_type,subKey);
            break;
        case ErrorType.card_block:            
            errorMessage = this.global.getErrorMessage(ErrorType.system,subKey);
            break;
        case ErrorType.bank_block:            
            errorMessage = this.global.getErrorMessage(ErrorType.system,subKey);
            break;
        case ErrorType.card_and_bank_block:            
            errorMessage = this.global.getErrorMessage(ErrorType.system,subKey);
            break;

        }
        return errorMessage;
    } 
}