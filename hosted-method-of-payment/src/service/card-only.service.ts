import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';
import { CardOnlyViewModelService } from './viewModel/card-only-vm-service';
import {IViewModel} from './../model/viewModel/view-model';
import { ErrorType, IConfig, PaymentType } from '../model/view.model';
import { ADDRESS_COMPONENT, CARD_COMPONENT, CC, CPC_CREDIT_CARD_API_SUBMIT , JUMP_UPDATE_VIEW_MODEL, JUMP_UPDATE_VIEW_MODEL_USERROLE_CC, USERROLE_LIST_COMPONENT_CC } from '../constant/app.constant';
import { CommonService } from './common.service';
import { DataLayerService } from './data-layer.service';
import { ErrorHandling } from '../utils/error-handling';
import { CardOnlyEditService } from './card-only-edit.service';
import { CareService } from './care.service';
export class CardOnlyService extends BaseAccountTypeService {
    public cardOnlyVmService:CardOnlyViewModelService = Object.assign({});  
    public commonService = Object.assign({});  
    public dataLayerService = new DataLayerService();
    public viewModel:IViewModel = Object.assign({});
    public cardOnlyEditService:CardOnlyEditService = Object.assign({});
    public careService:CareService = Object.assign({});
    private currentPaymentType = '';
    constructor(config:IConfig, channel:ChannelService,type:string,cardOnlyEditService:CardOnlyEditService, careService:CareService,cardOnlyVmService:CardOnlyViewModelService,errorMessageResponse:any,commonService:CommonService,errorHandling:ErrorHandling){
        super(config,channel,type,errorMessageResponse,errorHandling);
        this.cardOnlyVmService = cardOnlyVmService;       
        this.commonService = commonService;
        this.cardOnlyEditService = cardOnlyEditService;
        this.careService = careService;
        this.global.updateVmMap.set(CARD_COMPONENT,false);
        this.global.updateVmMap.set(ADDRESS_COMPONENT,false);
        this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_CC,false);
        this.subscribe();
    }
    subscribeChild(detail:any){
        switch(detail?.action){
        case JUMP_UPDATE_VIEW_MODEL:
            if(detail?.type === 'cc'){
                console.log('type is cc');
                this.viewModel.cpcPageType = 'CardOnly';
                this.viewModel.cardInfo = detail.data.cardInfo;
                this.viewModel.personalInfo = detail.data.personalInfo;
                this.viewModel.formSubmitChannelData = detail.data.formSubmitChannelData;
                this.viewModel.walletId = detail.data.formSubmitChannelData.customerDetails.walletId;
                this.global.updateVmMap.set(CARD_COMPONENT,true);
                this.resolve(this.viewModel);        
            } 
            else if(detail?.type === 'address-cc'){
                console.log('type is address cc');
                const addressInfo = detail.data?.personalInfo?.addressInfo;
                if(addressInfo){
                    this.viewModel.personalInfo.addressInfo = addressInfo;
                    this.updateChannelDataInputAddress();
                    this.global.updateVmMap.set(ADDRESS_COMPONENT,true);
                    this.resolve(this.viewModel);                        
                }                
            } else if(detail?.type === JUMP_UPDATE_VIEW_MODEL_USERROLE_CC){
                console.log('userrole-cc vm ', this.viewModel.walletId);
                if(detail?.data?.walletId){
                    this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_CC,true);
                    this.viewModel.walletId = detail?.data?.walletId;
                    this.viewModel.formSubmitChannelData = detail.data.formSubmitChannelData;
                    this.resolve(this.viewModel);   
                }
            }
            break;            
        }
        // });
    }
    private resolve(data:IViewModel){
        //makeing sure that card and address components triggerred their separate handlers and updated the CardOnlyService's viewModel 
        if((this.global.updateVmMap.get(CARD_COMPONENT) 
        && this.global.updateVmMap.get(ADDRESS_COMPONENT)) || (this.global.updateVmMap.get(CARD_COMPONENT) 
        && this.global.updateVmMap.get(ADDRESS_COMPONENT) 
        && this.global.updateVmMap.get(USERROLE_LIST_COMPONENT_CC))
        ){            
            this.addOrUpdateCall(data);
            this.global.updateVmMap.set(CARD_COMPONENT,false);
            this.global.updateVmMap.set(ADDRESS_COMPONENT,false);
            this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_CC,false);
        }
    }
    addOrUpdateCall(viewModel:IViewModel): void {
        const cpcPageType = this.currentPaymentType = this.config.cpcPageType.toString().toLowerCase();
        if( this.careService.isIguardUtilized && this.channel.channelData.config?.iguard?.enableIguardIntegration){
            if(this.careService.paymentToken){
                if(this.careService.isFormDataUpdated(viewModel)){
                    this.careService.updateExistingPaymentInstrument(cpcPageType, viewModel, CC);
                }else{
                    this.careService.sendDummyResponse(cpcPageType, CC);
                    console.log('data not modified, no api call');
                }
            }
        } else {
            if(this.channel.channelData.customerDetails.paymentToken && this.currentPaymentType !== PaymentType[PaymentType.CardOrExisting].toLowerCase() || this.currentPaymentType !== PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() || this.currentPaymentType !== PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
                const existingFormData = this.cardOnlyEditService.existingFormData;
                if(existingFormData?.get('cpcStatus') === 'success'){
                    if(this.cardOnlyEditService.isFormFieldsModified() || this.cardOnlyEditService.isAddressModified(viewModel)){
                        if(existingFormData.get('isCcChanged') === 'true' ||
                        existingFormData.get('isCvvChanged') === 'true'){
                            //on cc change make an addToWallet service call
                            this.submit(viewModel);
                            console.log('only cc, cvv make an addToWallet api call');
                        } else if(existingFormData.get('isFirstNameChanged') === 'true'
                        || existingFormData.get('isLastNameChanged') === 'true'  
                        || existingFormData.get('isExpirationChanged') === 'true'
                        || this.cardOnlyEditService.isAddressModified(viewModel)
                        || existingFormData.get('isEnrollInAutoPayChanged') === 'true'
                        || existingFormData.get('isStoredPaymentChanged') === 'true'
                        ) {
                            console.log('One or more Field Changed other than cc, cvv');
                            this.cardOnlyEditService.updateExistingPaymentInstrument(cpcPageType);
                        } else {
                            this.submit(viewModel);
                        }
                    } else {     
                        //no change, no api call, send dummy response back to the channel app
                        this.cardOnlyEditService.sendDummyResponse(cpcPageType);
                        console.log('data not modified, no api call');
                    }
                }else {
                    this.submit(viewModel);
                }
            }else {
                this.submit(viewModel);
            }
        }
    }
    private updateChannelDataInputAddress(){
        const addressInfo = this.viewModel.personalInfo.addressInfo;
        this.channel.channelData.customerDetails.address = addressInfo.address;
        if(addressInfo.addressLine2 && addressInfo.addressLine2 !== 'undefined') {
            this.channel.channelData.customerDetails.addressLine2 = addressInfo.addressLine2;
        } else {
            this.channel.channelData.customerDetails.addressLine2 = '';
        }        
        this.channel.channelData.customerDetails.city = addressInfo.city;
        this.channel.channelData.customerDetails.state = addressInfo.state;
        this.channel.channelData.customerDetails.zip = addressInfo.zipCode;
    }
    load(){
        console.log('load card-only');
    }
    
    async submit(viewModel:IViewModel){
        this.viewModel = viewModel;
        console.log('card only service posted data: ', viewModel);
        const cardType = PaymentType[PaymentType.CardOnly];
        const pciEncryptedData = await this.commonService.getEncryptedCCInfo(cardType.toLowerCase(),this.viewModel);
        const request = this.prepareRequest(pciEncryptedData,this.viewModel.personalInfo);
        this.viewModel.cardInfo.encryptedCardNumber = pciEncryptedData?.paytmentDetail?.cardNumber;
        if(request && request.channelData) {
            if(this.viewModel?.walletId) {
                request.channelData.customerDetails.walletId = this.viewModel?.walletId;
            }
            this.addToWallet(request, cardType);
        }
        //console.log('CardOnly bind called ', viewModel);
        //console.log('errorMessageResponse: ', this.errorMessageResponse);
    }    
    updateWallet(){
        console.log('CardOnly updateToWallet called');
    }
    completed(){
        console.log('CardOnly completed called');
    }
    
    getPostRequestChild():any{
        return this.getPostRequest(this.viewModel,'card');
    }
    getPaymentType(): string{
        return PaymentType[PaymentType.CardOnly].toString();
    }
    dispatchDatalayerEvent(submissionDetails:any){
        this.dataLayerService.dispatchInfoEvent(CPC_CREDIT_CARD_API_SUBMIT, submissionDetails);
    }
    
    getErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        switch(key){
        case ErrorType.service:            
            errorMessage = this.global.getErrorMessage(ErrorType.service, subKey);
            break;
        case ErrorType.security_code:
            if(subKey === ErrorType.american_express || subKey === ErrorType.discover || subKey === ErrorType.mastercard|| subKey === ErrorType.visa){
                errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code,ErrorType.not_enough_digits,subKey);
            }else if(subKey === ErrorType.alpha_characters){
                errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code,subKey);
            }else {
                errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code,ErrorType.invalid);
            }            
            break;
        case ErrorType.stored_payment:  
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.stored_payment,ErrorType.invalid);
            break;         
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,key,subKey);
            break;
        }
        return errorMessage;
    } 
}
