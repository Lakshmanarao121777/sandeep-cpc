import { ACH, JUMP_ACH_COMPONENT_LOADED, JUMP_BANK_BLOCKED, JUMP_CARD_BLOCKED } from '../constant/app.constant';
import { PaymentType } from '../model/view.model';
import { ErrorHandling } from '../utils/error-handling';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';
import { CommonWebComponent } from './common-web.component';
import { IChannelData } from '../model/channel-data';
import { getBlockingErrorMessage, showBlockError } from '../utils/payment-config';

export class AchOnlyWebComponent extends HTMLElement {  
    _content: DocumentFragment = Object.assign({});
    _displayComponent:string;
    private errorHandling:ErrorHandling = new ErrorHandling();
    commonWebComponent = new CommonWebComponent();
    achOnlyActionDispatcher:ActionObserverService;
    global:Globals;

    get displayComponent() {
        return this._displayComponent;
    }
    set displayComponent(value) {
        if (value) {
            this.setAttribute('display-component', value);
            this._displayComponent = value;
        }
    }
    static get observedAttributes(): string[] {
        return ['display-component'];
    }

    constructor(){
        super(); 
        this.global = Globals.getInstance();
        console.log('ach web component constructor');       
        this._content = new DocumentFragment();
        this._displayComponent = 'true';
        this.achOnlyActionDispatcher = this.global.actionObserverService;
        this.subscribeAdditionalEvents();
        this.commonWebComponent.init('ach-only-base-template',this , this.achOnlyActionDispatcher , JUMP_ACH_COMPONENT_LOADED);   
    }

    attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
        this.commonWebComponent.attributeChangedCallback(attrName , oldValue , newValue , this);
    }
  
    async render(data:any):Promise <void> {
        const page = this.global.appState.get('config')?.cpcPageType;
        if(!this.displayComponent){
            const data = Object.assign({});
            data.showError = false;
            this.commonWebComponent.showError(data,this,PaymentType.AchOnly);
        } else if (this.global.appState.get(JUMP_BANK_BLOCKED)
            && (this.global.appState.get('config')?.cpcPageType === PaymentType[PaymentType.AchOnly].toLowerCase() 
                || this.global.appState.get('config')?.cpcPageType === PaymentType[PaymentType.AchOnlyWithEdit].toLowerCase())) {
            showBlockError(this, JUMP_BANK_BLOCKED, getBlockingErrorMessage(this.global.appState.get(JUMP_CARD_BLOCKED), this.global.appState.get(JUMP_BANK_BLOCKED)), this.global.appState.get('channelData').channelDetails?.cpcMessageDisplayLocation, this.global.actionObserverService);
        } else {
            await this.commonWebComponent.showComponent(data,this,'AchOnlyBaseTemplate');
            const channelData:IChannelData = this.global.appState.get('channelData');
            if(channelData?.config?.iguard?.enableIguardIntegration){
                this.commonWebComponent.disableFields(data, ACH);
            }
            if (this.global.appState.get(JUMP_BANK_BLOCKED)) {
                showBlockError(this, JUMP_BANK_BLOCKED, getBlockingErrorMessage(this.global.appState.get(JUMP_CARD_BLOCKED), this.global.appState.get(JUMP_BANK_BLOCKED)), this.global.appState.get('channelData').channelDetails?.cpcMessageDisplayLocation, this.global.actionObserverService);
            }
        } 
    }

    subscribeAdditionalEvents(){
        this.global.actionObserverService.subscribe((sender:any,data:any)=>{
            if(data?.detail?.action === JUMP_BANK_BLOCKED){
                console.log('bank blocked....');
                this.commonWebComponent.removeComponent('jump-ach-template-container');
                this.commonWebComponent.showError(data.detail.data , this , PaymentType.AchOnly);
            }
        });
    }
}
customElements.define('jump-ach-web-component', AchOnlyWebComponent);