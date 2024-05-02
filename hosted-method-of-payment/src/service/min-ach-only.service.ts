import {
    MIN_ACH_COMPONENT,
    ACCOUNT_TYPE_COMPONENT,
    JUMP_UPDATE_VIEW_MODEL,
    CPC_BANK_API_SUBMIT,
    USERROLE_LIST_COMPONENT_ACH,
    JUMP_UPDATE_VIEW_MODEL_USERROLE_ACH,
} from '../constant/app.constant';
import {
    IConfig,
    PaymentType,
} from '../model/view.model';
import { IViewModel} from '../model/viewModel/view-model';
import { ErrorHandling } from '../utils/error-handling';
import { CommonService } from './common.service';
import { DataLayerService } from './data-layer.service';
import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';
import { MinAchOnlyViewModelService } from './viewModel/min-ach-only-vm-service';
import { IPersonalInfoModel } from '../model/personal-info-model';

export class MinAchOnlyService extends BaseAccountTypeService {
    public minAchOnlyViewModelService:MinAchOnlyViewModelService = Object.assign({});  
    public commonService = Object.assign({});  
    public dataLayerService = new DataLayerService();
    public viewModel:IViewModel = Object.assign({});

    constructor(config:IConfig, channel:ChannelService,type:string,minAchOnlyVmService:MinAchOnlyViewModelService,errorMessageResponse:any,commonService:CommonService,errorHandling:ErrorHandling) {
        super(config,channel,type,errorMessageResponse,errorHandling);
        console.log('MIN ACH constructor');

        this.minAchOnlyViewModelService = minAchOnlyVmService;
        this.commonService = commonService;
        this.global.updateVmMap.set(MIN_ACH_COMPONENT,false);        
        this.global.updateVmMap.set(ACCOUNT_TYPE_COMPONENT,false);
        this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_ACH,false);
        this.subscribe();        
    }
    subscribeChild(detail:any){
        switch(detail?.action){
        case JUMP_UPDATE_VIEW_MODEL:
            console.log('ach update view model ',detail.data);
            if(detail?.type === 'min-ach'){
                console.log('type is min ach');
                this.viewModel.cpcPageType = 'MinAchOnly';
                this.viewModel.accountInfo = detail.data.accountInfo;
                this.viewModel.personalInfo = detail.data.personalInfo;
                this.global.updateVmMap.set(MIN_ACH_COMPONENT,true);
                this.viewModel.formSubmitChannelData = detail.data.formSubmitChannelData;
                this.resolve(this.viewModel);        
            } else if(detail?.type === 'account-type'){
                console.log('acc type vm ', this.viewModel.accountInfo);
                if(this.viewModel.accountInfo){
                    this.global.updateVmMap.set(ACCOUNT_TYPE_COMPONENT,true);
                    this.viewModel.accountInfo.accountTypeChecking = detail?.data?.accountInfo?.accountTypeChecking;
                    this.viewModel.accountInfo.accountTypeSaving = detail?.data?.accountInfo?.accountTypeSaving;
                    this.viewModel.accountInfo.accountTypeCorporateChecking = detail?.data?.accountInfo?.accountTypeCorporateChecking;
                    // this.viewModel.formSubmitChannelData = detail.data.formSubmitChannelData;
                    //this.resolve(this.viewModel);
                }
            } else if(detail?.type === JUMP_UPDATE_VIEW_MODEL_USERROLE_ACH){
                console.log('userrole-ach vm ', this.viewModel.walletId);
                if(detail?.data?.walletId){
                    this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_ACH,true);
                    this.viewModel.walletId = detail?.data?.walletId;
                    this.viewModel.formSubmitChannelData = detail.data.formSubmitChannelData;
                    this.resolve(this.viewModel);   
                }
            }
            this.resolve(this.viewModel);  
            break;            
        }
    }
    private resolve(data:IViewModel){
        //makeing sure that card and address components triggerred their separate handlers and updated the CardOnlyService's viewModel 
        if( this.global.updateVmMap.get(MIN_ACH_COMPONENT)             
            && this.global.updateVmMap.get(ACCOUNT_TYPE_COMPONENT)
            && this.global.updateVmMap.get(USERROLE_LIST_COMPONENT_ACH)
        ){
            console.log('resolved....', data);
            this.submit(data);
        }        
    }
    async submit(viewModel:IViewModel){
        this.viewModel = viewModel;
        console.log('minAchOnly service posted data: ', JSON.stringify(viewModel));

        const cardType = PaymentType[PaymentType.MinAchOnly];
        const pciEncryptedData = await this.commonService.getEncryptedCCInfo(cardType.toLowerCase(),this.viewModel);
        const request = this.prepareRequest(pciEncryptedData,viewModel.personalInfo);
        this.viewModel.accountInfo.encryptedAccountNumber = pciEncryptedData?.paytmentDetail?.accountNo;
        if(request && request.channelData) {
            this.addToWallet(request, cardType);
        }
    }
    getPostRequestChild():any{
        return this.getPostRequest(this.viewModel,'bank');
    }
    getPaymentType(): string{
        return PaymentType[PaymentType.MinAchOnly].toString();
    }
    dispatchDatalayerEvent(submissionDetails:any){
        this.dataLayerService.dispatchInfoEvent(CPC_BANK_API_SUBMIT, submissionDetails);
    }
    
    
    
    appendCssUrl(config: IConfig, link: any) {
        if (link && config && config.cpcPageCssUrl) {
            link.href = config.cpcPageCssUrl;
        }
    }
}