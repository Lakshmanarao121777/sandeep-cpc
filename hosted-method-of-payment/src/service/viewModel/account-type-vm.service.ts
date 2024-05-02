import { ACCOUNT_TYPE_COMPONENT, CARD_EXPIRATION_EDIT, CORPORATE_ACCOUNT_TYPE, CORPORATE_CHANNELS, CORPORATE_DEFAULT_ACCOUNT_TYPE, CPC_BANK_ACCOUNT_TYPE_SELECT, JUMP_UPDATE_VIEW_MODEL,  WALLET_MGMT_NO_AUTOPAY, EVN_SAVE_PAYMENT_METHOD, CURRENT_CHANNEL_DOMAIN } from '../../constant/app.constant';
import { AccountTypeWebComponent } from '../../index';
import { ErrorType, IInputReference } from '../../model/view.model';
import { IViewModel } from '../../model/viewModel/view-model';
import { Validation } from '../../utils/validation';
import { AccountTypeService } from '../account-type.service';
import { FormValidationService } from '../form-validation-service';
import { BaseViewModelService } from './base-vm.service';
import { DataLayerService } from './../data-layer.service';
import { LABEL_CHECKING, LABEL_SAVINGS, LABEL_CORPORATE_CHECKING, LABEL_PERSONAL_SAVINGS, LABEL_PERSONAL_CHECKING} from '../../constant/bank-account-type';

export class AccountTypeViewModelService extends BaseViewModelService{
    public view:AccountTypeWebComponent;
    public model:AccountTypeService;     
    public formValidationService:FormValidationService;
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    private dataLayerService:DataLayerService = Object.assign({});
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    constructor(view:AccountTypeWebComponent,model:AccountTypeService, formValidationService:FormValidationService, validationService:Validation){
        super(validationService);
        this.formValidationService = new FormValidationService();
        this.dataLayerService = new DataLayerService();
        this.view = view;
        this.model = model;
    }
    handleComponentLoaded(){
        console.log('acc-type-vm inside comp loaded');
        this.viewModel = this.model.viewModel;
        this.viewModel.personalInfo = Object.assign({});
        this.viewModel.accountInfo = Object.assign({});
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
        this.setElementReference();
        this.checkToRunBindEvent();
        const cpcPageType = this.global.appState.get('config').cpcPageType.toLowerCase();
        if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase() || cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
            this.cardListSubmit();
        }
    }
    handleErrMessageLoaded(pageType:string){
        this.executeBindEvent('handleErrMessageLoaded - account-type-vm.service.ts' + ' ' + pageType);
    }    
    handleReset(){
        this.reset();
    }  
    setElementReference(): void {
        this.inputReference.accountTypeCorporateChecking = this.getElementRef('[id="jump-acc-type-corporate-checking"]');
        this.inputReference.accountTypeChecking = this.getElementRef('[id="jump-acc-type-checking"]');
        this.inputReference.accountTypeSaving = this.getElementRef('[id="jump-acc-type-saving"]');
    }  
    bindEvents(){
        this.switchAccount();
        //this.validate();
        this.bindClick('click', 'accountTypeChecking');
        this.bindClick('click', 'accountTypeSaving');
        this.bindClick('click', 'accountTypeCorporateChecking');

        this.viewModel.accountInfo.accountTypeCorporateChecking = this.inputReference.accountTypeCorporateChecking.checked;
        this.viewModel.accountInfo.accountTypeChecking = this.inputReference.accountTypeChecking.checked;
        this.viewModel.accountInfo.accountTypeSaving = this.inputReference.accountTypeSaving.checked;
    }
    bindClick(event: string, reference: string) {            
        switch(reference.toLowerCase()){
        case 'accounttypechecking':            
            this.inputReference.accountTypeChecking.addEventListener(event, () => {
                this.inputReference.accountTypeCorporateChecking.checked = false;
                this.inputReference.accountTypeChecking.checked = true;
                this.inputReference.accountTypeSaving.checked = false;
                this.removeErrorFeedback('accountTypeChecking');
                this.inputReference.accountTypeChecking?.classList?.remove('is-invalid'); 
                this.removeErrorFeedback('accountTypeSaving');
                this.inputReference.accountTypeSaving?.classList?.remove('is-invalid');    
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_ACCOUNT_TYPE_SELECT, LABEL_CHECKING);       
            });           
            break;
        case 'accounttypesaving':  
            this.inputReference.accountTypeSaving.addEventListener(event, () => {
                this.inputReference.accountTypeCorporateChecking.checked = false;
                this.inputReference.accountTypeChecking.checked = false;
                this.inputReference.accountTypeSaving.checked = true;
                this.removeErrorFeedback('accountTypeSaving');
                this.inputReference.accountTypeSaving.classList.remove('is-invalid');
                this.removeErrorFeedback('accountTypeChecking');
                this.inputReference.accountTypeChecking.classList.remove('is-invalid');
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_ACCOUNT_TYPE_SELECT, LABEL_SAVINGS);
            });                          
            break;
        case 'accounttypecorporatechecking':            
            this.inputReference.accountTypeCorporateChecking.addEventListener(event, () => {
                this.inputReference.accountTypeCorporateChecking.checked = true;
                this.inputReference.accountTypeChecking.checked = false;
                this.inputReference.accountTypeSaving.checked = false;
                this.removeErrorFeedback('accountTypeCorporateChecking');
                this.inputReference.accountTypeChecking.classList.remove('is-invalid');
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_ACCOUNT_TYPE_SELECT, LABEL_CORPORATE_CHECKING);
            });            
            break;     
        default:
            break;
        }
    }
    cardListSubmit():void {
        const reviewButtonAch = document.querySelector('#' + 'cardListPlaceholderBank' + ' [id="jump-save-option-ach"]');
        reviewButtonAch?.addEventListener('click', () => {
            this.submit('');
        });
        const cancelButtonAch = document.querySelector('#' + 'cardListPlaceholderBank' + ' [id="jump-cancel-option-ach"]');
        cancelButtonAch?.addEventListener('click', () => {
            this.reset();
        });
    }
    submit(e:any){ 
        console.log('account-type-vm submit');
        this.global.updateVmMap.set(ACCOUNT_TYPE_COMPONENT,false);
        if(this.model.channel.channelData.selectedPaymentType === 'achonly' ||
        this.model.channel.channelData.selectedPaymentType === 'minachonly'){
            const accTypeVm:IViewModel = Object.assign({});
            accTypeVm.accountInfo = Object.assign({});
            if(this.inputReference.accountTypeChecking.checked){
                accTypeVm.accountInfo.accountTypeChecking = 'true';
            } else if(this.inputReference.accountTypeSaving.checked){
                accTypeVm.accountInfo.accountTypeSaving = 'true';
            } else if(this.inputReference.accountTypeCorporateChecking.checked){
                accTypeVm.accountInfo.accountTypeCorporateChecking = 'true';
            }                                
            const isFormValid = this.validate();            
            if(isFormValid){
                this.global.updateVmMap.set(ACCOUNT_TYPE_COMPONENT,false);
                this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'account-type',data:accTypeVm }});
            }        
        }
        
    }
    switchAccount(){
        const corporateAccountTemplate =document.querySelector('[id="jump-corporate-account"]');
        const personalAccountTemplate =document.querySelector('[id="jump-personal-account"]');
        // const channel_name = this.model.channel.channelData.channelDetails.channelName.toLowerCase();
        const acccount_type = this.global.appState.get('currentAccountType');

        if(acccount_type === CORPORATE_ACCOUNT_TYPE) {
            corporateAccountTemplate?.classList?.add('show');
            personalAccountTemplate?.classList?.remove('show');
            this.inputReference.accountTypeCorporateChecking.checked = true;
        } else if(acccount_type === CORPORATE_DEFAULT_ACCOUNT_TYPE) {
            const checkingLabel:any = document.querySelector('[id="jump-acc-type-checking-label"]');
            const savingLabel:any = document.querySelector('[id="jump-acc-type-saving-label"]');
            corporateAccountTemplate?.classList?.add('show');
            personalAccountTemplate?.classList?.add('show');
            checkingLabel.innerHTML = LABEL_PERSONAL_CHECKING;
            savingLabel.innerHTML = LABEL_PERSONAL_SAVINGS;
            
        } else {
            corporateAccountTemplate?.classList?.remove('show');
            personalAccountTemplate?.classList?.add('show');
            this.inputReference.accountTypeChecking.checked = true;
        }
    }
    validate(): boolean {
        let flag = true;
        const acccount_type = this.global.appState.get('currentAccountType');
        this.removeErrorNodes(['accountTypeCorporateChecking','accountTypeSaving','accountTypeChecking']);
        if(acccount_type === CORPORATE_ACCOUNT_TYPE){
            if (!this.inputReference?.accountTypeCorporateChecking?.checked) {
                flag = false;
                this.inputReference.accountTypeCorporateChecking.classList.add('is-invalid');
                this.inputReference.accountTypeCorporateChecking.parentElement.append(
                    this.appendErrorFeedback(
                        'accountTypeCorporateChecking',
                        this.getErrorMessage(ErrorType.account_type,ErrorType.no_value)
                    )
                );
                console.log(this.getErrorMessage(ErrorType.account_type,ErrorType.no_value));
            }
            else {
                if (this.inputReference?.accountTypeCorporateChecking?.checked) {
                    this.viewModel.accountInfo.accountTypeCorporateChecking = this.inputReference.accountTypeCorporateChecking.checked;
                }
            }
        } else if (acccount_type === CORPORATE_DEFAULT_ACCOUNT_TYPE) {
            if (this.inputReference?.accountTypeChecking?.checked) {
                this.viewModel.accountInfo.accountTypeChecking =  this.inputReference.accountTypeChecking.checked;
            } else if (this.inputReference?.accountTypeSaving?.checked) {
                this.inputReference.accountTypeChecking.checked = false;
                this.viewModel.accountInfo.accountTypeChecking = 'false';
                this.viewModel.accountInfo.accountTypeSaving = this.inputReference.accountTypeSaving.checked;
            } else if (this.inputReference?.accountTypeCorporateChecking.checked) {
                this.viewModel.accountInfo.accountTypeCorporateChecking = this.inputReference.accountTypeCorporateChecking.checked;
            }
        } else{
            if (
                !this.inputReference?.accountTypeChecking?.checked &&
                    !this.inputReference?.accountTypeSaving?.checked
            ) {
                flag = false;
                this.inputReference.accountTypeChecking.classList.add('is-invalid');
                this.inputReference.accountTypeChecking.parentElement.append(this.appendErrorFeedback('accountTypeChecking', this.getErrorMessage(ErrorType.account_type,ErrorType.no_value))
                );
                this.inputReference.accountTypeSaving.classList.add('is-invalid');
                this.inputReference.accountTypeSaving.parentElement.append(this.appendErrorFeedback('accountTypeSaving', this.getErrorMessage(ErrorType.account_type,ErrorType.no_value))
                );
                console.log(this.getErrorMessage(ErrorType.account_type,ErrorType.no_value));
            } else {
                if (this.inputReference?.accountTypeChecking?.checked) {
                    this.viewModel.accountInfo.accountTypeChecking =
                            this.inputReference.accountTypeChecking.checked;
                } else if (this.inputReference?.accountTypeSaving?.checked) {
                    this.inputReference.accountTypeChecking.checked = false;
                    this.viewModel.accountInfo.accountTypeChecking = 'false';
                    this.viewModel.accountInfo.accountTypeSaving = this.inputReference.accountTypeSaving.checked;
                }
            }
        }
        if(flag ===  false) {            
            this.formFieldStatusMap.set('accountType', false);
        }
        return flag;
    }
    removeErrorNodes(arrInputRef:Array<string>){
        arrInputRef.forEach(item=>{
            this.removeErrorFeedback(this.inputReference[item as keyof IInputReference]);
        });     
    }
    reset() {        
        const accountType =  this.model.channel.channelData.channelDetails.channelName.toLowerCase();
        const cpcPageType = this.global.appState.get('config').cpcPageType.toLowerCase();
        //this.removeErrorNodes(['accountTypeCorporateChecking','accountTypeSaving','accountTypeChecking']);
        if(CORPORATE_CHANNELS.includes(accountType)){            
            this.inputReference.accountTypeCorporateChecking.checked = true;
            this.viewModel.accountInfo.accountTypeCorporateChecking = 'true';
            this.inputReference.accountTypeCorporateChecking.classList.remove('is-invalid');
            this.removeErrorFeedback('accountTypeCorporateChecking');
        } else if(cpcPageType !== CARD_EXPIRATION_EDIT.toLowerCase()){                
            this.viewModel.accountInfo.accountTypeChecking = 'true';
            this.inputReference.accountTypeChecking.checked = true;
            this.inputReference.accountTypeChecking.classList.remove('is-invalid');
            this.removeErrorFeedback('accountTypeChecking');   
            this.inputReference.accountTypeSaving.checked = false;
            this.viewModel.accountInfo.accountTypeSaving = 'false';
            this.inputReference.accountTypeSaving.classList.remove('is-invalid');
            this.removeErrorFeedback('accountTypeSaving');
        }
    }
    getErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        switch(key){
        case ErrorType.account_type:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.account_type,subKey);
            break;
        }
        return errorMessage;
    }
}
