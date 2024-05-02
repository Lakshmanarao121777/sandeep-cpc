import {
    ACCOUNT_TYPE_COMPONENT,
    ACH,
    ACH_COMPONENT,
    ADDRESS_COMPONENT,
    CPC_BANK_API_SUBMIT,
    JUMP_UPDATE_VIEW_MODEL,
    JUMP_UPDATE_VIEW_MODEL_USERROLE_ACH,
    USERROLE_LIST_COMPONENT_ACH,
} from '../constant/app.constant';
import {
    ErrorType,
    IConfig,    
    IViewModelEncrypted,
    PaymentType
} from '../model/view.model';
import { ErrorHandling } from '../utils/error-handling';
import { CommonService } from './common.service';
import { DataLayerService } from './data-layer.service';
import { AchOnlyViewModelService } from './viewModel/ach-only-vm-service';
import { ChannelService } from './channel-service';
import { BaseAccountTypeService } from './base-account-type-service';
import {IViewModel} from './../model/viewModel/view-model';
import { AchOnlyEditService } from './ach-only-edit.service';
import { CareService } from './care.service';
export class AchOnlyService extends BaseAccountTypeService{
    public achOnlyVmService:AchOnlyViewModelService = Object.assign({});  
    public commonService = Object.assign({});  
    public dataLayerService = new DataLayerService();
    public viewModel:IViewModel = Object.assign({});
    public achOnlyEditService:AchOnlyEditService = Object.assign({});
    public errorHandling:any=new ErrorHandling();
    private currentPaymentType = '';
    public careService:CareService;

    constructor(config:IConfig, channel:ChannelService,type:string,achOnlyEditService:AchOnlyEditService,achOnlyVmService:AchOnlyViewModelService,errorMessageResponse:any,commonService:CommonService,errorHandling:ErrorHandling, careService:CareService) {
        super(config,channel,type,errorMessageResponse,errorHandling);

        console.log('ACH constructor');
        this.achOnlyVmService = achOnlyVmService;
        this.commonService = commonService;
        this.achOnlyEditService = achOnlyEditService;
        this.careService = careService;
        this.global.updateVmMap.set(ACH_COMPONENT,false);
        this.global.updateVmMap.set(ADDRESS_COMPONENT,false);
        this.global.updateVmMap.set(ACCOUNT_TYPE_COMPONENT,false);
        this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_ACH,false);
        this.subscribe();
    }
    subscribeChild(detail:any){
        //this.global.actionObserverService.subscribe((sender:any,externalData:any)=>{
        //   const detail = externalData.detail;
        switch(detail?.action){
        case JUMP_UPDATE_VIEW_MODEL:
            console.log('ach update view model ',detail.data);
            if(detail?.type === 'ach'){
                console.log('type is ach');                    
                this.viewModel.cpcPageType = 'AchOnly';
                this.viewModel.accountInfo = detail.data.accountInfo;
                this.viewModel.personalInfo = detail.data.personalInfo;
                this.viewModel.walletId = detail.data.formSubmitChannelData.customerDetails.walletId;
                this.viewModel.formSubmitChannelData = detail.data.formSubmitChannelData;
                if(detail.data.walletId) {
                    this.viewModel.walletId = detail.data.walletId;
                }
                this.global.updateVmMap.set(ACH_COMPONENT,true);
                this.resolve(this.viewModel);        
            }else if(detail?.type === 'address-ach'){
                console.log('type is address ach');
                const addressInfo = detail.data?.personalInfo?.addressInfo;
                if(addressInfo){
                    this.viewModel.personalInfo.addressInfo = addressInfo;
                    this.updateChannelDataInputAddress();
                    this.global.updateVmMap.set(ADDRESS_COMPONENT,true);
                    this.resolve(this.viewModel);
                }                
            } else if(detail?.type === 'account-type'){
                console.log('acc type vm ', this.viewModel.accountInfo);
                if(this.viewModel.accountInfo){
                    this.global.updateVmMap.set(ACCOUNT_TYPE_COMPONENT,true);
                    this.viewModel.accountInfo.accountTypeChecking = detail?.data?.accountInfo?.accountTypeChecking;
                    this.viewModel.accountInfo.accountTypeSaving = detail?.data?.accountInfo?.accountTypeSaving;
                    this.viewModel.accountInfo.accountTypeCorporateChecking = detail?.data?.accountInfo?.accountTypeCorporateChecking;
                }
            } else if(detail?.type === JUMP_UPDATE_VIEW_MODEL_USERROLE_ACH){
                console.log('userrole-ach vm ', this.viewModel);
                if(detail?.data?.walletId){
                    this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_ACH,true);
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
        if( (this.global.updateVmMap.get(ACH_COMPONENT) 
        && this.global.updateVmMap.get(ADDRESS_COMPONENT)
        && this.global.updateVmMap.get(ACCOUNT_TYPE_COMPONENT)) || (this.global.updateVmMap.get(ACH_COMPONENT) 
            && this.global.updateVmMap.get(ADDRESS_COMPONENT)
            && this.global.updateVmMap.get(ACCOUNT_TYPE_COMPONENT)
            && this.global.updateVmMap.get(USERROLE_LIST_COMPONENT_ACH))){
            console.log('resolved....', data);
            this.addOrUpdateCall(data);

            this.global.updateVmMap.set(ACH_COMPONENT,false); 
            this.global.updateVmMap.set(ADDRESS_COMPONENT,false);
            this.global.updateVmMap.set(ACCOUNT_TYPE_COMPONENT,false);   
            this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_ACH,false);         
        }
    }
    addOrUpdateCall(viewModel:IViewModel): void {
        const cpcPageType = this.currentPaymentType = this.config.cpcPageType.toString().toLowerCase();
        if( this.careService.isIguardUtilized && this.channel.channelData.config?.iguard?.enableIguardIntegration){
            if(this.careService.paymentToken){
                if(this.careService.isFormDataUpdated(viewModel)){
                    this.careService.updateExistingPaymentInstrument(cpcPageType, viewModel, ACH);
                }else{
                    this.careService.sendDummyResponse(cpcPageType, ACH);
                    console.log('data not modified, no api call');
                }
            }
        } else {
            if(this.channel.channelData.customerDetails.paymentToken && this.currentPaymentType !== PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() && this.currentPaymentType !== PaymentType[PaymentType.CardExpirationEdit].toLowerCase()){
                const existingFormData = this.achOnlyEditService.existingFormData;
                if(existingFormData?.get('cpcStatus') === 'success'){
                    if(this.achOnlyEditService.isFormFieldsModified() || this.achOnlyEditService.isAddressModified(viewModel)){
                        if(existingFormData.get('isAcctNoChanged') === 'true' || existingFormData.get('isRoutNoChanged') === 'true'){
                            //on accountNo/routingNo change make an addToWallet service call
                            this.submit(viewModel);
                            console.log('only accountNo modified, make an addToWallet api call');
                        } else if(existingFormData.get('isFirstNameChanged') === 'true' || existingFormData.get('isLastNameChanged') === 'true' || 
                        this.achOnlyEditService.isAddressModified(viewModel) || existingFormData.get('isEnrollInAutoPayChanged') === 'true'){
                            console.log('One or more Field Changed');
                            this.achOnlyEditService.updateExistingPaymentInstrument(cpcPageType);
                        } else {
                            this.submit(viewModel);
                        }
                    } else {                
                        //no change, no api call, send dummy response back to the channel app
                        this.achOnlyEditService.sendDummyResponse(cpcPageType);
                        console.log('data not modified, no api call');
                    }
                }else {
                    this.submit(viewModel);
                }
            }else{
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
        console.log('load ach-only');
    }
    async submit(viewModel:IViewModel){
        this.viewModel = viewModel;
        const cardType = PaymentType[PaymentType.AchOnly];
        const pciEncryptedData = await this.commonService.getEncryptedCCInfo(cardType.toLowerCase(),this.viewModel);
        const request = this.prepareRequest(pciEncryptedData,this.viewModel.personalInfo);
        this.viewModel.accountInfo.encryptedAccountNumber = pciEncryptedData?.paytmentDetail?.accountNo;
        if(request && request.channelData) {
            if(this.viewModel?.walletId) {
                request.channelData.customerDetails.walletId = this.viewModel?.walletId;
            }
            this.addToWallet(request, cardType);
        }

    }    
    updateWallet(){
        console.log('AchOnly updateToWallet called');
    }
    completed(){
        console.log('AchOnly completed called');
    }

    getPostRequestChild():any{
        return this.getPostRequest(this.viewModel,'bank');
    }
    getPaymentType(): string{
        return PaymentType[PaymentType.AchOnly].toString();
    }
    dispatchDatalayerEvent(submissionDetails:any){
        this.dataLayerService.dispatchInfoEvent(CPC_BANK_API_SUBMIT, submissionDetails);
    }
    
    paymentClick(paymentSuccess: boolean, vm:IViewModelEncrypted, cpcPageType:string): void {
        //console.log('...');
    }
    
    getErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        switch(key){
        case ErrorType.service:            
            errorMessage = this.global.getErrorMessage(ErrorType.service, subKey);
            break;
        case ErrorType.stored_payment:  
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.stored_payment,ErrorType.invalid);
            break; 
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,key,subKey);
            break;
        }
        return errorMessage;
    }
}