import { ErrorType, IConfig, IViewModelEncrypted, PaymentType } from '../model/view.model';
import { CPC_MIN_CARD_API_SUBMIT, JUMP_UPDATE_VIEW_MODEL, JUMP_UPDATE_VIEW_MODEL_USERROLE_CC, USERROLE_LIST_COMPONENT_CC} from '../constant/app.constant';
import {IViewModel} from './../model/viewModel/view-model';
import { ErrorHandling } from '../utils/error-handling';
import { CommonService } from './common.service';
import { MinCardEditService } from './min-card-edit.service';
import { DataLayerService } from './data-layer.service';
import { MinCardOnlyViewModelService } from './viewModel/min-card-only-vm-service';
import { ChannelService } from './channel-service';
import { BaseAccountTypeService } from './base-account-type-service';
export class MinCardOnlyService extends BaseAccountTypeService {
    public minCardOnlyVmService:MinCardOnlyViewModelService = Object.assign({});  
    public commonService = new CommonService(Object.assign({})); 
    //private localData:any = Object.assign({}); 
    public viewModel: IViewModel = Object.assign({});
    public dataLayerService = new DataLayerService();
    public minCardEditService:MinCardEditService = Object.assign({});
    public date: any = new Date();
    private currentPaymentType = '';
    
    constructor(config:IConfig, channel:ChannelService,type:string,minCardEditService:MinCardEditService,minCardOnlyVmService:MinCardOnlyViewModelService,errorMessageResponse:any,commonService:CommonService,errorHandling:ErrorHandling) {
        super(config,channel,type,errorMessageResponse,errorHandling);
        console.log('MinCC constructor');
        this.minCardOnlyVmService = minCardOnlyVmService;       
        this.commonService = commonService;
        this.minCardEditService = minCardEditService;
        // this.resolveComponents = new Map<string,boolean>();
        // this.resolveComponents.set(CARD_COMPONENT,false);
        // this.resolveComponents.set(ADDRESS_COMPONENT,false);
        this.subscribe();
    }
    subscribeChild(detail:any){
        //let isCcFormValid = false;        
        //this.global.actionObserverService.subscribe((sender:any,externalData:any)=>{
        //    const detail = externalData.detail;
        switch(detail?.action){
        case JUMP_UPDATE_VIEW_MODEL:
            if(detail?.type === 'min-cc'){
                console.log('type is mincc');                    
                this.viewModel.cpcPageType = 'MinCardOnly';
                this.viewModel.cardInfo = detail.data.cardInfo;
                this.viewModel.personalInfo = detail.data.personalInfo;
                this.viewModel.formSubmitChannelData = detail.data.formSubmitChannelData;
                this.resolve(this.viewModel);
            }else if(detail?.type === 'min-edit-cc'){
                console.log('type is mincc');                    
                this.viewModel.cpcPageType = 'MinCardOnlyWithEdit';
                this.viewModel.cardInfo = detail.data.cardInfo;
                this.viewModel.personalInfo = detail.data.personalInfo;
                this.viewModel.formSubmitChannelData = detail.data.formSubmitChannelData;
                this.resolve(this.viewModel);
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
        //});
    }
    private resolve(data:IViewModel){
        //makeing sure that card and address components triggerred their separate handlers and updated the CardOnlyService's viewModel 
        //this.submit(data);        
        this.addOrUpdateCall(data);
    }
    //addOrUpdateCall(paymentSuccess: boolean, vm:IViewModelEncrypted, cpcPageType:string): void {
    addOrUpdateCall(viewModel:IViewModel): void {
        const cpcPageType = this.currentPaymentType = this.config.cpcPageType.toString().toLowerCase();
        if(this.currentPaymentType === PaymentType[PaymentType.MinCardOnlyWithEdit].toLowerCase()){
            if(this.minCardEditService.existingFormData.get('cpcStatus') === 'success'){
                if(this.minCardEditService.isFormFieldsModified()){
                    if(this.minCardEditService.existingFormData.get('isCCChanged') === 'true'){
                        //on CC change make an addToWallet service call
                        this.submit(viewModel);
                        console.log('only cc modified, make an addToWallet api call');
                    } else if(this.minCardEditService.existingFormData.get('isExpiryChanged') === 'true') {
                        //on expiry date change make an updateInstrument service call
                        this.minCardEditService.updateExistingPaymentInstrument(viewModel);
                        console.log('only expiry date modified, make an update instruent call');
                    } else {
                        this.submit(viewModel);
                    }
                } else {                
                    //no change, no api call, send dummy response back to the channel app
                    this.minCardEditService.sendDummyResponse(cpcPageType);
                    console.log('data not modified, no api call');
                }
            } else {
                this.submit(viewModel);
            }
            
        } else {
            this.submit(viewModel);
        }
    }
    async submit(viewModel:IViewModel){
        this.viewModel = viewModel;
        console.log('minCardOnly service posted data: ', JSON.stringify(viewModel));
        const cardType = PaymentType[PaymentType.MinCardOnly];
        const pciEncryptedData = await this.commonService.getEncryptedCCInfo(cardType.toLowerCase(),this.viewModel);
        const request = this.prepareRequest(pciEncryptedData,viewModel.personalInfo);
        this.viewModel.cardInfo.encryptedCardNumber = (pciEncryptedData)?.paytmentDetail?.cardNumber;
        if(request && request.channelData) {
            this.addToWallet(request, cardType);
        }        
    }
    

    appendCssUrl(config: IConfig, link:any){    	
        if(link && config && config.cpcPageCssUrl) {	
            link.href = config.cpcPageCssUrl;	
        }	
    }
    
    
    onSubmit(paymentSuccess: boolean, vm:IViewModelEncrypted, cpcPageType:string): void {         
        //console.log('');                           
    }   
    getPostRequestChild():any{
        return this.getPostRequest(this.viewModel,'card');
    }
    getPaymentType(): string{
        return PaymentType[PaymentType.MinCardOnly].toString();
    }
    dispatchDatalayerEvent(submissionDetails:any){
        this.dataLayerService.dispatchInfoEvent(CPC_MIN_CARD_API_SUBMIT, submissionDetails);
    }
    
    getErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        switch(key){
        case ErrorType.form:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,subKey);
            break;
        case ErrorType.service:            
            errorMessage = this.global.getErrorMessage(ErrorType.service, subKey);
            break;
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,key,subKey);
            break;
        }
        return errorMessage;
    } 
    
    
}