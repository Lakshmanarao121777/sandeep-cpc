import { IInputReference } from '../../model/view.model';
import { IViewModel } from '../../model/viewModel/view-model';
import { BaseViewModelService } from './base-vm.service';
import { CareWebComponent } from '../../index';
import { CareService } from '../care.service';
import { Validation } from '../../utils/validation';
import { FormValidationService } from '../form-validation-service';
import { JUMP_UPDATE_VIEW_MODEL, JUMP_ERROR_MESSAGE_LOADED, CC, ACH } from '../../constant/app.constant';
export class CareViewModelService extends BaseViewModelService{
    public view:CareWebComponent;
    public careService:CareService;     
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    public formValidationService:FormValidationService;
    public careFor:string;
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    public iguardEnvironment = '';
    public iguardChannel = '';
    constructor(view:CareWebComponent,careService:CareService,formValidationService:FormValidationService, validationService:Validation){
        super(validationService);
        this.formValidationService = new FormValidationService();
        this.view = view;
        this.careFor = view?.careFor;
        this.careService = careService;
        
        console.log('Care VM constructor');
    }

    handleComponentLoaded(){
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
        this.setElementReference();
        this.checkToRunBindEvent();
    }
 
    handleErrMessageLoaded(pageType:string){
        this.handleCare(pageType);
        this.executeBindEvent(pageType);
    }    
    handleCare(pageType:any) {
        if(pageType === ''){
            this.global.actionObserverService.fire(this,{detail:{action:JUMP_ERROR_MESSAGE_LOADED}});
        } 
        if(pageType?.toLowerCase() === CC) {
            this.careFor = CC;
        } 
        if(pageType?.toLowerCase() === ACH) {
            this.careFor = ACH;
        }
    }
    isIguardAllowed(): boolean {
        const iGuardChannel = this.global.appState.get('channelData').config?.iguard?.channelName?.toLowerCase();
        const mappedChannelEnvironmentKeynameMapping =this.global.appState.get('channelData').config?.channelEnvironmentKeynameMapping?.filter((ct: any) => { return ct.channel?.toLowerCase() === iGuardChannel; });
        if (Array.isArray(mappedChannelEnvironmentKeynameMapping) && mappedChannelEnvironmentKeynameMapping.length > 0) {
            const keyName = mappedChannelEnvironmentKeynameMapping[0]?.keyName;
            this.iguardEnvironment = mappedChannelEnvironmentKeynameMapping[0]?.iguardEnvironment;
            this.iguardChannel = mappedChannelEnvironmentKeynameMapping[0]?.channel;
            if (keyName) {
                return true;
            }
        }
        return false;
    }

    submit(e:any){    
        const cardVm:IViewModel = Object.assign({});
        this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'default-payment',data:cardVm }});     
    }
}
