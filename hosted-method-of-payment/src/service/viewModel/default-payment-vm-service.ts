import { IInputReference } from '../../model/view.model';
import { IViewModel } from '../../model/viewModel/view-model';
import { BaseViewModelService } from './base-vm.service';
import { DefaultPaymentWebComponent } from '../../index';
import { DefaultPaymentService } from '../default-payment.service';
import { Validation } from '../../utils/validation';
import { FormValidationService } from '../form-validation-service';
import { JUMP_ERROR_MESSAGE_LOADED, ACH, CC, SET_DEFAULT_COMPONENT_CHECKED } from '../../constant/app.constant';
export class DefaultPaymentViewModelService extends BaseViewModelService {
    public view: DefaultPaymentWebComponent;
    public defaultPaymentService: DefaultPaymentService;
    public inputReference: IInputReference = Object.assign({});
    public viewModel: IViewModel = Object.assign({});
    public formValidationService: FormValidationService;
    public defaultPaymentFor: string;
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    constructor(view: DefaultPaymentWebComponent, defaultPaymentService: DefaultPaymentService, formValidationService: FormValidationService, validationService: Validation) {
        super(validationService);
        this.formValidationService = new FormValidationService();
        this.view = view;
        this.defaultPaymentFor = view?.defaultPaymentFor;
        this.defaultPaymentService = defaultPaymentService;
        this.global.updateVmMap.set(SET_DEFAULT_COMPONENT_CHECKED, false);
        console.log('Default Payment VM constructor');
    }

    handleComponentLoaded() {
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
        this.setElementReference();
        this.checkToRunBindEvent();
    }

    handleErrMessageLoaded(pageType: string) {
        this.handleDefaultPayment(pageType);
        this.executeBindEvent(pageType);
    }
    handleReset() {
        this.reset();
    }
    bindEvents() {
        this.displayDefaultPayment();
    }
    handleDefaultPayment(pageType: any) {
        if (pageType === '') {
            this.global.actionObserverService.fire(this, { detail: { action: JUMP_ERROR_MESSAGE_LOADED } });
        }
        if (pageType.toLowerCase() === CC) {
            this.inputReference.defaultPayment = document.querySelector('#jump-cc-web-component [name="jump-default-payment-checkbox"]') as HTMLInputElement;
            this.displayDefaultPayment();
            this.defaultPaymentFor = 'CC';
        } else if (pageType.toLowerCase() === ACH) {
            this.inputReference.defaultPayment = document.querySelector('#jump-ach-web-component [name="jump-default-payment-checkbox"]') as HTMLInputElement;
            this.displayDefaultPayment();
            this.defaultPaymentFor = 'ACH';
        }
    }
    displayDefaultPayment() {
        if (this.global.appState.get('channelData').config?.displaySetDefault) {
            const cache = Object.assign({});
            const pageTypeCC = document.querySelector('#jump-cc-web-component [name="jump-default-payment"]');
            const pageTypeACH = document.querySelector('#jump-ach-web-component [name="jump-default-payment"]');
            if (pageTypeCC) {
                cache.showDefaultPaymentCC = pageTypeCC;
                cache.showDefaultPaymentCC?.classList?.remove('d-none');
                cache.showDefaultPaymentCC?.classList?.add('show');
            }
            if (pageTypeACH) {
                cache.showDefaultPaymentAch = pageTypeACH;
                cache.showDefaultPaymentAch?.classList?.remove('d-none');
                cache.showDefaultPaymentAch?.classList?.add('show');
            }
            this.inputReference.defaultPayment = Object.assign({ 'value': false });
        }
    }

    reset() {
        let isDefaultPayment: any;
        isDefaultPayment = document.querySelector('#jump-cc-web-component [name="jump-default-payment-checkbox"]');
        if (isDefaultPayment?.checked) {
            isDefaultPayment.checked = false;
            this.resetDefaultPayment(isDefaultPayment);
        }
        isDefaultPayment = document.querySelector('#jump-ach-web-component [name="jump-default-payment-checkbox"]');
        if (isDefaultPayment?.checked) {
            isDefaultPayment.checked = false;
            this.resetDefaultPayment(isDefaultPayment);
        }
    }
    resetDefaultPayment(selectorDefaultpaymentCheckbox: any) {
        if (this.global.appState.get('channelData').config?.displaySetDefault) {
            this.displayDefaultPayment();
        }
    }
    submit(e: any) {
        let setAsDefaultPayment;
        const cardComponent =  document.getElementById('jump-cc-web-component');
        const bankComponent =  document.getElementById('jump-ach-web-component');
        if(cardComponent?.classList.contains('show')) {
            setAsDefaultPayment = document.querySelector('#jump-cc-web-component [name="jump-default-payment-checkbox"]') as HTMLInputElement;
        }
        if(bankComponent?.classList.contains('show')) {
            setAsDefaultPayment = document.querySelector('#jump-ach-web-component [name="jump-default-payment-checkbox"]') as HTMLInputElement;
        }
        if (setAsDefaultPayment) {
            this.global.updateVmMap.set(SET_DEFAULT_COMPONENT_CHECKED, setAsDefaultPayment.checked);
        }
    }
}
