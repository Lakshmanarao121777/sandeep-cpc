import {
    ErrorType,
    IConfig,
    IInputReference,
    IViewModelEncrypted,
} from '../model/view.model';
import {IViewModel} from '../model/viewModel/view-model';
import { Validation } from '../utils/validation';
import { DataLayerService } from './data-layer.service';
import { Globals } from '../utils/globals';
import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';
import { ErrorHandling } from '../utils/error-handling';

export class AccountTypeService extends BaseAccountTypeService {
    public inputReference: IInputReference = Object.assign({});
    public viewModel: IViewModel = Object.assign({});
    public config: IConfig = Object.assign({});
    public validations = new Validation();
    public formFieldStatusMap = new Map<string,boolean>();
    private dataLayerService:DataLayerService = Object.assign({});
    constructor(config:IConfig, channel:ChannelService,type:string,errorMessageResponse:any,errorHandling:ErrorHandling) {
        super(config,channel,type,errorMessageResponse,errorHandling);
        console.log('AccountType constructor');
        this.global = Globals.getInstance();
        this.dataLayerService = new DataLayerService();
    }
    
    paymentClick(
        paymentSuccess: boolean,
        vm: IViewModelEncrypted,
        cpcPageType: string
    ): void {
        console.log(paymentSuccess, cpcPageType);
        console.log('this.viewModel', vm);
        console.log('this.viewModel', this.viewModel);
    }
    removeErrorFeedback = (reference: string) => {
        const parentId =
            this.inputReference[reference as keyof IInputReference].parentElement;
        const errFeedback =
            this.inputReference[reference as keyof IInputReference].name;
        if (parentId) {
            const selector = `[name='${errFeedback}-feedback']`;
            if (selector && parentId.querySelector(selector)) {
                parentId.querySelector(selector).remove();
            }
        }
    };
    appendErrorFeedback = (reference: string, feedbackMsg: string): any => {
        const nameField =
            this.inputReference[reference as keyof IInputReference].name;
        const div = document.createElement('div');
        div.setAttribute('name', nameField + '-feedback');
        div.classList.add('invalid-feedback');
        div.innerHTML = feedbackMsg;
        return div;
    };
    handleErrorClass = (
        reference: any,
        flag: boolean,
        model: string,
        err: any
    ): void => {
        if (flag) {
            // this.viewModel[model as keyof IViewModel] = this.inputReference[reference as keyof IInputReference]
            this.inputReference[reference as keyof IInputReference].classList.remove(
                'is-invalid'
            );
            this.removeErrorFeedback(reference);
        } else {
            this.removeErrorFeedback(reference);
            this.inputReference[reference as keyof IInputReference].classList.add(
                'is-invalid'
            );
            this.inputReference[
                reference as keyof IInputReference
            ]?.parentElement.append(this.appendErrorFeedback(reference, err));
            console.log(err);
        }
    };
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
