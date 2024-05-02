import { AddressDetails, IConfig, IInputReference, IViewModelEncrypted } from '../model/view.model';
import { Validation } from '../utils/validation';
import { CommonService } from './common.service';
import { DataLayerService } from './data-layer.service';
import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';
import { AddressOnlyViewModelService } from './viewModel/address-only-vm-service';
import { IViewModel } from '../model/viewModel/view-model';
import { ErrorHandling } from '../utils/error-handling';

export class AddressOnlyService extends BaseAccountTypeService{
    public inputReference:IInputReference = Object.assign({});
    public config: IConfig = Object.assign({});
    public validations = new Validation();
    public addressDetail: AddressDetails = Object.assign({});
    public commonService:CommonService = Object.assign({});  
    private dataLayerService:DataLayerService = Object.assign({});
    public addressVmService:AddressOnlyViewModelService = Object.assign({});
    public viewModel:IViewModel = Object.assign({});

    constructor(config:IConfig, channel:ChannelService,type:string,addressOnlyVmService:AddressOnlyViewModelService,errorMessageResponse:any,errorHandling:ErrorHandling) {
        super(config,channel,type,errorMessageResponse,errorHandling);
        this.addressVmService = addressOnlyVmService;
    }
    load(){
        console.log('load address-only');
        this.global.actionObserverService?.subscribe((sender:any,submittedData:any) =>{
            //console.log('form data', formData);
            const data = submittedData.detail.data;
            switch(submittedData.detail.action){
            case 'jump-form-submit':
                console.log('jump-form-submit - address-only');
                const addressVm:IViewModel = Object.assign({});
                console.log('address info: ', data);
                this.submit(addressVm);
                break;
            }
            
        });
    }
    submit(viewModel:IViewModel){
        this.viewModel = viewModel;
        console.log('address info: ', viewModel);        
    }
 
    bindTemplateToView(viewModel:IViewModel, config:IConfig): void {
        this.viewModel = viewModel;
        this.addressDetail = this.commonService.getAddressValues(this.channel.channelData.customerDetails);
        this.config = config;
        this.inputReference.addressOption.checked = false;
        
        if(this.channel?.channelData?.editForm){
            this.launchEditMode();
        }
    }
    
    launchEditMode(){        
        this.inputReference.address.value = this.channel.channelData.editForm.address ? this.channel.channelData.editForm.address : '';
        this.inputReference.addressLine2.value = this.channel.channelData.editForm.addressLine2 ? this.channel.channelData.editForm?.addressLine2 : '';
        this.inputReference.city.value = this.channel.channelData.editForm.city ? this.channel.channelData.editForm?.city : '';
        this.inputReference.state.value = this.channel.channelData.editForm.state ? this.channel.channelData.editForm.state : '';
        this.inputReference.zipCode.value = this.channel.channelData.editForm.zipCode ? this.channel.channelData.editForm.zipCode : '';                
    }    

    paymentClick(paymentSuccess: boolean, vm:IViewModelEncrypted, cpcPageType:string): void {
        console.log(paymentSuccess,cpcPageType);
        console.log('this.viewModel',vm);
        console.log('this.viewModel',this.viewModel);                              
    }    
}