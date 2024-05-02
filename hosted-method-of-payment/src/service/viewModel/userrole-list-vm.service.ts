import { USERROLE_LIST_COMPONENT_CC, USERROLE_LIST_COMPONENT_ACH, CARD_EXPIRATION_EDIT, JUMP_UPDATE_VIEW_MODEL, WALLET_MGMT_NO_AUTOPAY, CC, ACH, CPC_CREDIT_CARD_USERROLE_SELECT, CPC_BANK_USERROLE_SELECT, JUMP_UPDATE_VIEW_MODEL_USERROLE_ACH, JUMP_UPDATE_VIEW_MODEL_USERROLE_CC, EVN_CPC_ERROR } from '../../constant/app.constant';
import { UserroleListWebComponent } from '../../index';
import { IInputReference } from '../../model/view.model';
import { IViewModel } from '../../model/viewModel/view-model';
import { Validation } from '../../utils/validation';
import { ChannelService } from '../channel-service';
import { UserroleListService } from '../userrole-list.service';
import { FormValidationService } from '../form-validation-service';
import { BaseViewModelService } from './base-vm.service';
import { DataLayerService } from './../data-layer.service';
import { UserRoleDetails } from '../../model/channel-data';
import { CPCContentType } from '../../model/view.model';
import { getUserRoleUtil, maskEscapeChars  } from '../viewModel/util/userrole-util';
import { waitForElementToLoad } from '../../utils/elementLoader';

export class UserroleListViewModelService extends BaseViewModelService {
    public view: UserroleListWebComponent;
    public model: UserroleListService;
    public formValidationService: FormValidationService;
    public inputReference: IInputReference = Object.assign({});
    public viewModel: IViewModel = Object.assign({});
    private dataLayerService: DataLayerService = Object.assign({});
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    public selecteduserrole = '';
    constructor(view: UserroleListWebComponent, model: UserroleListService, formValidationService: FormValidationService, validationService: Validation) {
        super(validationService);
        this.formValidationService = new FormValidationService();
        this.dataLayerService = new DataLayerService();
        this.view = view;
        this.model = model;
        this.inputReference.userrole = Object.assign({});
    }
    
    handleComponentLoaded() {
        console.log('userrole-list-vm inside comp loaded');
        const selectDefault = this.model.channel.channelData.customerDetails?.userRoleList;
        if(selectDefault) {
            this.displayUserRoleTitle(); 
        }
        this.displayUserRoleList();
        this.viewModel = this.model.viewModel;
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
        this.checkToRunBindEvent();
        const cpcPageType = this.global.appState.get('config').cpcPageType.toLowerCase();
        if (cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase() || cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
            this.cardListSubmit();
        }
    }
    
    handleErrMessageLoaded(pageType: string) {
        this.executeBindEvent('handleErrMessageLoaded - userrole-list-vm.service.ts' + ' ' + pageType);
    }
    handleReset() {
        this.reset();
    }
    bindEvents() {
        const config = this.validationService.setStoredPaymentValidationSelectionRequirement();
        const storedPaymentValidationSelection = this.validationService.setStoredPaymentValidationSelection(config.displayAutoPayEnroll, config.displayStoredPaymentMethod, config.requireStoredPaymentSelection, config.selectStoredPaymentOnLoad);
        const userRoleList = this.global.appState.get('channelData')?.customerDetails?.userRoleList;

        if ((userRoleList && this.model.channel.channelData.config?.enableMultipleUserSelection) || storedPaymentValidationSelection.displayStorePaymentComponent) {
            if (this.inputReference.userrole) {
                const selectDefault = this.model.channel.channelData.customerDetails?.userRoleList?.length === 1;
                if (this.model.userroleListFor.toLowerCase() === ACH) {
                    if(selectDefault) {
                        this.model.channel.channelData.customerDetails?.userRoleList?.map((userrole: UserRoleDetails) => {
                            this.inputReference.userrole['userrole-' + userrole.walletId + '-' + ACH] = { checked: selectDefault || userrole.defaultUserRole, walletId: userrole.walletId };
                        });
                    }else{
                        this.model.channel.channelData.customerDetails?.userRoleList?.map((userrole: UserRoleDetails) => {
                            this.inputReference.userrole['userrole-' + userrole.walletId + '-' + ACH] = { checked: userrole.defaultUserRole || false, walletId: userrole.walletId };
                        });
                    }
                }
                if (this.model.userroleListFor.toLowerCase() === CC) {
                    if(selectDefault) {
                        this.model.channel.channelData.customerDetails?.userRoleList?.map((userrole: UserRoleDetails) => {
                            this.inputReference.userrole['userrole-' + userrole.walletId + '-' + CC] = { checked: selectDefault || userrole.defaultUserRole, walletId: userrole.walletId };
                        });
                    } else{
                        this.model.channel.channelData.customerDetails?.userRoleList?.map((userrole: UserRoleDetails) => {
                            this.inputReference.userrole['userrole-' + userrole.walletId + '-' + CC] = { checked: userrole.defaultUserRole || false, walletId: userrole.walletId };
                        });
                    }
                }
            }
            for (const userrole in this.inputReference.userrole) {
                this.bindClick(userrole, this.inputReference.userrole[userrole].walletId);
            }
        }
    }
    bindClick(componentId: string, walletId: string): void {
        document.getElementById(componentId)?.addEventListener('click', async () => {
            console.log(walletId, 'selected');
            for (const userroleComponent in this.inputReference.userrole) {
                this.inputReference.userrole[userroleComponent].checked = false;
                const userroleComponentEle = document.querySelector('#' + maskEscapeChars(userroleComponent) + ' [name="jump-userrole-id"]');
                if (userroleComponentEle) {
                    userroleComponentEle.removeAttribute('checked');
                }
            }
            this.inputReference.userrole[componentId].checked = true;
            const inputEle = document.querySelector('#' + maskEscapeChars(componentId) + ' [name="jump-userrole-id"]');
            if (inputEle) {
                inputEle.setAttribute('checked', 'checked');
                const componnetId = '#jump-'+this.model.userroleListFor.toLowerCase()+'-web-component [id="jump-userrole-list"]';
                const element = await waitForElementToLoad(componnetId).then((element:any) => {
                    return element as HTMLElement;
                });
                if(element){
                    element?.parentElement?.classList.remove('jump-userrole-invalid-feedback');
                    this.removeErrorUserroleFeedback(element, 'jump-userrole-list-'+this.model.userroleListFor.toLowerCase());
                }
            }

            if (componentId.indexOf('-cc') >= 0) {
                this.dataLayerService.dispatchInfoEvent(CPC_CREDIT_CARD_USERROLE_SELECT, this.inputReference.userrole[componentId].walletId);
            }
            if (componentId.indexOf('-ach') >= 0) {
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_USERROLE_SELECT, this.inputReference.userrole[componentId].walletId);
            }
        });
    }
    async displayUserRoleTitle():Promise<void> {
        const userSelectionCC:any = document.querySelector('#jump-cc-web-component [name="jump-userrole-title"]');
        const userSelectionAch:any = document.querySelector('#jump-ach-web-component [name="jump-userrole-title"]');
        const globalUserSelectionTitle:any = this.getCPCContent(CPCContentType.user_selection_title);
        if(userSelectionCC && globalUserSelectionTitle) {
            userSelectionCC.innerHTML = globalUserSelectionTitle;
        }
        if(userSelectionAch && globalUserSelectionTitle) {
            userSelectionAch.innerHTML = globalUserSelectionTitle;
        }
    }
    displayUserRoleList() {
        const userRoleList = this.model.channel.channelData.customerDetails?.userRoleList;
        const userroleListContainerCc = document.querySelector('#jump-card-only-container [id="jump-userrole-container"]');
        const userroleListContainerAch = document.querySelector('#jump-ach-only-container [id="jump-userrole-container"]');
        
        const isUserRoleListEnable = this.global.appState.get('channelData')?.config?.enableMultipleUserSelection;
        const showUserRoleListOnLoad = this.global.appState.get('channelData')?.config?.selectStoredPaymentOnLoad;
        if (userRoleList && isUserRoleListEnable && showUserRoleListOnLoad) {
            if(userroleListContainerCc) {
                userroleListContainerCc?.classList.remove('d-none');
                userroleListContainerCc?.classList.add('show');
            } else {
                console.log('UserRoleListCC undefined');
            }
            if(userroleListContainerAch) {
                userroleListContainerAch?.classList.remove('d-none');
                userroleListContainerAch?.classList.add('show');
            } else {
                console.log('UserRoleListAch undefined');
            } 
        } 
    }
    cardListSubmit(): void {
        const reviewButtonAch = document.querySelector('#' + 'cardListPlaceholderBank' + ' [id="jump-save-option-ach"]');
        reviewButtonAch?.addEventListener('click', () => {
            this.submit('');
        });
        const cancelButtonAch = document.querySelector('#' + 'cardListPlaceholderBank' + ' [id="jump-cancel-option-ach"]');
        cancelButtonAch?.addEventListener('click', () => {
            this.reset();
        });
    }

    async submit(e: any) {
        console.log('userrole-list-vm submit', e);
        this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_CC, false);
        this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_ACH, false);
        const userroleVm: IViewModel = Object.assign({});
        const channelData = this.model.channel.channelData;
        userroleVm.walletId = getUserRoleUtil(new ChannelService(channelData), this.model.userroleListFor.toLowerCase(), channelData.customerDetails.walletId),
          
        channelData.customerDetails.walletId = userroleVm.walletId;
        const isFormValid = this.validate(userroleVm.walletId);
        userroleVm.formSubmitChannelData = e?.detail?.data?.channelData;
        if (isFormValid) {
            if (this.model.userroleListFor.toLowerCase() === CC) {
                this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_CC, false);
                this.global.actionObserverService.fire(this, { detail: { action: JUMP_UPDATE_VIEW_MODEL, type: JUMP_UPDATE_VIEW_MODEL_USERROLE_CC, data: userroleVm } });
            }
            if (this.model.userroleListFor.toLowerCase() === ACH) {
                this.global.updateVmMap.set(USERROLE_LIST_COMPONENT_ACH, false);
                this.global.actionObserverService.fire(this, { detail: { action: JUMP_UPDATE_VIEW_MODEL, type: JUMP_UPDATE_VIEW_MODEL_USERROLE_ACH, data: userroleVm } });

            }
        }else{
            const componnetId = '#jump-'+this.model.userroleListFor.toLowerCase()+'-web-component [id="jump-userrole-list"]';
            const element = await waitForElementToLoad(componnetId).then((element:any) => {
                return element as HTMLElement;
            });
            if(element){
                element?.parentElement?.classList.add('jump-userrole-invalid-feedback');
            }
        }
    }
    removeErrorFeedback(): void {
        const selector = `#jump-${this.model.userroleListFor.toLowerCase()}-web-component [name='jump-userrole-list-${this.model.userroleListFor.toLowerCase()}-feedback']`;
        const element = document.querySelector(selector);
        if(selector && element?.querySelector(selector)) {
            element?.parentElement?.classList.remove('jump-userrole-invalid-feedback');
            element?.querySelector(selector)?.remove();
        }
    }
    appendErrorFeedback(nameField:any, feedbackMsg: string): any {
        const div = document.createElement('div');
        div.setAttribute('name', nameField + '-feedback');
        div.classList.add('invalid-feedback');
        div.innerHTML = feedbackMsg;
        return div;
    } 
    validate(walletId:string): boolean {
        this.removeErrorFeedback();
        const flag = walletId === '' ? false : true;
        return flag;
    }
    reset() {
        const userRoleList = this.global.appState.get('channelData')?.customerDetails?.userRoleList;
        if (userRoleList && this.model.channel.channelData.config.enableMultipleUserSelection) {
            this.model.channel.channelData.customerDetails?.userRoleList?.map((userrole: UserRoleDetails) => {
                this.inputReference.userrole['userrole-' + userrole.walletId] = { checked: false, walletId: userrole.walletId };
            });
        }
    }
    getCPCContent(key:string): string {        
        let content = '';
        switch(key){
        case CPCContentType.user_selection_title:            
            content = this.global.getContent(CPCContentType.user_selection_base_title, CPCContentType.user_selection_title);
            break;
        }
        return content;
    }
}